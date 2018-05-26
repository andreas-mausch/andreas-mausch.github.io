---
layout: post
title:  "Undervolting the XPS 15 9550 on Linux (i7-6700HQ)"
date:   2018-05-22 22:00:00 +02:00
tags:
---

Undervolting in notebooks is useful to reduce temperatures, avoid throttling and extend battery life.

I tried to undervolt my notebook already some months ago, and found [mihic/linux-intel-undervolt](https://github.com/mihic/linux-intel-undervolt). However, I didn't get it to work because I didn't know what I was doing and `rdmsr 0x150` always returned 0 for me, even after `sudo modprobe msr`.
I think my mistake was to not execute it on every single core.

But today, I found this [georgewhewell/undervolt](https://github.com/georgewhewell/undervolt). A small python script which does all the complicated work.
According to the internet most Intel CPUs can be undervolted easily by 100 mV. While this doesn't sound like much, it's almost a 10% cut of the default 1.2 V.

I got my CPU working with a delta of 130 mV:

```bash
sudo ./undervolt.py --gpu -50 --core -130 --cache -100 --uncore -130 --analogio -100
```

![]({{ site.baseurl }}/images/2018-05-22-undervolting/cmd.jpg)

I've executed `stress --cpu 8` and temperates dropped from 97 degrees to 83, and power consumption from 60 W to 48 W.
This is quite significant.

![]({{ site.baseurl }}/images/2018-05-22-undervolting/glances.jpg)

(The tool shown here is [glances](https://nicolargo.github.io/glances/), a great alternative to top)

For throttling, for the newer XPS this [YouTube video](https://www.youtube.com/watch?v=nobnPDtMs-E) shows you can get ~12% better performance with undervolting, because the CPU doesn't need to reduce it's frequency due to hitting the temperature limit.
