---
title: Hypriot Docker and remote access
date: 2015-12-18T20:00:00+01:00
tags: ['docker', 'hypriot', 'raspberrypi']
---
Hypriot offers an Raspberry Pi image to run docker.  
[http://blog.hypriot.com/](http://blog.hypriot.com/)

However, by default docker doesn't listen on a network port which would allow to conveniently run docker commands from another host.

# Make docker listen on network interface

Find and replace the following line:

```{data-filename=/lib/systemd/system/docker.service}
# Old:
ExecStart=/usr/bin/docker daemon -H fd:// $DOCKER_OPTS
# New:
ExecStart=/usr/bin/docker daemon -H tcp://0.0.0.0:2375 $DOCKER_OPTS
```

Either restart docker (`sudo service docker restart`) or your Pi.

### Remote docker run

Now you can run `docker build` and `docker run` on another computer with DOCKER_HOST=%IP_OF_HYPRIOT%:2375 set.

```bash
DOCKER_HOST=192.168.178.37:2375 docker run -it --rm ubuntu:14.04 /bin/echo "Hello world"
```
