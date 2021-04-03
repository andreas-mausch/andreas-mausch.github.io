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
- [Frequency Table](#frequency-table)

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

## Find network device

```bash
sudo lshw -C network
```

<details markdown="1">
<summary>Example output</summary>
```
$ sudo lshw -C network
  *-network               
       Beschreibung: Kabellose Verbindung
       Produkt: BCM4360 802.11ac Wireless Network Adapter
       Hersteller: Broadcom Corporation
       Physische ID: 0
       Bus-Informationen: pci@0000:03:00.0
       Logischer Name: wlan0
       Version: 03
       Seriennummer: 84:11:22:33:44:ff
       Breite: 64 bits
       Takt: 33MHz
       Fähigkeiten: pm msi pciexpress bus_master cap_list ethernet physical wireless
       Konfiguration: broadcast=yes driver=wl0 driverversion=6.30.223.271 (r587334) ip=192.168.178.38 latency=0 multicast=yes wireless=IEEE 802.11
       Ressourcen: irq:18 memory:b0600000-b0607fff memory:b0400000-b05fffff
```
</details>

## Find driver

```bash
$ lspci | grep -i wireless
$ lspci -vv -s 03:00.0 # replace with the numbers the previous command returned
```

<details markdown="1">
<summary>Example output</summary>
```
$ lspci -vv -s 03:00.0
03:00.0 Network controller: Broadcom Corporation BCM4360 802.11ac Wireless Network Adapter (rev 03)
	Subsystem: Apple Inc. BCM4360 802.11ac Wireless Network Adapter
	Control: I/O- Mem+ BusMaster+ SpecCycle- MemWINV- VGASnoop- ParErr- Stepping- SERR- FastB2B- DisINTx-
	Status: Cap+ 66MHz- UDF- FastB2B- ParErr- DEVSEL=fast >TAbort- <TAbort- <MAbort- >SERR- <PERR- INTx-
	Latency: 0, Cache Line Size: 256 bytes
	Interrupt: pin A routed to IRQ 18
	Region 0: Memory at b0600000 (64-bit, non-prefetchable) [size=32K]
	Region 2: Memory at b0400000 (64-bit, non-prefetchable) [size=2M]
	Capabilities: <access denied>
	Kernel driver in use: wl
	Kernel modules: bcma, wl
```
</details>

# Frequency table

[https://en.wikipedia.org/wiki/List_of_WLAN_channels](https://en.wikipedia.org/wiki/List_of_WLAN_channels)

To show the current frequency used by your WiFi adapter, use either `iwlist wlan0 channel` or just plain `iwconfig`.

## 2.4 GHz

![]({{ site.baseurl }}/images/2018-04-30-wifi-monitor-mode/2021-02-27-wifi-channel-frequencies-2.4.png)

## 5 GHz

![]({{ site.baseurl }}/images/2018-04-30-wifi-monitor-mode/2021-02-27-wifi-channel-frequencies-5.png)
