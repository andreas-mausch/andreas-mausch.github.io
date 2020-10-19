---
layout: post
title:  "Android: LineageOS, Root and TWRP Recovery on Samung Galaxy S7"
date:   2020-10-19 23:00:00 +02:00
tags:
---

To get full control of the phone, I've installed LineageOS with root access.

The following instructions might result in data loss, so make sure you have a backup of all data on the phone!

# Install TWRP recovery

[Download](https://twrp.me/samsung/samsunggalaxys7.html)

First, you need to boot into *Odin Mode*.
Press and hold *Power*+*Home*+*Volume Down*.

![]({{ site.baseurl }}/images/2020-10-19-s7-lineageos/01-warrenty-warning.jpg)

Confirm you are about to lose warrenty by pressing *Volume Up*.

![]({{ site.baseurl }}/images/2020-10-19-s7-lineageos/02-odin-mode.jpg)

On Manjaro, I've used [heimdall](https://www.archlinux.org/packages/community/x86_64/heimdall/):

```bash
heimdall detect --verbose
heimdall flash --RECOVERY twrp-3.4.0-0-herolte.img --no-reboot
```

Important: **Immediately** after the screen turns black, press and hold *Power*+*Home*+*Volume Up*
to boot into the recovery. If the original ROM is loaded, it will restore the recovery
and you need to start over again.

# In TWRP

![]({{ site.baseurl }}/images/2020-10-19-s7-lineageos/03-twrp-boot.jpg)
![]({{ site.baseurl }}/images/2020-10-19-s7-lineageos/04-twrp-readonly-warning.jpg)

## Wipe

Swipe to confirm you want to make changes to the system.

![]({{ site.baseurl }}/images/2020-10-19-s7-lineageos/05-twrp-menu.jpg)

First, format the */data* partition. Click on *Wipe* in the menu:

![]({{ site.baseurl }}/images/2020-10-19-s7-lineageos/06-twrp-wipe.jpg)
![]({{ site.baseurl }}/images/2020-10-19-s7-lineageos/07-twrp-format-data-confirmation.jpg)
![]({{ site.baseurl }}/images/2020-10-19-s7-lineageos/08-twrp-format-data.jpg)

## Install LineageOS

In recovery, you can already connect via adb.

```bash
adb push -a lineage-17.1-20201008-UNOFFICIAL-herolte.zip /sdcard/
```

(I've used an image file from [xda](https://forum.xda-developers.com/galaxy-s7/development/beta-lineageos-17-0-galaxy-s7-build-1-t3980101).)

![]({{ site.baseurl }}/images/2020-10-19-s7-lineageos/09-twrp-install.jpg)
![]({{ site.baseurl }}/images/2020-10-19-s7-lineageos/10-twrp-install-lineageos-confirmation.jpg)
![]({{ site.baseurl }}/images/2020-10-19-s7-lineageos/11-twrp-install-lineageos.jpg)
![]({{ site.baseurl }}/images/2020-10-19-s7-lineageos/12-twrp-install-lineageos-done.jpg)

## Reboot

![]({{ site.baseurl }}/images/2020-10-19-s7-lineageos/13-twrp-reboot.jpg)

Make sure to uncheck all boxes and click *Do Not Install*.

# LineageOS

![]({{ site.baseurl }}/images/2020-10-19-s7-lineageos/14-lineageos-boot.jpg)
![]({{ site.baseurl }}/images/2020-10-19-s7-lineageos/15-lineageos-menu.jpg)
![]({{ site.baseurl }}/images/2020-10-19-s7-lineageos/16-lineageos-android-version.jpg)

# Magisk

Now you've successfully installed LineageOS, but you don't have root access (via su) yet.
To get it, go [here](https://github.com/topjohnwu/Magisk/releases/).
I've used *Magisk v21.0* and *Magisk Manager v8.0.2*.

Install both, reboot, and you should have full control now.

![]({{ site.baseurl }}/images/2020-10-19-s7-lineageos/17-magisk-manager.jpg)
