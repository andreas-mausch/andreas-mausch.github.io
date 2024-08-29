---
title: Raspberry Pi Headless Setup
date: 2021-03-17T19:00:00+01:00
tags: ['raspberrypi', 'headless', 'ssh', 'wifi']
toc: true
---

# Headless setup

**This guide is outdated and Raspbian 12 Bookworm setups won't work.**
I will write a new guide soon.

The *Backup* and *QEMU* sections below should still work (I hope).

---

I've done this a couple of times already so I thought I should write it down.

How to setup the Raspberry Pi with [Pi OS](https://www.raspberrypi.com/software/operating-systems/#raspberry-pi-os-64-bit)
for ssh and wifi.

## Flash

Flash the OS to the sd card.
~~My favorite tool for this is [Balana Etcher](https://www.balena.io/etcher/).~~

I like to use `xzcat` in combination with `dd`:

```bash
xzcat 2024-03-15-raspios-bookworm-armhf-lite.img.xz | sudo dd of=/dev/mmcbzz0 bs=1M oflag=sync status=progress
```

## Mount

After the flash is complete, mount the sd card to apply modifications.
I will use */tmp/sdcard/* as mounting point in this example.

## SSH

```bash
cd /tmp/sdcard/boot/
touch ssh
```

## WiFi

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

## Hostname

Edit */tmp/sdcard/rootfs/etc/hostname* to change the hostname.

## After first boot

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
sudo dd if=/dev/sdb of=./raspberrypi.raw.img bs=1M status=progress
```

## Make the backup file immutable, if needed

```bash
sudo chattr +i raspberrypi.raw.img
lsattr raspberrypi.raw.img
```

## Create devices for mounting partitions from the backup file

```bash
sudo kpartx -arv raspberrypi.raw.img
```

(-a: Add partition mappings, -r: Read-only partition mappings, -v: Operate verbosely)

You can now mount the partitions, read files, do changes if needed, and unmount them again.

Afterwords, delete the devices:

```bash
sudo kpartx -dv retropie.raw.img
```

(-d: Delete partition mappings)

# QEMU testing

Taken from [plembo](https://gist.github.com/plembo/c4920016312f058209f5765cb9a3a25e) and [qemu-rpi-kernel](https://github.com/dhruvvyas90/qemu-rpi-kernel/wiki).

## Mount and edit ld.so.preload

Mount the `.img` file via `kpartx` to modify it, see above.

```bash
sudo nano /mnt/etc/ld.so.preload
# Comment out the only line
```

## Unmount and convert (optional)

```bash
qemu-img convert -f raw -O qcow2 raspberrypi.raw.img raspberrypi.qcow2
```

## Download kernel and run

```bash
wget https://github.com/dhruvvyas90/qemu-rpi-kernel/blob/9fb4fcf463df4341dbb7396df127374214b90841/kernel-qemu-4.14.79-stretch?raw=true
wget https://github.com/dhruvvyas90/qemu-rpi-kernel/blob/9fb4fcf463df4341dbb7396df127374214b90841/versatile-pb.dtb?raw=true
sudo qemu-system-arm -kernel kernel-qemu-4.14.79-stretch \
              -cpu arm1176 -m 256 \
              -M versatilepb -dtb versatile-pb.dtb \
              -no-reboot \
              -serial stdio \
              -append "root=/dev/sda2 panic=1 rootfstype=ext4 rw" \
              -hda raspberrypi.qcow2 \
              -net nic -net user \
              -net tap,ifname=vnet0,script=no,downscript=no
```

If you want to use a raw image instead of qcow2, you can pass `-drive format=raw,file=raspberrypi.raw.img`
instead of the `-hda` option.

## Convert QEMU image back to raw

```bash
qemu-img dd -f qcow2 -O raw bs=4M if=raspberrypi.qcow2 of=back-to.raw.img
```
