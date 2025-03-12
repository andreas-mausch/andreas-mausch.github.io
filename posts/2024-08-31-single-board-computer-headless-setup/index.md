---
title: "Single-Board Computers: Headless Setup for Raspberry Pi, Orange Pi, Radax"
date: 2024-08-31T19:30:00+02:00
tags: ['single board computer', 'raspberrypi', 'orangepi', 'radax', 'rasbian', 'armbian']
toc: true
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

General hint: `cat /sys/firmware/devicetree/base/model` shows you which model you have.

## Version 11 (bullseye)

Tested with `2024-07-04-raspios-bullseye-armhf-lite.img.xz`.

### SSH

```bash
touch /mnt/sdcard/bootfs/ssh
```

### WiFi

Create this file:

```ini{data-filename=/mnt/sdcard/bootfs/wpa_supplicant.conf}
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

1. Copy my modified [firstrun.sh]({{ "raspberry-pi/bookworm/firstrun.sh" | relativeFile | url }}) and [firstrun.env]({{ "raspberry-pi/bookworm/firstrun.env" | relativeFile | url }}) to `/mnt/sdcard/bootfs/`.
2. Make changes to `firstrun.env` to match your desired config.
   Note: `MY_USER_PASSWORD` is optional.
   I usually SSH via key into the machines and skip the password.
3. Modify `/mnt/sdcard/bootfs/cmdline.txt` and append this to the only long single line:
   `cfg80211.ieee80211_regdom=DE systemd.run=/boot/firstrun.sh systemd.run_success_action=reboot systemd.unit=kernel-command-line.target`  
   This references the `firstrun.sh` to be run at first boot.
4. Change the region code in `cmdline.txt` to match your country.

### Other files than firstrun.sh

My goal was to have a `firstrun.env` with all the related environment variables,
and only this file needs to be changed for future installations.
The `firstrun.sh` should remain untouched.

This was problematic, [because](https://github.com/raspberrypi/rpi-imager/issues/554) there
is an [imager_fixup](https://github.com/RPi-Distro/raspberrypi-sys-mods/blob/a7d769745962126abd7c727e9a7d4238fe3fb2c2/initramfs-tools/scripts/local-bottom/imager_fixup)
which makes changes to the file on the first boot.
What a hack, and it took me some hours to debug. :(

So what you could expect at `/boot/*` is in reality mounted during the boot process at `/boot/firmware/*`.

This whole setup process is a huge hack, and so much more complicated than before with bullseye.

# Armbian

For Orange Pi Zero 2W and Radax Zero 3W I like to use Armbian,
because they provide recent Debian images.

Tested with Armbian 24.8.1:
Things are so much easier here.

## General setup via .not_logged_in_yet

```bash
sudo cp .not_logged_in_yet /mnt/sdcard/root/
```

The file should have existed there already, but should have been empty.

Download my example file: [.not_logged_in_yet]({{ "armbian/.not_logged_in_yet" | relativeFile | url }})

It covers WiFi, locale, timezone, root password and user creation.

It does not cover hostname, ssh key authentication, and sudo without password, see below.

## Extra setup

### Hostname

The file above does **not** cover the hostname.

Same as for bullseye:
Edit `/mnt/sdcard/etc/hosts` and `/mnt/sdcard/etc/hostname`.

### SSH key

```bash
sudo install -o 1000 -d /mnt/sdcard/home/me/
sudo install -o 1000 -m 700 -d /mnt/sdcard/home/me/.ssh/
echo 'ssh-rsa AAAAB3... openpgp:0x01234567' | sudo install -o 1000 -m 600 /dev/stdin /mnt/sdcard/home/me/.ssh/authorized_keys
echo 'PasswordAuthentication no' | sudo tee --append /mnt/sdcard/etc/ssh/sshd_config
```

### sudo without password

```bash
echo '%sudo  ALL=(ALL) NOPASSWD: ALL' | sudo tee /mnt/sdcard/etc/sudoers.d/010_sudo-nopasswd
```

## Note on DHCP

Important: You must set `PRESET_NET_USE_STATIC` to `0` explicitly.
If you skip this config entry, DHCP is not enabled.
See here:
[https://github.com/armbian/build/blob/d16f710e7eabdfd9b1911aa6cc7648c25d038208/packages/bsp/common/usr/lib/armbian/armbian-firstlogin#L54](https://github.com/armbian/build/blob/d16f710e7eabdfd9b1911aa6cc7648c25d038208/packages/bsp/common/usr/lib/armbian/armbian-firstlogin#L54)

## Why in /root/ user folder?

What's confusing to me:
I would have guessed that `/root/.not_logged_in_yet` is only executed after the first login via root.
That means WiFi settings would be obsolete here, because you could never login before the network connection is made.
However, some script somewhere writes a `/etc/netplan/*.yaml` file, if WiFi entries are found in `.not_logged_in_yet`.
Magic.

(Seems to happen around here
[https://github.com/armbian/build/blob/d16f710e7eabdfd9b1911aa6cc7648c25d038208/packages/bsp/common/usr/lib/armbian/armbian-firstlogin#L119](https://github.com/armbian/build/blob/d16f710e7eabdfd9b1911aa6cc7648c25d038208/packages/bsp/common/usr/lib/armbian/armbian-firstlogin#L119))

## What cost me time

All of this is not required:

- `FR_net_wifi_ssid`
- `armbian_first_run.txt`
- WiFi setup via `netplan`
  This is still an alternative, but will be set up automatically via the `.not_logged_in_yet` file.

# DietPi

I have tried the image `DietPi_RadxaZERO3-ARMv8-Bookworm.img.xz` from 2024-09-13.
There is a extra config parition.
It is described here:
[https://dietpi.com/docs/usage/#how-to-do-an-automatic-base-installation-at-first-boot-dietpi-automation](https://dietpi.com/docs/usage/#how-to-do-an-automatic-base-installation-at-first-boot-dietpi-automation)

Edit the `dietpi.txt` and `dietpi-wifi.txt` to your needs.

Hostname, locale, timezone, and ssh key authentication is all covered.
I couldn't find a setting in the config file for passwordless sudo, but it was activated automatically.

For my personal settings, I have changed:

- `AUTO_SETUP_KEYBOARD_LAYOUT`
- `AUTO_SETUP_TIMEZONE`
- `AUTO_SETUP_NET_WIFI_ENABLED`
- `AUTO_SETUP_NET_WIFI_COUNTRY_CODE`
- `AUTO_SETUP_HEADLESS`
- `AUTO_SETUP_SSH_PUBKEY`
- `SURVEY_OPTED_IN`
- `SOFTWARE_DISABLE_SSH_PASSWORD_LOGINS`

Everything worked on first try.
However, I dislike that the real setup script is started when you boot up the
SBC for the first time and login as root.

WHen I tried to login directly using the `dietpi` user, I got a warning.

In the script which runs on first login as `root`, you are asked several questions,
which can be answered during a UI. Then the system is updated and settings are applied.

That's exactly what I'd like to avoid in a headless setup.
If I had to do it for like 20 installs, that would be boring and repetitive.

The extra tools for installing software might be neat for beginners, but I don't really need them.

Even though the headless installation was best documented out of the
three operating systems I have tested, I will stick with Armbian.
