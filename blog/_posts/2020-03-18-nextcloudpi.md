---
layout: post
title:  "NextCloudPi with Wi-Fi Hotspot"
date:   2020-03-18 02:30:00 +01:00
tags:
---

[NextCloudPi](https://ownyourbits.com/nextcloudpi/) is a great project which provides ready-to-run images to run NextCloud on a Raspberry Pi.
My favorite models are the 3B (**without** the plus) and the Zero W, because of their efficiency.
I'll use a Raspberry Pi 3B for this project. It can be powered by an ordinary power bank.

My goal is to have a cloud service which is:

- easy to connect to
- energy-efficient
- and portable

# General setup

1. Extract image to SD card (I've used [Ether](https://www.balena.io/etcher/), although I hate electron)
1. Connect your Pi to your network via cable
1. Browse the URL of the Pi
1. Run the activation steps and note the passwords

# Changing the passwords

Now I've changed the passwords:

- Nextcloud's default admin account, named *ncp*
- NextCloudPi's admin console user, also named *ncp*
- And I've enabled SSH and changed the password (note: you need to change it again after the first login)

![]({{ site.baseurl }}/images/2020-03-18-nextcloudpi/admin-user-password.png){:width="300px"}
![]({{ site.baseurl }}/images/2020-03-18-nextcloudpi/nextcloudpi-control-panel-password.png){:width="300px"}
![]({{ site.baseurl }}/images/2020-03-18-nextcloudpi/ssh-password.png){:width="300px"}

# Setup Wi-Fi hotspot

There's a good documentation [here](https://www.raspberrypi.org/documentation/configuration/wireless/access-point-routed.md) about how to setup Wi-Fi with a Raspberry Pi.

Here's what I did differently:

- `sudo apt install hostapd` (dnsmasq was already installed)
- I've skipped the `iptables` part
- Extend `dhcp-range` to .200, to allow more than 20 concurrent clients
- `sudo systemctl enable dnsmasq` after `sudo systemctl start dnsmasq`: That was missing, and is needed to make dhcp work after reboot
- Add `192.168.4.1 nextcloudpi` to */etc/hosts*: You will be able to type in `nextcloudpi` in the browser instead of the IP
- `sudo reboot` at the end and you should be presented a new Wi-Fi network to connect to :)

All commands:

```bash
sudo apt install hostapd dnsmasq
sudo systemctl unmask hostapd
sudo systemctl enable hostapd
sudo systemctl start dnsmasq
sudo systemctl enable dnsmasq
sudo apt install netfilter-persistent iptables-persistent
sudo iptables -t nat -A POSTROUTING -o eth0 -j MASQUERADE
sudo netfilter-persistent save
sudo rfkill unblock wlan
```

Add this at the end of */etc/dhcpcd.conf*:

```
interface wlan0
    static ip_address=192.168.4.1/24
    nohook wpa_supplicant
```

Enable routing. Create a file */etc/sysctl.d/routed-ap.conf*:

```
# Enable IPv4 routing
net.ipv4.ip_forward=1
```

Add this at the end of */etc/dnsmasq.conf*:

```
interface=wlan0 # Listening interface
dhcp-range=192.168.4.2,192.168.4.20,255.255.255.0,24h
                # Pool of IP addresses served via DHCP
domain=wlan     # Local wireless DNS domain
address=/gw.wlan/192.168.4.1
                # Alias for this router
```

Create a file */etc/hostapd/hostapd.conf*:

```
country_code=GB
interface=wlan0
ssid=<NameOfNetwork>
hw_mode=g
channel=7
macaddr_acl=0
auth_algs=1
ignore_broadcast_ssid=0
wpa=2
wpa_passphrase=<YourPassword>
wpa_key_mgmt=WPA-PSK
wpa_pairwise=TKIP
rsn_pairwise=CCMP
```

# My favorite apps for Nextcloud

- Calendar
- Contacts
- GpxPod
- Notes
- PhoneTrack
- Polls
- Talk
- Tasks
- Music
- Draw.io
- Markdown Editor
- Text
- Mind Map
- JavaScript XMPP Chat
- Group folders

# Apps for Android

- [Nextcloud](https://f-droid.org/en/packages/com.nextcloud.client/)
- [Nextcloud Talk](https://f-droid.org/en/packages/com.nextcloud.talk2/)
- [Nextcloud Notes](https://f-droid.org/en/packages/it.niedermann.owncloud.notes/)
- [OpenTasks](https://f-droid.org/en/packages/org.dmfs.tasks/)
- [DAVx⁵](https://f-droid.org/en/packages/at.bitfire.davdroid/)
- [PhoneTrack](https://f-droid.org/en/packages/net.eneiluj.nextcloud.phonetrack/)
