---
layout: post
title: "Cast your screen to a Chromecast without Chrome"
date: 2022-02-19 17:00:00 +01:00
tags: tv avahi mdns
---

I tried to cast my screen to my TV (with a built-in Chromecast).

# Tools tested

## Google Chrome / Chromium

Best experience by far.
Streaming starts very fast and with very low delay (~0.5 seconds).

But I would like to not use Chrome if possible, and I think it's not the browser's job to cast my screen.
So I kept looking for some alternatives.

## miraclecast

[https://github.com/albfan/miraclecast](https://github.com/albfan/miraclecast)

This didn't work for me, and it is not fully [implemented yet](https://github.com/albfan/miraclecast/issues/4).

I was able to run `miracle-wifid`, but only after I disconnected from my normal wifi.
Also, `miracle-wifictl` hung when I ran the `p2p-scan` command.
I didn't investigate any further.

## gnome-network-displays

[https://gitlab.gnome.org/GNOME/gnome-network-displays](https://gitlab.gnome.org/GNOME/gnome-network-displays)

It found a TV nearby, but not mine.
My Fire TV stick was also not found, and is not supported.
Chromecast is also not supported: [Issue](https://gitlab.gnome.org/GNOME/gnome-network-displays/-/issues/18)

## castnow

[https://github.com/xat/castnow](https://github.com/xat/castnow)

Tool exclusivly to work with Chromecast.
I was able to find the Chromecast in my network and stream media to it.

Unfortunately, there is no built-in command to stream your desktop.
[https://github.com/xat/castnow/issues/208](https://github.com/xat/castnow/issues/208)

The only way it worked for me was using `ffmpeg`:

```
ffmpeg -hide_banner -loglevel error -video_size 3840x2160 -framerate 30 -f x11grab -i :0.0 -vf "scale=iw/2:ih/2" -c:v libx264 -level 3.0 -pix_fmt yuv420p -x264opts keyint=2 -crf 23 -preset ultrafast -tune zerolatency -f mp4 -movflags frag_keyframe+faststart - | castnow --quiet -
```

However, the delay was very high (~10 seconds).

Also, I found that `ffmpeg` didn't output to stdout immediately, but had a delay itself.
I was able to reduce it by setting the `keyint` option. Still not perfect, but way faster.

## go-chromecast

[https://github.com/vishen/go-chromecast](https://github.com/vishen/go-chromecast)

Similar experience to `castnow`.

```
$ ./go-chromecast ls
1) device="2021/22 Philips UHD Android TV" device_name="Philips TV" address="192.168.1.23:8009" uuid="1234567890abcdef1234567890abcdef"
```

```
./go-chromecast transcode --content-type video/mp4 --command="ffmpeg -video_size 3840x2160 -framerate 10 -f x11grab -i :0.0 -c:v libx264 -level 3.0 -pix_fmt yuv420p -x264opts keyint=2 -crf 23 -preset ultrafast -tune zerolatency -f mp4 -movflags frag_keyframe+faststart -"
```

## Android: miracast-widget

[https://github.com/mattgmg1990/miracast-widget](https://github.com/mattgmg1990/miracast-widget)

To cast your screen on Android without using the *Google Home* app, you can use this neat tool.

All it does is opening the Android built-in cast page.
I wasn't even able to open the page without this widget, maybe Samsung hides it in their menus(?).

But with this widget, casting the screen was super fast, just like using Google Chrome.

# Difference between Google Chrome and the other tools

I wondered how and why Google Chrome was faster to establish the connection and start the screen sharing.
Just from my feeling, it looks like it doesn't tell the Chromecast to "stream a video",
but rather puts the Chromecast in a different mode.

With all other tools I see this loading screen for about a second before it starts the video streaming:

![]({{ site.baseurl }}/images/2022-02-19-chromecast-avahi/chromecast-tv-loading.png)

But with Google Chrome, this screen does not show up at all.
Instead, the first frame I see is the casted screen.
So I'm pretty sure it should be possible to reverse engineer this
and see what exact commands Chrome sends to the Chromecast.

# Chromecast Protocol

## avahi

One thing I learned was how my laptop finds the Chromecast.
It uses [avahi](https://en.wikipedia.org/wiki/Avahi_(software)):

> Avahi is a system which enables programs to publish and discover services and hosts running on a local network.

> Avahi implements the Apple Zeroconf specification, mDNS, DNS-SD and RFC 3927/IPv4LL.

Find Chromecasts in your network:

```
$ avahi-browse --verbose --ignore-local --resolve --terminate _googlecast._tcp
Server version: avahi 0.8; Host name: neonew-lenovo.local
E Ifce Prot Name                                          Type                 Domain
+ wlp1s0 IPv4 2021/22-Philips-UHD--1234567890abcdef1234567890abcdef _googlecast._tcp     local
= wlp1s0 IPv4 2021/22-Philips-UHD--1234567890abcdef1234567890abcdef _googlecast._tcp     local
   hostname = [1a2b3c4d-5e6f-1a2b-3c4d-5e6f1a2b3c4d.local]
   address = [192.168.1.23]
   port = [8009]
   txt = ["rs=Default Media Receiver" "nf=1" "bs=1A2B3C4D5E6F" "st=1" "ca=123456" "fn=Philips TV" "ic=/setup/icon.png" "md=2021/22 Philips UHD Android TV" "ve=05" "rm=" "cd=1A2B3C4D5E6F1A2B3C4D5E6F1A2B3C4D" "id=1234567890abcdef1234567890abcdef"]
: Cache exhausted
: All for now
```

Find all services available via avahi:

```
avahi-browse --all --verbose --ignore-local --resolve --terminate
```

GUI:

```
avahi-discover
```

## CASTV2

CASTV2 is the name of the proprietary protocol Google Cast uses.

I've found [https://github.com/dylanmckay/gcast/blob/master/PROTOCOL.md](https://github.com/dylanmckay/gcast/blob/master/PROTOCOL.md) and
[https://github.com/thibauts/node-castv2](https://github.com/thibauts/node-castv2).
