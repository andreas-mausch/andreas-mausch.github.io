---
title: Install Intel WiFi 8265 into Dell XPS 15 (9550)
date: 2017-06-02T19:00:00+02:00
tags: ['xps', 'wifi', 'intel', 'repair']
thumbnail: intel-8265.jpg
---

My main laptop I use for developing software is the Dell XPS 15 9550 (2016 model).
It is a very solid, good laptop.
One problem I had with it was the WiFi though.
Connection in general was quite poor and in some places I wasn't able to complete uploads at all.
They were stuck repeatedly at a certain percentage and didn't continue from there.
But when I restarted my machine it worked again. I was like...well, might be shitty drivers.
However, after a quick internet research I found there are other people with the same problems.

The wireless card installed was the Dell Wireless 1830 (DW1830) with a chip from Broadcom (BCM43602).

I've decided to buy a [Intel 8265](https://ark.intel.com/de/products/94150/Intel-Dual-Band-Wireless-AC-8265). It only has 2x2 antenna connections instead of the 3x3 of the DW1830, but the internet says it doesn't really make much of a difference.

{% image "intel-8265.jpg" %}

{% image "xps-15-opened.jpg" %}

{% image "wifi-dw1830.jpg" %}

{% image "xps-wifi-antennas.jpg" %}

I've installed the card today. However, I've accidentally broke one of the three antenna connectors.
Luckily, the new card only needs two.
The new card didn't work out of the box with my Linux Mint 18. That was caused by an outdated kernel (4.4) which doesn't support the Intel 8265.

I've upgraded the kernel to 4.10, downloaded the firmware from [here](https://wireless.wiki.kernel.org/en/users/drivers/iwlwifi), copied it to the `/lib/firmware` folder and restarted.
Voilà.

I haven't done a lot of testing yet, but I can already say the initial connection time is **LOT** less than before.
Also, after standby the connection is immediately there. With the old card it always took two to three seconds to establish the wifi connection.
So I am confident this card will be a lot more stable than the previous one.

Speed: I did an internet speed test over WiFi and it is about 58 Mbit/s with my FritzBox 7360, which is alright. It is about the same I get with a MacBook Air.

Bluetooth: I needed to put `intel/ibt-12-16.sfi` and `intel/ibt-12-16.ddc` (they are part of this .deb [here](https://packages.debian.org/en/sid/all/firmware-iwlwifi/download)) in the `/lib/firmware` folder.
I still have some problems using Bluetooth and WiFi at the same time. [People](https://superuser.com/questions/924559/wifi-connection-troubles-solved-why-does-my-fix-work) [suggested](https://askubuntu.com/questions/645009/wi-fi-and-bluetooth-not-working-simultaneously) to disable `bt_coex_active`, but that didn't change much for me. And yes I want to use 802.11n.
