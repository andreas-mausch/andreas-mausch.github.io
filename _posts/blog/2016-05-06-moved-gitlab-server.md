---
layout: post
title:  "Moved Gitlab server to another host"
date:   2016-05-06 00:00:00 +02:00
tags:
---
I am using the Gitlab Community Edition for private projects.

[http://doc.gitlab.com/omnibus/docker/](http://doc.gitlab.com/omnibus/docker/)

Now I wanted to replace the Acer Revo with a more powerful Intel NUC i5 I bought.
So I copied all volumes referenced by the docker container
(for me it was ./gitlab/config, ./gitlab/data and ./gitlab/logs) and tried to
start gitlab/gitlab-ce:latest.

In the log files (docker logs gitlab) Gitlab told me the permissions have changed
due to the copying. I searched the internet, found [this on github.com](https://github.com/gitlabhq/gitlabhq/issues/9611) and I had to run:

{% highlight bash %}
docker exec gitlab update-permissions
{% endhighlight %}

However, I still got error messages like "Couldn't connect to redis".
I took a look at the file system manually and found the permissions have not been
set correctly. I had to run this command to fix it:

{% highlight bash %}
docker exec gitlab chown -R gitlab-redis:gitlab-redis /var/opt/gitlab/redis/
docker restart gitlab
{% endhighlight %}
