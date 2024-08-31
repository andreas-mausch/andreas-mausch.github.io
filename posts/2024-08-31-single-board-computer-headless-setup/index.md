---
title: "Single-Board Computers: Headless Setup for Raspberry Pi, Orange Pi, Radax"
date: 2024-08-31T19:30:00+02:00
tags: ['raspberrypi', 'orangepi', 'radax', 'rasbian', 'armbian']
toc: true
draft: true
---

Since my [old post]({% link-post "2021-03-17-raspberry-pi-setup" %}) is outdated,
here is an updated guide on how to set up an operating system for a single-board computer
like a Raspberry Pi, Orange Pi or Radax.

In all cases, it is assumed you have flashed the image to a sd card, like this:

```bash
xzcat ./2024-07-04-raspios-bookworm-armhf-lite.img.xz | sudo dd of=/dev/mmcbzz0 bs=1M oflag=sync status=progress
```

and the card is mounted into `/mnt/sdcard/`.

# Raspberry Pi OS / Rasbian

## Version 11 (bullseye)

Tested with `2024-07-04-raspios-bullseye-armhf-lite.img.xz`.

### SSH

```bash
cd /mnt/sdcard/bootfs/
touch ssh
```

### WiFi

Create this file:

```{data-filename=/mnt/sdcard/bootfs/wpa_supplicant.conf}
country=US
ctrl_interface=DIR=/var/run/wpa_supplicant GROUP=netdev
update_config=1

network={
    ssid="your_real_wifi_ssid"
    psk="your_real_password"
    key_mgmt=WPA-PSK
}
```

Change your country, the SSID and the password (psk).

### Hostname

Edit */mnt/sdcard/rootfs/etc/hostname* to change the hostname.

### User

```{data-filename=/mnt/sdcard/bootfs/userconf.txt}
myuser:$6$1TQy0EikzkV4Ukzy$ceXxUzbGmWPrPyJILfbtvm4j1crojHqd7UFSv0O3oXKM6QsyEandc5YLGJqDZsBeWKXcMI3KIpqTQ9Q3HWHG10
```

The password in this case is `mypassword`.

Generate your own via this command:

```bash
echo 'mypassword' | openssl passwd -6 -stdin
```

## Version 12 (bookworm)

# Armbian
