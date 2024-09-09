---
title: "RabbitMQ: Automatic retries with increasing delay"
date: 2024-08-29T19:30:00+02:00
tags: ['rabbitmq', 'devops', 'retries', 'delay', 'message-queue']
thumbnail: plantuml.svg
---

I have finally implemented a solution to automatic retries for
a RabbitMQ message queue.
I have pointed out the problem of retrying failed messages with a delay in a
[previous post]({% link-post "2022-02-24-rabbitmq-cli-dead-letter-exchange-and-quorum-queue" %}).

I am still sad there is no ready-to-use solution and you have to write code yourself
to make this work, but well. At least it is a solution.

You can find an example project in python here:
[https://github.com/andreas-mausch/rabbitmq-with-retry-and-delay](https://github.com/andreas-mausch/rabbitmq-with-retry-and-delay)

The concept is heavily inspired by
[https://devcorner.digitalpress.blog/rabbitmq-retries-the-new-full-story/](https://devcorner.digitalpress.blog/rabbitmq-retries-the-new-full-story/).

```plantuml
@startuml "messagebus"
!include <C4/C4_Container>
!include <material/common>
!include <material/file_send>

skinparam handwritten true

HIDE_STEREOTYPE()

AddElementTag("exchange", $shape=EightSidedShape(), $fontColor="white")
AddElementTag("queue", $shape=EightSidedShape(), $fontColor="white")
AddElementTag("consumer", $bgColor="#6DA34D")
AddElementTag("my", $bgColor="#62929E")
AddElementTag("retry-error", $bgColor="#CC8635")
AddElementTag("retry-delay", $bgColor="#B5533F")
AddElementTag("retry-dead-letter", $bgColor="#666666")

System_Ext(producer, "Producer", "", $sprite="&cog,scale=5,color=#ffffff")
System_Ext(consumer, "Consumer", "", $sprite="&cog,scale=5,color=#ffffff", $tags="consumer")

System_Boundary(rabbitmq, "Message Broker", $descr="RabbitMQ") {
  Container(my_exchange, "my-exchange", $tags="exchange+my")
  ContainerQueue(my_queue, "my-queue", $tags="my")

  Boundary(retry_block, "Retry Block") {
    Container(retry_error_exchange, "retry-error-exchange", $tags="exchange+retry-error")
    ContainerQueue(retry_error_queue, "retry-error-queue", $tags="queue+retry-error")

    Container(retry_delay_exchange, "retry-delay-exchange", "type: x-delayed-message", $tags="exchange+retry-delay")
    ContainerQueue(retry_delay_queue, "retry-delay-queue", $tags="queue+retry-delay")

    Container(retry_dead_letter_exchange, "retry-dead-letter-exchange", $tags="exchange+retry-dead-letter")
    ContainerQueue(retry_dead_letter_queue, "retry-dead-letter-queue", $tags="queue+retry-dead-letter")
  }
}

Rel_Down(producer, my_exchange, "Sends message", "AMQP")
Rel_Right(my_exchange, my_queue, "binding")
Rel(consumer, my_queue, "Consumes message")
Rel(consumer, retry_error_exchange, "\non error", $sprite="&warning,scale=5,color=red")
Rel_Left(retry_error_exchange, retry_error_queue, "binding")
Rel_Left(retry_error_queue, retry_delay_exchange, "send with increasing x-delay")
Rel_Down(retry_error_queue, retry_dead_letter_exchange, "on too many retries")
Rel_Left(retry_dead_letter_exchange, retry_dead_letter_queue, "send")
Rel_Left(retry_delay_exchange, retry_delay_queue, "wait and forward", $sprite="&clock,scale=5,color=purple")
Rel(retry_delay_queue, my_exchange, "requeue to\nx-first-death-exchange")

Lay_Right(producer, consumer)
Lay_Right(producer, my_exchange)
Lay_Down(consumer, rabbitmq)
Lay_Down(my_exchange, retry_block)
Lay_Down(my_queue, retry_block)

@enduml
```

# Breakdown

So we have a bunch of extra exchanges and queues for this approach.

The main difference to Cyril's solution is that we don't re-send the message to a queue directly,
but rather to it's original exchange with it's routing key.

One good thing though is: We can use this retry-block for as my queues as we like.
It doesn't have to be repeated for each queue. Phew.

So we can set up a number of retries in our code, each having a delay time.
When a message still couldn't be delivered after the last delay, it
is finally sent to the `retry-dead-letter-exchange`.
There, an admin can look regulary which messages had problems to be consumed.

In the example code the retry delays are:

- 5 seconds
- 2 minutes
- 30 minutes
- 6 hours
- 2 days

My example also covers the case of having a quorum queue, and here it is a bit disappointing:
Even though you can still use the retry mechanism via `x-delivery-limit`, the retries will
still be **immediate**.
If you want to have increasing delay here as well, you must skip the automatic quorum queue
mechanism by setting `requeue=False` in case of an error, so the dead-letter-exchange
(`retry-error-exchange`) will be used instead.

{% image "rabbitmq-retry-with-delay.png" %}

# Why do we need a delay exchange?

First, I was surprised we need that second exchange in the retry-block.
Why not just have a single one?

The reason is: In order for `x-delay` to work, we need an exchange of the type `x-delayed-message`.
So we have the choice of either making our normal exchanges all of this type, or
rather have only a single place for this exception.

And the `retry-error-exchange` cannot be the exchange to be `x-delay-message`, because
at this point the message doesn't have the `x-delay` header yet.

# Error handling

So we have covered the case something goes wrong inside our consumer.

In case there is a problem in the consumers of the `retry-error-queue` or the `retry-delay-queue` themselves,
we define a dead letter exchange for them as well, and it is also the `retry-dead-letter-exchange`.

Now we keep all non-consumable messages for analysis:
even if all retries failed and even if there was a processing problem inside
the retry handlers.

# RabbitMQ Delay Plugin

One more downside to this solution:
We cannot just use the basic RabbitMQ docker image anymore, because we need to have
the [delayed-message-exchange](https://github.com/rabbitmq/rabbitmq-delayed-message-exchange/) enabled.

See [Scheduling Messages with RabbitMQ](https://www.rabbitmq.com/blog/2015/04/16/scheduling-messages-with-rabbitmq).

I use `heidiks/rabbitmq-delayed-message-exchange:3.13.3-management` for now, but we'll
see how well this is maintained over time.
