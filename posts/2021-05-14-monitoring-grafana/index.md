---
title: "Monitoring: Grafana, Loki, Prometheus, Alertmanager"
date: 2021-05-14T14:00:00+02:00
tags: ['monitoring', 'logging', 'alerting', 'metrics', 'grafana', 'loki', 'prometheus', 'alertmanager', 'docker', 'devops']
thumbnail: prometheus.png
---

Most of the times I evaluate tools or libraries I get disappointed:
Bugs in the most common features, missing the simplest of use-cases, bad documentation, etc.

So that's why I've decided to write a praise to Grafana and Loki,
which I've both heavily enjoyed to set up and use.

See my repo with a fully running setup here: [andreas-mausch/grafana-prometheus-loki-alertmanager-setup](https://github.com/andreas-mausch/grafana-prometheus-loki-alertmanager-setup)

{% image "grafana.png" %}

{% image "prometheus.png" %}

{% image "mailhog.png" %}

# Background

I've used the ELK stack at AWS before (Elasticsearch, Logstash, Kibana), and maybe my setup
contained errors, but the user experience in general was awful for me.
Searches took long time (>20sec), I didn't like the filtering much and from time to time
the server crashed on pretty much basic queries.

Now in my current project I was looking for alternatives.
I knew Grafana from a previous project, but never set it up myself
(we had a dedicated Ops team there).

So this was now my first time to set up Grafana myself.
I will not go into too much details, you will find an excellent documentation at Grafana Labs.
Instead, I will just write down steps I've handled differently.

Spoiler: I ended up with a solution where I can search the logs from all our services full-text
within <3seconds and I have alerting on logs which contain words like 'error' or 'exception'.

# Prometheus, Alertmanager

Both of them were already set up before.
We use [cadvisor](https://prometheus.io/docs/guides/cadvisor/) to get notified whenever a
docker service has problems.
One thing I'm really missing here is the healthcheck (see [the issue here](https://github.com/google/cadvisor/issues/2166)),
but beside that it works well.

# Loki, Docker Driver

Loki runs as a simple docker container and the [docker plugin](https://grafana.com/docs/loki/latest/clients/docker-driver/)
sends the logs from the containers to the loki server.

The alternative to the docker driver would be [Promtail](https://grafana.com/docs/loki/latest/clients/promtail/), which reads log files
from a specified directory and forwards them to Loki.

## Configuration

For docker swarm users: Unfortunately, there is no setting to configure the log-opts per docker stack, only per service.
So you need to either set them globally, or duplicate them at each container.

The changes I made to the default config file (*/etc/loki/config.yaml*) was the connection to the alertmanager
and the persistence settings (see below).
Also, I've added a */etc/loki/rules/alerts/rules.yml* for the alerting.

## Permission

```
loki_1     | level=error ts=2021-05-14T16:19:26.017663788Z caller=log.go:106 msg="error initializing bucket client" err="mkdir /data/loki/chunks: permission denied"
```

I can find [two](https://github.com/grafana/loki/issues/1833) [issues](https://github.com/grafana/loki/issues/2018)
for this error, but they have been closed already. I still have this problem though.

My (ugly) workaround: Let run loki as root.

# Grafana

Grafana has two data sources: Prometheus and Loki.  
You can search for log entries and also see all Prometheus metrics in Grafana. Nice.

## Authentication

We use a Keycloak server for user authentication, and it was easily possible to connect Grafana to it via their OAuth settings.

One note here: You configure four URLs in Grafana: *auth_url*, *token_url*, *api_url* and *signout_redirect_url*.
Our Grafana container has no access to the internet, and therefore we couldn't use the public keycloak URL in all cases.
That would have required some proxy configuration at least.

But there is a difference in the URLs: Some of them are called by the user's browser, and some of them are called by the Grafana container!

So only *auth_url* and *signout_redirect_url* are called by the user, and they need to be publicly available URLs.
*token_url* and *api_url* can be set to URLs only accessible in the local network (they should lead to the same Keycloak server though).

### User exists in Keycloak, but has no grafana role

Currently, Grafana cannot deny access to an authenticated user.  
He will at least get the *Viewer* role.

But in the latest unreleased version there is a fix already: `role_attribute_strict`.  
See [here](https://github.com/grafana/grafana/pull/28021) and [here](https://github.com/grafana/grafana/issues/23218).

I will be available in version 8.0.0.

### My auth settings for Grafana

```
[auth]
disable_login_form = true
oauth_auto_login = true
signout_redirect_url = https://keycloak.mycompany.com/auth/realms/my-realm/protocol/openid-connect/logout

[auth.anonymous]
enabled = false

[auth.generic_oauth]
name = Keycloak
enabled = true
client_id = grafana
client_secret = {{ grafana_client_secret }}
scopes = openid profile email
email_attribute_name = email:primary
role_attribute_path = "roles[*] && contains(roles[*], 'admin') && 'Admin' || roles[*] && contains(roles[*], 'editor') && 'Editor' || roles[*] && contains(roles[*], 'viewer') && 'Viewer' || 'Forbidden'"
role_attribute_strict = true
auth_url = https://keycloak.mycompany.com/auth/realms/my-realm/protocol/openid-connect/auth
token_url = http://keycloak.intranet/auth/realms/my-realm/protocol/openid-connect/token
api_url = http://keycloak.intranet/auth/realms/my-realm/protocol/openid-connect/userinfo

# Logging for debugging OAuth Token
[log]
filters = oauth:debug oauth.generic_oauth:debug
```

Use the debug log to analyze errors, display the token etc.

These two links were helpful:
- [https://www.lars-fischer.me/posts/2021/grafana-sso-integration-with-keycloak/](https://www.lars-fischer.me/posts/2021/grafana-sso-integration-with-keycloak/)
- [https://janikvonrotz.ch/2020/08/27/grafana-oauth-with-keycloak-and-how-to-validate-a-jwt-token/](https://janikvonrotz.ch/2020/08/27/grafana-oauth-with-keycloak-and-how-to-validate-a-jwt-token/)

# Multiline

One feature which is pretty essential in my opinion and is only available
since [March 2021](https://grafana.com/blog/2021/03/11/grafana-loki-2.2-released-multi-line-logs-crash-resiliency-and-performance-improvements/): multiline stages.  

Your Java application might produce a single (multi-line) log event for an Exception,
but the docker logs handle them just as separate single lines.
So Loki cannot easily decide which blocks of lines belong together.
That's why you can set up the multiline stage and tell Loki a regex pattern which your log entries start with,
for example a timestamp.
Loki will then group these lines again and Grafana can display them together.

{% image-comparison "before-multiline.png" "after-multiline.png" %}

# Colors

A special note here: If you use colored output for your log files, you need to include the hex codes in the regex.

I've used this *'^\d{2}:\d{2}:\d{2},\d{3}'* regex and was surprised it didn't match the following line:
`13:37:00,123 Test output`

That's because I had colored logs configured with logback:

```
%cyan(%d{HH:mm:ss.SSS}) %gray([%thread]) %highlight(%-5level) %magenta(%logger{36}) - %msg%n
```

This leads to the first character not being a *1*, but the hex value 0x1B (or *\033* octal):
The [ASCII Escape character](https://en.wikipedia.org/wiki/Escape_character#ASCII_escape_character)

{% image "hello-world-colored.png" %}

So in order to filter by the colored output, I've used this regex:

```
^\x1B\[36m\d{2}:\d{2}:\d{2},\d{3}
```

# Persistence

When playing around with loki and restarting the service a couple of times,
I've noticed I lost log entries.

## Ingester, Write-Ahead Log

Some investigation, and I found that the *ingester* only persists logs every few minutes.
This can be configured, at *chunk_idle_period* for [example](https://grafana.com/docs/loki/latest/configuration/#ingester_config).

Now, there is a good blog post at Grafana Labs where they explain how to not lose data.
It's pretty recent (Feb 2021), because the feature is just available.  
Here: [https://grafana.com/blog/2021/02/16/the-essential-config-settings-you-should-use-so-you-wont-drop-logs-in-loki/](https://grafana.com/blog/2021/02/16/the-essential-config-settings-you-should-use-so-you-wont-drop-logs-in-loki/)

I'm still wondering how these can not be the defaults settings though. :(  
I'm also wondering how the WAL config is not mentioned anywhere on their
[example config page](https://grafana.com/docs/loki/latest/configuration/examples/).

So please enable the Write-Ahead Log (WAL) and make sure the directory is persisted, for example in a docker volume.
Check [my loki config](https://github.com/andreas-mausch/grafana-prometheus-loki-alertmanager-setup/blob/master/loki/loki.yml) for an example.

I've ran into this error, which could be easily fixed by doing what the error message suggests:

```
invalid ingester config: the use of the write ahead log (WAL) is incompatible with chunk transfers. It's suggested to use the WAL. Please try setting ingester.max-transfer-retries to 0 to disable transfers
```

Strange: [The docu](https://grafana.com/docs/loki/latest/operations/storage/wal/) talks about a `--ingester.recover-from-wal` setting.

> `--ingester.recover-from-wal` to true to recover data from an existing WAL. The data is recovered even if WAL is disabled and this is set to true. The WAL dir needs to be set for this. If you are going to enable WAL, it is advisable to always set this to true.

I couldn't find it anywhere (even browsed the sources), so I did not use it.

## Retention

And last, I've set the loki *retention_period* to 14 days to get rid of old logs and keep the disk usage low.

Note: There are two retention times.
One for loki, and one for Prometheus.
Prometheus setting is named *storage.tsdb.retention.time* and defaults to 15 days.
I haven't changed the value.

# Memory usage

I've updated the grafana dashboard to also display the memory usage per docker compose service.
Data comes from cadvisor.

The Prometheus query is this:

```
sum by (container_label_com_docker_compose_service) (container_memory_usage_bytes{container_label_com_docker_compose_service=~".+"})
```

In case you use docker swarm, you can use *container_label_com_docker_swarm_service_name* instead of *container_label_com_docker_compose_service*.

{% image "grafana-with-memory-usage.png" %}
