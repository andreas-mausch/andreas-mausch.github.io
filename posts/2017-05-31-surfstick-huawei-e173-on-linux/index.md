---
title: Surfstick Huawei E173 on Linux
date: 2017-05-31T19:00:00+02:00
tags: ['surfstick', '3g', 'usb_modeswitch']
thumbnail: huawei-e173-speedtest.jpg
---

I've tried to use an USB modem I've bought two years ago (and never really used) on my Linux machine.
On the first try, everything went plug'n'play and I was asked to enter the PIN and it automatically connected.
That was nice, but didn't work like that again. After some googling I've found this link:

[https://wiki.ubuntuusers.de/USB_ModeSwitch/](https://wiki.ubuntuusers.de/USB_ModeSwitch/)  
(German only)

{% image "huawei-lsusb-drive-mode.jpg" %}

So "Huawei Technologies Co., Ltd. Broadband stick" is the device.  
We can see the Vendor ID (12d1) and the Product ID (1446).

A call to `usb-devices` shows it is in drive-mode:

```shell-session
$ usb-devices
T:  Bus=01 Lev=01 Prnt=01 Port=00 Cnt=01 Dev#=  5 Spd=480 MxCh= 0
D:  Ver= 2.00 Cls=00(>ifc ) Sub=00 Prot=00 MxPS=64 #Cfgs=  1
P:  Vendor=12d1 ProdID=1446 Rev=00.00
S:  Manufacturer=HUAWEI Technology
S:  Product=HUAWEI Mobile
C:  #Ifs= 2 Cfg#= 1 Atr=e0 MxPwr=500mA
I:  If#= 0 Alt= 0 #EPs= 2 Cls=08(stor.) Sub=06 Prot=50 Driver=usb-storage
I:  If#= 1 Alt= 0 #EPs= 2 Cls=08(stor.) Sub=06 Prot=50 Driver=usb-storage
```

The adjusted command from the wiki page (I've exchanged the Product ID):

```bash
sudo usb_modeswitch -v 0x12d1 -p 0x1446 -V 0x12d1 -P 0x1436 -M 55534243123456780000000000000011062000000100000000000000000000
```

Afterwards, `lsusb` shows this:

```shell-session
$ lsusb
Bus 002 Device 001: ID 1d6b:0003 Linux Foundation 3.0 root hub
Bus 001 Device 003: ID 04f3:21d4 Elan Microelectronics Corp.
Bus 001 Device 002: ID 8087:0a2b Intel Corp.
Bus 001 Device 004: ID 0c45:6713 Microdia
Bus 001 Device 006: ID 12d1:1436 Huawei Technologies Co., Ltd. Broadband stick
Bus 001 Device 001: ID 1d6b:0002 Linux Foundation 2.0 root hub
```

And `usb-devices` this:

```shell-session
$ usb-devices
T:  Bus=01 Lev=01 Prnt=01 Port=00 Cnt=01 Dev#=  6 Spd=480 MxCh= 0
D:  Ver= 2.00 Cls=ef(misc ) Sub=02 Prot=01 MxPS=64 #Cfgs=  1
P:  Vendor=12d1 ProdID=1436 Rev=00.00
S:  Manufacturer=HUAWEI Technology
S:  Product=HUAWEI Mobile
C:  #Ifs= 7 Cfg#= 1 Atr=e0 MxPwr=500mA
I:  If#= 0 Alt= 0 #EPs= 3 Cls=ff(vend.) Sub=ff Prot=ff Driver=option
I:  If#= 1 Alt= 0 #EPs= 1 Cls=02(commc) Sub=06 Prot=ff Driver=cdc_ether
I:  If#= 2 Alt= 0 #EPs= 2 Cls=0a(data ) Sub=00 Prot=00 Driver=cdc_ether
I:  If#= 3 Alt= 0 #EPs= 2 Cls=ff(vend.) Sub=ff Prot=ff Driver=option
I:  If#= 4 Alt= 0 #EPs= 2 Cls=ff(vend.) Sub=ff Prot=ff Driver=option
I:  If#= 5 Alt= 0 #EPs= 2 Cls=08(stor.) Sub=06 Prot=50 Driver=usb-storage
I:  If#= 6 Alt= 0 #EPs= 2 Cls=08(stor.) Sub=06 Prot=50 Driver=usb-storage
```

I am then asked for my PIN again and the device is visible in mmcli and Modem Manager GUI.
Sometimes it takes a while to build up a connection but in the end it worked 10/10.

{% image "huawei-e173-speedtest.jpg" %}
