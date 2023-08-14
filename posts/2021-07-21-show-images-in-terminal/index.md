---
title: Show images in terminal
date: 2021-07-21T10:00:00+02:00
tags: ['cli', 'terminal', 'images', 'tiv', 'timg']
thumbnail: timg.png
---

Sometimes it is useful to display an image or video in the terminal,
for example if you are on a ssh connection.

I used to use `tiv` ([Link](https://github.com/stefanhaustein/TerminalImageViewer))
for this purpose, but now I've switched to `timg` ([Link](https://github.com/hzeller/timg)).

Images just look better and the detection for terminal width and height works also better.

See the two example screenshots of tiv and timg in *xfce4-terminal*.

tiv:

{% image "tiv.png" %}

timg:

{% image "timg.png" %}

As you can see, the aspect ration is off for tiv, and I had to adjust the height.
It seems to use the whole width by default and ignores the height, while timg
detects both, width and height, correctly.

Edit (2023-08-14):

Checkout sixel!

[https://www.arewesixelyet.com/#xfce-terminal](https://www.arewesixelyet.com/#xfce-terminal)

Since last week, xfce4-terminal supports the sixel format [link](https://gitlab.xfce.org/apps/xfce4-terminal/-/commit/493a7a54b437df9419847b29fe94eae671816c09).
With it, you will finally be able to draw pixel-perfect images on the terminal.
timg already supports it.

There is no release of xfce4-terminal yet, but all issues in the milestone 1.1.0 [are completed](https://gitlab.xfce.org/apps/xfce4-terminal/-/milestones/2#tab-issues),
including the [sixel one](https://gitlab.xfce.org/apps/xfce4-terminal/-/issues/76).
