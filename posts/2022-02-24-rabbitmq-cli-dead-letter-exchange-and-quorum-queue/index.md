---
title: RabbitMQ CLI, Dead Letter Exchange and Quorum Queue
date: 2022-02-24T23:00:00+01:00
tags: ['rabbitmq', 'devops', 'cli']
---

Today I've taken a closer look at this code snippet in one of our services:

```java
@Queue("${app.messaging.queueName}")
public void receive(byte[] data,
                    @Nullable @Header("x-redelivered-count") Integer count,
                    RabbitAcknowledgement rabbitAcknowledgement) {
    LOGGER.info("Received message from queue");

    try {
        someService.handleMessage(new String(data, UTF_8));
        rabbitAcknowledgement.ack();
    } catch (Exception ex) {
        LOGGER.warn("Couldn't send queued message to service", ex);
        if (count != null && count >= MAX_REDELIVER_COUNT) {
            LOGGER.error("Max redeliver count limit of {} reached. Message will be discarded.", MAX_REDELIVER_COUNT);
        } else {
            LOGGER.info("Requeue message because of exception from service.");
            count = (count == null ? 1 : ++count);
            rabbitClient.send(count, data);
        }
        rabbitAcknowledgement.ack();
    }
}
```

So this piece makes sure if a message cannot be handled, it should be retried by re-queuing the same message,
but only for a maximum of `MAX_REDELIVER_COUNT` times.

I thought RabbitMQ should be able to handle this logic for us.
And indeed, it offers a retry mechanism.
It just needs to be enabled/used.

In this post, I walk you through the settings and CLI commands for a retry queue.
Also, we will have a dead letter queue, which catches all messages failing for more than `MAX_REDELIVER_COUNT` times.

# Simple topic exchange with classic queue

```bash
docker run -it --name rabbitmq --rm -p 5672:5672 -p 15672:15672 rabbitmq:3.8-management
docker exec -it rabbitmq rabbitmqadmin declare exchange name=my-exchange type=topic durable=true
docker exec -it rabbitmq rabbitmqadmin declare queue name=my-queue durable=true
docker exec -it rabbitmq rabbitmqadmin declare binding source="my-exchange" destination_type="queue" destination="my-queue" routing_key="*"

docker exec -it rabbitmq rabbitmqadmin publish exchange=my-exchange routing_key=my-routing-key properties="{\"delivery_mode\":2}" payload='test'
docker exec -it rabbitmq rabbitmqadmin get queue=my-queue ackmode=ack_requeue_true --depth=4
```

# Add a dead letter queue

Use the same `my-exchange` as above.

```bash
docker exec -it rabbitmq rabbitmqadmin declare exchange name=dead-letter-exchange type=topic durable=true
docker exec -it rabbitmq rabbitmqadmin declare queue name=dead-letter-queue durable=true
docker exec -it rabbitmq rabbitmqadmin declare binding source="dead-letter-exchange" destination_type="queue" destination="dead-letter-queue" routing_key="*"

docker exec -it rabbitmq rabbitmqadmin declare queue name=my-dlx-queue durable=true arguments="{\"x-dead-letter-exchange\":\"dead-letter-exchange\"}"
docker exec -it rabbitmq rabbitmqadmin declare binding source="my-exchange" destination_type="queue" destination="my-dlx-queue" routing_key="*"

docker exec -it rabbitmq rabbitmqadmin publish exchange=my-exchange routing_key=my-routing-key properties="{\"delivery_mode\":2}" payload='test'
docker exec -it rabbitmq rabbitmqadmin get queue=my-dlx-queue ackmode=reject_requeue_false --depth=4
```

Note: We set the `ackmode` to `reject_requeue_false` to reject the message.
The rejected message will be placed in the `dead-letter-queue`.

# Use a quorum queue for automatic retries

