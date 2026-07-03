---
title: "VPNs on OpenWrt: WireGuard vs. IKEv2/IPSec vs. OpenVPN TAP mode"
date: 2026-03-01T14:00:00+01:00
tags: ['network', 'openwrt', 'vpn']
---

# Goals

My goal is to be able to connect to my
home network from anywhere in the world
and access everything on it the same way as I
would be in my local WiFi.

# Why three different VPN protocols?

- WireGuard: Best modern protocol
- IKEv2/IPSec: Client is integrated into stock Android
- OpenVPN TAP mode: The only VPN in this list which works on OSI Layer 2 (Ethernet)

# When do you need a Layer 2 network?

Most VPNs work on Layer 3, but Layer 2 can be useful if:

- You just want to be a client in your own network the same way as
  if you were connected to your home Wi-Fi.
- You want to use the real DHCP and NTP servers on the network.
- You want to use network broadcasts, for example via `avahi` or `WOL`.

The only protocol I've found that supports Layer 2 bridging is
OpenVPN in TAP mode.
However, Android doesn't support connecting to it.

On a local network, your DHCP server could propagate
a default NTP server to use to all clients.

WireGuard doesn't offer a way to set an NTP server just for one network,
neither does NetworkManager.

So you lose some functionality with WireGuard and IKEv2/IPSec,
compared to being directly connected to your home network.

I think for most people in most cases, you do not need Layer 2.
If all you need is access to your home servers, NAS, SSH, or web interfaces,
a Layer 3 VPN such as WireGuard is usually sufficient.

But be aware that a VPN connection might lack features you would
have if you were connected to your WiFi directly.

# Feature matrix

What VPN is missing, compared to a local connection:

| Feature                       | WireGuard          | IKEv2/IPSec                                  | OpenVPN TAP   |
|-------------------------------|--------------------|----------------------------------------------|---------------|
| Dynamic IP addresses via DHCP | No, only fixed IPs | No, only fixed IPs                           | Yes           |
| Same subnet                   | No, own subnet     | No, own subnet                               | Yes           |
| DNS propagation               | No                 | Only via manual config                       | Yes, via DHCP |
| NTP propagation               | No                 | Supported on protocol level, not via swanctl | Yes, via DHCP |
| Ethernet broadcasts           | No(?)              | No(?)                                        | Yes           |
| avahi                         | No                 | No                                           | Yes           |
| Wake-on-LAN (WOL)             | No                 | No                                           | Yes           |

# Issues of OpenVPN in TAP mode

If you look at the matrix above, you could think:
*Well, I just go with OpenVPN TAP then.*

However, OpenVPN TAP has its own problems:

- As mentioned, Android cannot be used as a client.
- In my tests, and I did quite a lot, I wasn't able to obtain a DHCP lease
  automatically after a connection was established.
  I always have to call `dhclient` manually after the `openvpn` CLI tool.
- NetworkManager on Linux has trouble connecting to OpenVPN TAP networks.

Since WireGuard is much more convenient, I will only use OpenVPN TAP
as a fallback solution when I need one of the Layer 2 features listed above.

For daily use cases WireGuard is usually sufficient for me.

# Blocked connections

Some networks or providers block VPN connections.

All of these protocols can be identified and blocked by
sufficiently restrictive networks.

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

I will use **WireGuard** as my main protocol, and occasionally use
**OpenVPN in TAP mode** when I want to use my WiFi's DHCP, DNS, NTP or
when I want to send broadcasts on Layer 2, for example for avahi.
