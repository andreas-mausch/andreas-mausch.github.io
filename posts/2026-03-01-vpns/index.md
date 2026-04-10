---
title: "VPNs on OpenWrt: Wireguard vs. IKEv2/IPSec vs. OpenVPN TAP mode"
date: 2026-03-01T14:00:00+01:00
tags: ['network', 'openwrt', 'vpn']
---

# Goals

My goal is to be able to connect to my
home network from anywhere in the world
and access everything on it the same way as I
would be in my local WiFi.

# Why three different VPN protocols?

- Wireguard: Best modern protocol
- IKEv2/IPSec: Client is integrated into stock Android
- OpenVPN TAP mode: The only real VPN on OSI Layer 2 (Ethernet)

# Why is Layer 2 important?

Most VPNs work on Layer 3, but Layer 2 can be useful if:

- You just want to be a client in your own network the same
  way if you'd connect via WiFi at home.
- You want to use the real DHCP and NTP servers on the network.
- You want to use network broadcasts, for example via `avahi`.

For example, on a local network your DHCP server could propagate
a default NTP server to use to all clients.

The only protocol I've found which can work on Layer 2 is
OpenVPN in TAP mode.
However, Android doesn't support to connect to it.

IKEv2/IPSec supports a NTP attribute (I think), which
can propagate an NTP server to use to a client. But it needs to
be configured manually, in addition to the manual IP setup.

Wireguard doesn't offer a way to set an NTP server just for one network,
neither does NetworkManager.

So you lose some functionality with Wireguard and IKEv2/IPSec,
compared to being on the real network.

# Feature matrix

What VPN is missing, compared to a local connection:

| Feature                       | Wireguard          | IKEv2/IPSec                                  | OpenVPN TAP   |
|-------------------------------|--------------------|----------------------------------------------|---------------|
| Dynamic IP addresses via DHCP | No, only fixed IPs | No, only fixed IPs                           | Yes           |
| Same subnet                   | No, own subnet     | No, own subnet                               | Yes           |
| DNS propagation               | No                 | Only via manual config                       | Yes, via DHCP |
| NTP propagation               | No                 | Supported on protocol level, not via swanctl | Yes, via DHCP |
| Ethernet broadcasts           | No(?)              | No(?)                                        | Yes           |
| avahi                         | No                 | No                                           | Yes           |

# Issues of OpenVPN in TAP mode

If you look at the matrix above, you could think:
*Well, I just go with OpenVPN TAP then.*

However, OpenVPN TAP has it's own problems:

- As mentioned, Android cannot be used as a client.
- In my tests, and I did quite a lot, I wasn't able to set up
  the DHCP query automatically after a connection was established.
  I always have to call `dhclient` manually after the `openvpn` CLI tool.
- NetworkManager on Linux has problems to connect to OpenVPN TAP.

It is way more convenient to connect via Wireguard,
that I will only use OpenVPN TAP as a fallback solution in case
I need one of the features in the list.
For daily use cases Wireguard is usually sufficient to me.

# Blocked connections

Some networks or providers block VPN connections.

All of the mentioned protocols can be detected and blocked.

OpenVPN has a TLS mode, which should be indistinguishable
from HTTPS traffic, especially if your server operates on port 443,
but it still can be detected, because the packet structure, sizes and timings
differ from a browser HTTPS connection.

For full firewall penetration, [stunnel](https://www.stunnel.org/) and
[v2ray](https://www.v2ray.com/en/) look promising. But I haven't tested them.

# Verdict

I found it *very* complicated to set up all of the protocols.

I found no easy, simple way to really connect to your home
like a local WiFi connection would.

I will use **Wireguard** as my main protocol, and occasionally use
**OpenVPN in TAP mode** when I want to use my WiFi's DHCP, DNS, NTP or
when I want to send broadcasts on Layer 2, for example for avahi.