RabbitMQ offers a special queue type which has a retry feature: [Quorum queues](https://www.rabbitmq.com/quorum-queues.html).
The feature is named *Poison Message Handling* and can be enabled by setting `x-delivery-limit` on the queue.

> Quorum queues typically require more resources (disk and RAM) than classic mirrored queues.

```bash
docker exec -it rabbitmq rabbitmqadmin declare queue name=my-quorum-queue queue_type=quorum durable=true arguments="{\"x-dead-letter-exchange\":\"dead-letter-exchange\",\"x-dead-letter-routing-key\":\"bar\",\"x-delivery-limit\":3}"
docker exec -it rabbitmq rabbitmqadmin declare binding source="my-exchange" destination_type="queue" destination="my-quorum-queue" routing_key="*"

docker exec -it rabbitmq rabbitmqadmin publish exchange=my-exchange routing_key=my-routing-key properties="{\"delivery_mode\":2}" payload='test'
docker exec -it rabbitmq rabbitmqadmin get queue=my-quorum-queue ackmode=ack_requeue_true --depth=4
```

Note: We set `x-dead-letter-routing-key` this time. This is optional, just to show it is possible.
And of course we set the `queue_type`. This is a [CLI shortcut](https://github.com/rabbitmq/rabbitmq-management/issues/761)
for having an argument `x-queue-type` set to `quorum`.

If we run `rabbitmqadmin get`, we see it has a new header field `x-delivery-count` set to 0.

```
+----------------+-------------+---------------+---------+---------------+------------------+--------------------------+-------------------------------------+-------------+
|  routing_key   |  exchange   | message_count | payload | payload_bytes | payload_encoding | properties.delivery_mode | properties.headers.x-delivery-count | redelivered |
+----------------+-------------+---------------+---------+---------------+------------------+--------------------------+-------------------------------------+-------------+
| my-routing-key | my-exchange | 0             | test    | 4             | string           | 2                        | 0                                   | False       |
+----------------+-------------+---------------+---------+---------------+------------------+--------------------------+-------------------------------------+-------------+
```

We can run the command for three more times, always receiving the same message.
On the fifth time we don't receive any more messages.

If we look into the `dead-letter-queue`, we find it has moved here, which is exactly what we tried to accomplish:
Retry for three times, then move into DLX.

# Simplified consumer

Now back to our Java code, the consumer now looks much simpler:

```java
@Queue(value = "${app.messaging.queueName}", reQueue = true)
public void receive(byte[] data,
                    @Nullable @Header("x-delivery-count") Integer deliveryCount,
                    Envelope envelope) {
    LOGGER.info("Received message from queue. Routing key: {}; Redelivered: {}, Delivery count: {}",
            envelope.getRoutingKey(), envelope.isRedeliver(), deliveryCount);
    someService.handleMessage(new String(data, UTF_8));
}
```

Differences:

- Our self-invented `x-redelivered-count` is replaced by RabbitMQ's `x-delivery-count`.
- We set `reQueue = true` to automatically re-queue messages on exceptions.
- The acknolegment (`RabbitAcknowledgement`) is now done by [our framework](https://micronaut-projects.github.io/micronaut-rabbitmq/3.1.0/guide/index.html#consumerAcknowledge) (Micronaut).
- The whole exception handling block is gone. Yay.

# Possible values for ackmode

See [here](https://github.com/rabbitmq/rabbitmq-server/blob/e36a50a75c12d5aa8d2c7206c49cabfe4116fa72/deps/rabbitmq_management/src/rabbit_mgmt_wm_queue_get.erl#L90)
and [here](https://github.com/rabbitmq/rabbitmq-server/blob/e36a50a75c12d5aa8d2c7206c49cabfe4116fa72/deps/rabbitmq_management/priv/www/js/tmpl/queue.ejs#L318).


| ackmode              | Description               |
|----------------------|---------------------------|
| ack_requeue_true     | Nack message requeue true |
| ack_requeue_false    | Automatic ack             |
| reject_requeue_true  | Reject requeue true       |
| reject_requeue_false | Reject requeue false      |

# Documentation?

I find the documentation about `rabbitmqadmin` very poor.
I had to look up the possible values for `ackmode` in the sources, the option to display message headers (`--depth`) is just not very intuitive, and
the `delivery_mode` 2 for persistent messages is..also not very intuitive. The last one might be the fault of AMQP, but nevertheless the documentation about
it is bad (just mentioned in the [tutorial](https://www.rabbitmq.com/tutorials/tutorial-two-python.html)).

Also, how does `ack_requeue_true` map to *Nack message requeue true*? Well.

# Delay?

I wish there would also be an option to have a delay between retries.
If a service is not available, it might be because of a short downtime and it might be up again in five minutes.

I know about the [rabbitmq-delayed-message-exchange](https://github.com/rabbitmq/rabbitmq-delayed-message-exchange).
However, if we set `x-delay` on the initial message, the first delivery won't be instantly.
I don't know about an easy way to have a message handled instantly for the first time, but having an
(in best case increasing) delay for subsequent retries.

If this is needed, I might start with the Java snippet from above and manually requeue the message with a programmatically set `x-delay` header.
Another option I haven't tried is using a dead-letter-queue
[combined](https://dev.to/realflowcontrol/delayed-requeuing-with-rabbitmq-kc7)
[with a](https://dzone.com/articles/rabbitmq-consumer-retry-mechanism)
[time-to-live (TTL)](https://jack-vanlightly.com/blog/2017/3/24/rabbitmq-delayed-retry-approaches-that-work),
but to me that seems like abusing the dead-letter concept a bit and you end up with a lot of queues and exchanges. Simplicity? Gone.

It's a shame this feature is not supported out-of-the-box, because I think it's a pretty common use case.
