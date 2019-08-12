---
layout: post
title:  "External monitor on Linux"
date:   2019-08-12 21:00:00 +02:00
tags:
---

# On each connect

Short command to set the correct resolution and scaling for an external monitor.  
I've decided to write this down because the *--scale-from* parameter seems to be uncommon. Most suggestions on the internet only use *--scale*, which I find less intuitive to use.

```bash
# XPS 13 with full hd display
xrandr --output DP1 --primary --mode 1920x1080 --scale-from 1920x1080 --same-as eDP1
# XPS 15 with 4k display on an external WQHD display
xrandr --output DP1 --primary --mode 2560x1440 --scale-from 3840x2160 --same-as eDP1
```

# Automate it by using [*autorandr*](https://github.com/wertarbyte/autorandr)

```bash
sudo pacman -S autorandr
sudo systemctl enable --now autorandr.service
```

I've created two profiles.
- First, I connect **no** external monitor.
- Then I run `autorandr --save default`.
- Next, connect the external monitor.
- Run the fitting xrandr command above. Check everything looks nice.
- Run `autorandr --save docked`.

autorandr should switch to the correct mode automatically (hence the name) from now on.
