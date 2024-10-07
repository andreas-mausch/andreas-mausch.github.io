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

# Checkout sixel!

(Edit 2023-08-14)

[https://www.arewesixelyet.com/#xfce-terminal](https://www.arewesixelyet.com/#xfce-terminal)

Since last week, xfce4-terminal supports the sixel format [link](https://gitlab.xfce.org/apps/xfce4-terminal/-/commit/493a7a54b437df9419847b29fe94eae671816c09).
With it, you will finally be able to draw pixel-perfect images on the terminal.
timg already supports it.

There is no release of xfce4-terminal yet, but all issues in the milestone 1.1.0 [are completed](https://gitlab.xfce.org/apps/xfce4-terminal/-/milestones/2#tab-issues),
including the [sixel one](https://gitlab.xfce.org/apps/xfce4-terminal/-/issues/76).

On Manjaro, I had to install [vte3-git](https://aur.archlinux.org/packages/vte3-git) (which comes with sixel support)
and [xfce4-terminal-git](https://aur.archlinux.org/packages/xfce4-terminal-git) from AUR.
And of course I had to update my [timg](https://aur.archlinux.org/packages/timg).

I'm sure this will be the defacto-standard in no time.

I now like to call timg like this:

```bash
timg --pixelation=sixel --grid=2 image.png
```

{% image "timg-sixel.png" %}

Update 2023-08-30: Since last week, tmux now also supports sixel:
[https://github.com/tmux/tmux/commit/dfbc6b1888c110cf0ade66f20188c57757ee1298](https://github.com/tmux/tmux/commit/dfbc6b1888c110cf0ade66f20188c57757ee1298)

# viu

~~I've replaced `timg` by [viu](https://github.com/atanunq/viu) on my machine.~~
It is written in Rust and comes with (experimental) sixel support.

Unfortunately, sixel is still not integrated into vte3, so you would still need to build it yourself. :(
See here: [https://gitlab.gnome.org/GNOME/vte/-/issues/253](https://gitlab.gnome.org/GNOME/vte/-/issues/253)

Update:
viu does not support exif orientation for .jpg images, so I am back to timg.
Together with the `rio` terminal, it supports sixel as well.
