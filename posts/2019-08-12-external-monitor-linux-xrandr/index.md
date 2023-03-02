---
title: External monitor on Linux
date: 2019-08-12T21:00:00+02:00
tags: ['external', 'monitor', 'second', 'screen', 'linux', 'manjaro', 'xrandr']
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

What's neat: If you close the lid while the notebook is connected to the external monitor, it doesn't go into sleep mode.

**Problems with autorandr**

I now had two different laptops where autorandr caused problems.
After connecting to a screen I had no output (not even on the laptop screen)
and xrandr commands were "ignored": It returned immediately, but didn't change anything.

I don't know a good alternative, so I will keep custom xrandr scripts for my different displays. :(

I might try [xlayoutdisplay](https://github.com/alex-courtis/xlayoutdisplay)
in future, although it works a bit differently.

**Update**: This doesn't seem to be a problem of autorandr, but rather some display driver issue,
even though I've experienced this issue on two different devices.
I had the same problem with autorandr uninstalled and using xrandr directly now.
