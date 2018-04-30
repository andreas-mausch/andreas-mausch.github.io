---
layout: post
title:  "WiFi monitor mode"
date:   2018-04-30 19:00:00 +02:00
tags:
---

With monitor mode enabled, you can receive all packages on wireless networks around, without being connected to any.
It is useful for debugging and security analysis.

I am very forgetful so I will just write down how to enable monitor mode for the devices I own.

- [Intel Dual Band Wireless-AC 8265 (iwlwifi)](#intel-dual-band-wireless-ac-8265-iwlwifi)
- [Samsung Galaxy S4 & Raspberry Pi 3](#samsung-galaxy-s4--raspberry-pi-3)
- [Macbook Air 2013 (Broadcom wl)](#macbook-air-2013-broadcom-wl)
- [Useful commands](#useful-commands)

# Intel Dual Band Wireless-AC 8265 (iwlwifi)

Detailed explaination: [sanilands.info/sgordon](https://sandilands.info/sgordon/capturing-wifi-in-monitor-mode-with-iw)

```bash
$ iw dev
$ iw phy phy0 info # should show all information about the device, including the "monitor" capability
$ sudo iw phy phy0 interface add mon0 type monitor
$ ip link
$ sudo iw dev wlan0 del # (I had to replace wlan0 by wlp2s0)
$ sudo ip link set mon0 up
$ iw dev mon0 info
$ sudo iw dev mon0 set freq 2437 # set it to the right channel
```

<details markdown="1">
<summary>Details</summary>
```
$ ls -lh /lib/firmware/iwlwifi-*
-rw-r--r--  1 root root  2,3M  8. Apr 17:31 iwlwifi-8265-21.ucode
-rw-r--r--  1 root root  1,8M  8. Apr 17:31 iwlwifi-8265-22.ucode
-rw-r--r--  1 root root  2,2M  8. Apr 17:31 iwlwifi-8265-27.ucode
-rw-r--r--  1 root root  2,3M  8. Apr 17:31 iwlwifi-8265-31.ucode
-rw-r--r--  1 root root  2,4M  8. Apr 17:31 iwlwifi-8265-34.ucode
```

```
$ dmesg
[    1.885451] Intel(R) Wireless WiFi driver for Linux
[    1.885452] Copyright(c) 2003- 2015 Intel Corporation
[    1.885536] iwlwifi 0000:02:00.0: enabling device (0000 -> 0002)
[    1.886425] iwlwifi 0000:02:00.0: Direct firmware load for iwlwifi-8265-36.ucode failed with error -2
[    1.886433] iwlwifi 0000:02:00.0: Direct firmware load for iwlwifi-8265-35.ucode failed with error -2
[    1.889093] iwlwifi 0000:02:00.0: loaded firmware version 34.0.1 op_mode iwlmvm
```
</details>

# Samsung Galaxy S4 & Raspberry Pi 3

- [Nexmon](https://github.com/seemoo-lab/nexmon)
- [Native monitor mode in BCMDHD patch](https://github.com/ruleh/misc/tree/master/monitor)
- [Nexmon for Raspberry Pi 3](https://dev.seemoo.tu-darmstadt.de/bcm/bcm-rpi3)
- [Ready-to-use image for Raspberry Pi 3](https://github.com/nethunteros/rpi3-kalimon/releases)

# Macbook Air 2013 (Broadcom wl)

If you are on the wl driver, this is really simple. Just execute:

```bash
echo 1 | sudo tee /proc/brcm_monitor0
```

And you should find another device prism0 next to your usual wlan0.

Use prism0 with Wireshark, Aircrack-ng or your favorite analysis tool.

# Useful commands

```bash
$ lspci | grep -i wireless
$ lspci -vv -s 03:00.0 # replace with the numbers the previous command returned
```
