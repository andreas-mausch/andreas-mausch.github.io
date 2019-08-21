---
layout: cheatsheet
tags: autorandr external-monitor
section:
  - name: Output to external monitor
    commands:
      FullHD: xrandr --output DP1 --primary --mode 1920x1080 --scale-from 1920x1080 --same-as eDP1
      WQHD from 4K: xrandr --output DP1 --primary --mode 2560x1440 --scale-from 3840x2160 --same-as eDP1
  - name: autorandr
    commands:
      Enable on startup: sudo systemctl enable --now autorandr.service
      Save profile: autorandr --save <name>
---
