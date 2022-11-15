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

# Problem with SSH connection

```bash
$ ssh -v root@192.168.1.1
[...]
debug1: SSH2_MSG_KEXINIT sent
debug1: SSH2_MSG_KEXINIT received
debug1: kex: algorithm: curve25519-sha256
debug1: kex: host key algorithm: (no match)
Unable to negotiate with 192.168.1.1 port 22: no matching host key type found. Their offer: ssh-rsa
```

The solution was to specify the algorithm directly:

```bash
$ ssh -v -oHostKeyAlgorithms=+ssh-rsa root@192.168.1.1
```

I am not sure why this was needed though.

# Upgrade Firmware

See the [official instructions](https://openwrt.org/docs/guide-user/installation/sysupgrade.cli).

I had to add the `-O` flag to scp:

> Use the legacy SCP protocol for file transfers instead of the SFTP protocol.  Forcing the use of the SCP protocol may be necessary for servers that do not implement SFTP, for backwards-compatibility for particular filename wildcard patterns and for expanding paths with a ‘~’ prefix for older SFTP servers.

```bash
$ scp -oHostKeyAlgorithms=+ssh-rsa -O openwrt-22.03.2-ath79-generic-tplink_archer-c7-v5-squashfs-sysupgrade.bin root@192.168.1.1:/tmp

# Then, on the server in the /tmp directory:
sysupgrade -v openwrt-22.03.2-ath79-generic-tplink_archer-c7-v5-squashfs-sysupgrade.bin
```

# Enable WiFi

```bash
uci show wireless

uci set wireless.radio0.country='DE'
uci set wireless.radio0.disabled='0'
uci set wireless.default_radio0.encryption='psk2'
uci set wireless.default_radio0.ssid='MyNetwork'
uci set wireless.default_radio0.key='Password'

# Same for radio1 / default_radio1

uci commit wireless
wifi
```

# Resolve hostnames on the local network

```bash
uci -N show dhcp.@dnsmasq[0]
uci set dhcp.@dnsmasq[0].domainneeded='0'
uci commit dhcp
/etc/init.d/dnsmasq restart
```

# Routerfreiheit

In Germany, there is a law to guarantee customers to work with a modem of their choice
(*Gesetz zur Auswahl und zum Anschluss von Telekommunikationsendgeräten*, see [here](https://dejure.org/BGBl/2016/BGBl._I_S._106)).

My provider (willy.tel) has some instructions and lecture you the disadvantages of operating your own router.
However, they provide all information needed, which is great.

{% image "willytel-routerfreiheit.png" %}

Unfortunately, DOCSIS doesn't work on OpenWrt.
See [here](https://openwrt.org/unsupported/cable_modem) for the explanation:

> DOCSIS functionality is based on cryptographic certificates to authenticate cable modems and their running firmware to the ISP - that is not supportable by OpenWrt under any circumstances.
> There is no FOSS solution available for cable modems.
