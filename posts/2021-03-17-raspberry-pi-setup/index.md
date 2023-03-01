---
title: Raspberry Pi Headless Setup
date: 2021-03-17T19:00:00+01:00
tags: ['raspberrypi', 'headless', 'ssh', 'wifi']
---

I've done this a couple of times already so I thought I should write it down.

How to setup the Raspberry Pi with [Pi OS](https://www.raspberrypi.com/software/operating-systems/#raspberry-pi-os-64-bit)
for ssh and wifi.

# Flash

Flash the OS to the sd card.
My favorite tool for this is [Balana Etcher](https://www.balena.io/etcher/).

# Mount

After the flash is complete, mount the sd card.
I will use */tmp/sdcard/* as mounting point in this example.

# SSH

```bash
cd /tmp/sdcard/boot/
touch ssh
```

# WiFi

Create this file:

```{data-filename=/tmp/sdcard/boot/wpa_supplicant.conf}
country=US
ctrl_interface=DIR=/var/run/wpa_supplicant GROUP=netdev
update_config=1

network={
    ssid="your_real_wifi_ssid"
    psk="your_real_password"
    key_mgmt=WPA-PSK
}
```

# Hostname

Edit */tmp/sdcard/rootfs/etc/hostname* to change the hostname.

# After first boot

Change your password (run this on the pi):

```bash
passwd
```

Add your ssh key (run this on your local machine, replace the hostname):

```bash
ssh-copy-id pi@raspberrypi
```

# Backup and editing

## Create a full backup of the SD card

```bash
sudo dd if=/dev/sdb of=./raspberrypi.dd.img bs=1M status=progress
```

## Make the backup file immutable, if needed

```bash
sudo chattr +i raspberrypi.dd.img
lsattr raspberrypi.dd.img
```

## Create devices for mounting partitions from the backup file

```bash
sudo kpartx -arv raspberrypi.dd.img
```

(-a: Add partition mappings, -r: Read-only partition mappings, -v: Operate verbosely)

You can now mount the partitions, read files, do changes if needed, and unmount them again.

Afterwords, delete the devices:

```bash
sudo kpartx -dv retropie.dd.img
```

(-d: Delete partition mappings)
