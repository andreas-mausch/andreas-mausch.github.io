---
title: "Android: LineageOS, Root and TWRP Recovery on Samung Galaxy S7"
date: 2020-10-19T23:00:00+02:00
tags: ['android', 'lineageos', 'rooting', 'twrp', 'recovery']
thumbnail: 12-twrp-install-lineageos-done.jpg
---

To get full control of the phone, I've installed LineageOS with root access.

The following instructions might result in data loss, so make sure you have a backup of all data on the phone!

# Install TWRP recovery

[Download](https://twrp.me/samsung/samsunggalaxys7.html)

First, you need to boot into *Odin Mode*.
Press and hold *Power*+*Home*+*Volume Down*.

{% image "01-warrenty-warning.jpg" %}

Confirm you are about to lose warrenty by pressing *Volume Up*.

{% image "02-odin-mode.jpg" %}

On Manjaro, I've used [heimdall](https://www.archlinux.org/packages/community/x86_64/heimdall/):

```bash
heimdall detect --verbose
heimdall flash --RECOVERY twrp-3.4.0-0-herolte.img --no-reboot
```

Important: **Immediately** after the screen turns black, press and hold *Power*+*Home*+*Volume Up*
to boot into the recovery. If the original ROM is loaded, it will restore the recovery
and you need to start over again.

# In TWRP

{% image "03-twrp-boot.jpg" %}
{% image "04-twrp-readonly-warning.jpg" %}

## Wipe

Swipe to confirm you want to make changes to the system.

{% image "05-twrp-menu.jpg" %}

First, format the */data* partition. Click on *Wipe* in the menu:

{% image "06-twrp-wipe.jpg" %}
{% image "07-twrp-format-data-confirmation.jpg" %}
{% image "08-twrp-format-data.jpg" %}

## Install LineageOS

In recovery, you can already connect via adb.

```bash
adb push -a lineage-17.1-20201008-UNOFFICIAL-herolte.zip /sdcard/
```

(I've used an image file from [xda](https://forum.xda-developers.com/galaxy-s7/development/beta-lineageos-17-0-galaxy-s7-build-1-t3980101).)

{% image "09-twrp-install.jpg" %}
{% image "10-twrp-install-lineageos-confirmation.jpg" %}
{% image "11-twrp-install-lineageos.jpg" %}
{% image "12-twrp-install-lineageos-done.jpg" %}

## Reboot

{% image "13-twrp-reboot.jpg" %}

Make sure to uncheck all boxes and click *Do Not Install*.

# LineageOS

{% image "14-lineageos-boot.jpg" %}
{% image "15-lineageos-menu.jpg" %}
{% image "16-lineageos-android-version.jpg" %}

# Magisk

Now you've successfully installed LineageOS, but you don't have root access (via su) yet.
To get it, go [here](https://github.com/topjohnwu/Magisk/releases/).
I've used *Magisk v21.0* and *Magisk Manager v8.0.2*.

Install both, reboot, and you should have full control now.

{% image "17-magisk-manager.jpg" %}

# Update: Samsung Galaxy S4 mini (I9195)

Today I've flashed [LineageOS 18.1](https://forum.xda-developers.com/t/rom-i9190-i9192-i9195-unofficial-11-0-0-lineageos-18-1-for-s4-mini.4189967/)
on a Samsung Galaxy S4 mini (I9195).
Thanks to arco68, it even runs a recent Android version. :*

It's still a great phone, has a great size, it even supports LTE.
If Samsung would update it with a modern SoC, an improved camera and maybe a fingerprint sensor in the same form factor (124mm height, 107g) I would pay shitloads of money for it.

The process was similar as described above:

- Boot into *Odin Mode*
- Flash [TWRP recovery](https://dl.twrp.me/serranoltexx/) (I've used version 3.6.1_9-0)
- Flash LineageOS (18.1)
- Optional: Flash [Open GApps](https://opengapps.org/) (I've used ARM, 11.0, pico)
- Flash *Magisk-v24.0.zip* for root access (Note: rename .apk to .zip and flash via TWRP)
- After a reboot, the Magisk app wasn't installed automatically, so I had to install *Magisk-v24.0.apk* manually

Important note: I've first tried to use Magisk 24.2 and it failed due to *cannot mount /system*.
See [this post](https://forum.xda-developers.com/t/rom-i9190-i9192-i9195-unofficial-11-0-0-lineageos-18-1-for-s4-mini.4189967/page-27#post-86526393).
Version 24.0 works though and is fine for me, so I just took that version to get root access.

Also, please note that *Magisk* and *Magisk Manager* is now bundled in a single .apk file, which is different to the older version described above.
