---
layout: post
title: "RabbitMQ: Message persistence and Metrics"
date: 2021-05-17 19:00:00 +02:00
tags: rabbitmq, devops, metrics
---

# Persistence

We've noticed our RabbitMQ lost messages when the container had to be restarted.

Three things to consider to not lose stuff on a restart:

- Your exchanges and queues should be **durable**
- Your messages should be **persistent**
- If you run RabbitMQ via Docker, make sure to set a fixed hostname

Links to RabbitMQ's documentation:

- [Queue durability](https://www.rabbitmq.com/queues.html#durability)
- [Message durability](https://www.rabbitmq.com/tutorials/tutorial-two-python.html) (scroll down to *Message durability*)
- [Persistence Configuration](https://www.rabbitmq.com/persistence-conf.html)

I will show you how I enabled queue and message durability in a Java project based on Micronaut.

![]({{ site.baseurl }}/images/2021-05-17-rabbitmq-persistence/rabbitmq-persistence.png)

## Queue and Exchange durability

### Java Client

The RabbitMQ Java client's method `com.rabbitmq.client.Channel#queueDeclare` takes a boolean parameter `durable`.
Set it to true when you declare your queue, and you're done.
The queue will now survive a restart.

Same for exchanges in the method `com.rabbitmq.client.Channel#exchangeDeclare`.

### Micronaut

You will most likely have an implementation of `ChannelInitializer`, as shown in their
[documentation](https://micronaut-projects.github.io/micronaut-rabbitmq/latest/guide/#initialization).

There, you will find the declaration calls.

### CLI

```bash
rabbitmqadmin declare exchange name=my-new-exchange type=fanout durable=true
rabbitmqadmin declare queue name=my-new-queue durable=true
```

## Message durability

### Java Client

Now for the message durability, the method `com.rabbitmq.client.Channel#basicPublish` takes a parameter `props` of the type
`BasicProperties`. In there, you need to set `deliveryMode` to the magic hard-coded value `2`. Well.

### Micronaut

For a Micronaut producer, find the class annotated with `@RabbitClient`.
There, you can set another annotation `@RabbitProperty` as follows:

```java
@RabbitClient("exchange-name")
@RabbitProperty(name = "deliveryMode", value = "2")
```

### CLI

If you like to use the RabbitMQ cli, you can do it as follows:

```bash
rabbitmqadmin -u rabbitmq -p password publish exchange=my-exchange routing_key=my-routing-key properties="{\"delivery_mode\":2}" payload='test'
```

## Set a fixed hostname for RabbitMQ container

> Rabbitmq uses the hostname as part of the folder name in the mnesia directory. Maybe add a --hostname some-rabbit to your docker run?

[github.com](https://github.com/docker-library/rabbitmq/issues/106#issuecomment-241882358)

This is how the *mnesia* directory looks like after a few restarts if you **don't** set a hostname:

![]({{ site.baseurl }}/images/2021-05-17-rabbitmq-persistence/rabbitmq-hostname.png)

Docker generates a new hostname every container run, and RabbitMQ takes it to create the directory structure.

Solution: Set the hostname via `--hostname rabbitmq` or in your *docker-compose.yml* via `hostname: rabbitmq`.

# Metrics

RabbitMQ has a [big tutorial](https://www.rabbitmq.com/prometheus.html) on how to use their built-in prometheus-compatible metrics.

For my needs, adding this to my Prometheus `scrape_configs` was enough:

```
  - job_name: 'rabbitmq-server'
    static_configs:
    - targets:
        - 'rabbitmq:15692'
```

I use the *rabbitmq:3.8-management* docker image, which seems to already have
[the metrics endpoint available](https://github.com/docker-library/rabbitmq/blob/e62f193dfcf9aee378e256cbbfae30363480c3a7/3.8/ubuntu/Dockerfile#L255).

![]({{ site.baseurl }}/images/2021-05-17-rabbitmq-persistence/rabbitmq-metrics.png)

```
$ docker ps
63ae8f15f137 rabbitmq:3.8-management "docker-entrypoint.s…" 10 minutes ago Up 9 minutes rabbitmq

$ docker exec -it rabbitmq rabbitmq-plugins list
Listing plugins with pattern ".*" ...
 Configured: E = explicitly enabled; e = implicitly enabled
 | Status: * = running on rabbit@rabbitmq
 |/
[  ] rabbitmq_amqp1_0                  3.8.16
[  ] rabbitmq_auth_backend_cache       3.8.16
[  ] rabbitmq_auth_backend_http        3.8.16
[  ] rabbitmq_auth_backend_ldap        3.8.16
[  ] rabbitmq_auth_backend_oauth2      3.8.16
[  ] rabbitmq_auth_mechanism_ssl       3.8.16
[  ] rabbitmq_consistent_hash_exchange 3.8.16
[  ] rabbitmq_event_exchange           3.8.16
[  ] rabbitmq_federation               3.8.16
[  ] rabbitmq_federation_management    3.8.16
[  ] rabbitmq_jms_topic_exchange       3.8.16
[E*] rabbitmq_management               3.8.16
[e*] rabbitmq_management_agent         3.8.16
[  ] rabbitmq_mqtt                     3.8.16
[  ] rabbitmq_peer_discovery_aws       3.8.16
[  ] rabbitmq_peer_discovery_common    3.8.16
[  ] rabbitmq_peer_discovery_consul    3.8.16
[  ] rabbitmq_peer_discovery_etcd      3.8.16
[  ] rabbitmq_peer_discovery_k8s       3.8.16
[E*] rabbitmq_prometheus               3.8.16
[  ] rabbitmq_random_exchange          3.8.16
[  ] rabbitmq_recent_history_exchange  3.8.16
[  ] rabbitmq_sharding                 3.8.16
[  ] rabbitmq_shovel                   3.8.16
[  ] rabbitmq_shovel_management        3.8.16
[  ] rabbitmq_stomp                    3.8.16
[  ] rabbitmq_top                      3.8.16
[  ] rabbitmq_tracing                  3.8.16
[  ] rabbitmq_trust_store              3.8.16
[e*] rabbitmq_web_dispatch             3.8.16
[  ] rabbitmq_web_mqtt                 3.8.16
[  ] rabbitmq_web_mqtt_examples        3.8.16
[  ] rabbitmq_web_stomp                3.8.16
[  ] rabbitmq_web_stomp_examples       3.8.16
```

Note that the [official examples](https://github.com/rabbitmq/rabbitmq-server/blob/cb4e293cc7b8524cced8c7f84ba11023c61c84b5/deps/rabbitmq_prometheus/docker/docker-compose-overview.yml)
use a different docker image: *pivotalrabbitmq/rabbitmq-prometheus*
