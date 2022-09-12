---
title: OpenWRT on tp-link Archer C7 v5 AC1750
date: 2021-05-01T17:00:00+02:00
tags: ['router', 'openwrt', 'privacy']
thumbnail: tplink-router.jpg
---

{% image "tplink-router.jpg" %}

Your Internet Service Provider (ISP) has access to your router provided by them
and therefore access to your whole network.

In order to get some privacy into your network, you can use another router.
To gain some more trust, use an open-source custom firmware, like OpenWrt.

If your router is supported, I recommend to try [LibreCMC](https://librecmc.org/).
It is a free firmware without any blobs required for some firmwares.

# Original Firmware Download

[https://www.tp-link.com/en/support/download/archer-c7/v5/#Firmware](https://www.tp-link.com/en/support/download/archer-c7/v5/#Firmware)

{% image "tplink-original-firmware.png" %}

# OpenWrt Download

[https://openwrt.org/toh/tp-link/archer_c7](https://openwrt.org/toh/tp-link/archer_c7)

{% image "openwrt-tplink-website.png" %}

# Install OpenWrt

[https://www.youtube.com/watch?v=wrREvRUD9Ng](https://www.youtube.com/watch?v=wrREvRUD9Ng)

{% image "tplink-settings-update-firmware.png" %}
{% image "tplink-settings-update-in-progress.png" %}

# OpenWrt

{% image "openwrt-installed.png" %}
{% image "openwrt-status.png" %}
{% image "openwrt-ssh.png" %}

# Routerfreiheit

In Germany, there is a law to guarantee customers to work with a modem of their choice
(*Gesetz zur Auswahl und zum Anschluss von Telekommunikationsendgeräten*, see [here](https://dejure.org/BGBl/2016/BGBl._I_S._106)).

My provider (willy.tel) has some instructions and lecture you the disadvantages of operating your own router.
However, they provide all information needed, which is great.

{% image "willytel-routerfreiheit.png" %}
