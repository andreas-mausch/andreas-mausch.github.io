---
layout: post
title: "Show images in terminal"
date: 2021-07-21 10:00:00 +02:00
tags:
---

Sometimes it is useful to display an image or video in the terminal,
for example if you are on a ssh connection.

I used to use `tiv` ([Link](https://github.com/stefanhaustein/TerminalImageViewer))
for this purpose, but now I've switched to `timg` ([Link](https://github.com/hzeller/timg)).

Images just look better and the detection for terminal width and height works also better.

See the two example screenshots of tiv and timg in *xfce4-terminal*.

tiv:

![]({{ site.baseurl }}/images/2021-07-21-show-images-in-terminal/tiv.png)

timg:

![]({{ site.baseurl }}/images/2021-07-21-show-images-in-terminal/timg.png)

As you can see, the aspect ration is off for tiv, and I had to adjust the height.
It seems to use the whole width by default and ignores the height, while timg
detects both, width and height, correctly.
