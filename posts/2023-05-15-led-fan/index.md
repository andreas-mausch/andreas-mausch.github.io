---
title: "Programmable LED fan"
date: 2023-05-15T19:00:00+02:00
tags: ['fan', 'led']
thumbnail: borders-on-fan.jpg
---

{% image "led-fan-animation.webp" %}

The fan came with a small CD-ROM for a Windows software to program the LEDs.

However, I quickly found a project on GitHub to do the same on Linux and MacOS:

[https://github.com/fergofrog/microwave_usb_fan](https://github.com/fergofrog/microwave_usb_fan)

The examples work great.
You can upload multiple 144x11px images which are shown in sequence, and you can add a (simple) predefined animation to it.

One thing I noticed: You cannot address all of the available circular space.
See this example file:

{% image "borders.png" %}

This leads to the result from the thumbnail:

{% image "borders-on-fan.jpg" %}

As you can see, a small portion remains black.

Some more example files:

{% image "hello.png" %}

{% image "smiley.png" %}

{% image "table-flip.png" %}

To generate the table flipper I have used this command:

```bash
magick convert -size 144x11 -background black -gravity center +antialias -font "Source-Han-Sans-CN-Bold" -pointsize 9 -fill red label:"(ノ ゜Д゜)ノ ︵ ┻━┻" PNG24:image.png
```

{% image "smiley-on-fan.jpg" %}

{% image "full-setup.jpg" %}

{% image "fan-still.jpg" %}
