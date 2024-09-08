---
title: "Single-Board Computers: Headless Setup for Raspberry Pi, Orange Pi, Radax"
date: 2024-08-31T19:30:00+02:00
tags: ['raspberrypi', 'orangepi', 'radax', 'rasbian', 'armbian']
toc: true
draft: true
---

I still like to set up my SPCs headless.
This way, I don't need to connect a monitor and keyboard.
I simply prepare the SD card on my laptop, plug it into the target and it connects to my network,
allowing me to SSH into it.

Since my [old post]({% link-post "2021-03-17-raspberry-pi-setup" %}) is outdated,
here is an updated guide on how to set up an operating system for a single-board computer
like a Raspberry Pi, Orange Pi or Radax.

In all cases, it is assumed you have flashed the image to a sd card, like this:

```bash
xzcat ./2024-07-04-raspios-bookworm-armhf-lite.img.xz | sudo dd of=/dev/mmcbzz0 bs=1M oflag=sync status=progress
```

and the card is mounted into `/mnt/sdcard/`.

# Raspberry Pi OS / Rasbian

You can of course use the official [rpi-imager](https://github.com/raspberrypi/rpi-imager)
or [sdm](https://github.com/gitbls/sdm), which both are great programs.

I prefer to do the setup manually though to see what changes on the filesystem.

## Version 11 (bullseye)

Tested with `2024-07-04-raspios-bullseye-armhf-lite.img.xz`.

### SSH

```bash
touch /mnt/sdcard/bootfs/ssh
```

### WiFi

Create this file:

```conf{data-filename=/mnt/sdcard/bootfs/wpa_supplicant.conf}
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

Edit the hostname in these files:

```bash
sudo nano /mnt/sdcard/rootfs/etc/hostname
sudo nano /mnt/sdcard/rootfs/etc/hosts
```

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

### WTF?

Things get a bit complicated here and on my first installation I
reluctantly went to use the official [Raspberry Pi Imager](https://github.com/raspberrypi/rpi-imager). :(

But now I finally found how to prepare the sd card without it by
[this great article](https://zansara.substack.com/p/2024-01-06-raspberrypi-headless-bookworm-wifi-config),
which reverse-engineered the Imager.

The imager sets up a `firstrun.sh` script and modifies the `cmdline.txt` to run it on first boot.
After that, the script deletes itself and removes itself also from `cmdline.txt` again.

The key program used is [raspberrypi-sys-mods](https://github.com/RPi-Distro/raspberrypi-sys-mods).

What I stumbled across during my reasearch, but things that were **not** useful for Raspberry Pi OS:

- cloud-init?
  I guess it is only used by Ubuntu
- netplan?
  This one is used by Armbian actually, see below
- `custom.toml`
  Didn't work for me.

### Set up a new installation

I have copied the original `firstrun.sh` the imager created with my settings
and tried to generalize it, in order to only have a simple `firstrun.env` file,
which would be the only file to be changed for a new installation.

So here are my steps:

1. Copy my modified `firstrun.sh` and `firstrun.env` to `/mnt/sdcard/bootfs/`.
2. Make changes to `firstrun.env` to match your desired config.
3. Modify `/mnt/sdcard/bootfs/cmdline.txt` and append this to the only long single line:
   `cfg80211.ieee80211_regdom=DE systemd.run=/boot/firstrun.sh systemd.run_success_action=reboot systemd.unit=kernel-command-line.target`  
   This references the `firstrun.sh` to be run at first boot.
4. Change the region code in `cmdline.txt` to match your country.

### Other files than firstrun.sh

My goal was to have a firstrun.env with all the related environment variables,
and only this files needs to be changed for future installations.
The `firstrun.sh` should remain untouched.

This was problematic, [because](https://github.com/raspberrypi/rpi-imager/issues/554) there
is an [imager_fixup](https://github.com/RPi-Distro/raspberrypi-sys-mods/blob/a7d769745962126abd7c727e9a7d4238fe3fb2c2/initramfs-tools/scripts/local-bottom/imager_fixup)
which makes changes to the file on the first boot.
What a hack, and it took me some hours to debug. :(

So what you could expect at `/boot/*` is in reality mounted during the boot process at `/boot/firmware/*`.

This whole setup process is a huge hack, and so much more complicated than before with bullseye.

# Armbian
