---
layout: post
title:  "Nikon DSLR as Webcam"
date:   2021-03-08 21:00:00 +01:00
tags:
---

![]({{ site.baseurl }}/images/2021-03-08-nikon-dslr-webcam/setup.jpg)

# Equipment

## Nikon D5600

![]({{ site.baseurl }}/images/2021-03-08-nikon-dslr-webcam/nikon-d5600.jpg)

## Tripod: [Neewer Mini Stativ](https://www.amazon.de/gp/product/B07FKDH3BC), 38,99 EUR

![]({{ site.baseurl }}/images/2021-03-08-nikon-dslr-webcam/tripod.jpg)

![]({{ site.baseurl }}/images/2021-03-08-nikon-dslr-webcam/tripod-screw.jpg)

The tripod is nice, but I dislike the screw which is not very good to fasten with just your fingers.

## Mini HDMI to HDMI Adapter: [Link](https://www.amazon.de/gp/product/B07TNTMNHB), 2,53 EUR

## Capture card (USB-C): [Zhongkaifa HDMI to Type-C Video Capture Card](https://www.amazon.de/gp/product/B08P321VRQ), 18,99 EUR

![]({{ site.baseurl }}/images/2021-03-08-nikon-dslr-webcam/hdmi-to-usb-c-adapter.jpg)

## Dummy battery for Nikon: [Link](https://www.amazon.de/gp/product/B0746J5R69), 39,99 EUR

This is useful for long sessions. Just plug a power cable and don't be scared to run out of battery.  

![]({{ site.baseurl }}/images/2021-03-08-nikon-dslr-webcam/dummy-battery.jpg)

There are different versions of this battery. I've decided to use a variant which offers USB.
That way, you might be able to power your camera by a powerbank.  
Note: The power supply should be able to provide 3A.

# Alternatives

## Official tool

There is the [Nikon Webcam Utility](https://downloadcenter.nikonimglib.com/en/products/548/Webcam_Utility.html) available
for Windows and Mac. Linux is not supported, and for a maximum flexibility I've decided to use the HDMI solution.

I can imagine for most users it is the more convenient method though.

## digiCamControl

[digiCamControl](http://digicamcontrol.com) is an [open-source](https://github.com/dukus/digiCamControl) tool which also offers LiveView.
No HDMI capture card needed, just the USB connection.

## gPhoto2

See crackedthecode link below.

# Camera settings

![]({{ site.baseurl }}/images/2021-03-08-nikon-dslr-webcam/nikon-settings-liveview.jpg)

Extend LiveView mode time to the maximum. Unfortunately, on my camera I cannot set it to unlimited.

![]({{ site.baseurl }}/images/2021-03-08-nikon-dslr-webcam/nikon-settings-hdmi.jpg)

Make sure to just transfer the video and disable the simple mode.

You might want to set the focus mode to AF-F, however it didn't work for me as well as expected (almost no re-focus), so I kept it manual.

![]({{ site.baseurl }}/images/2021-03-08-nikon-dslr-webcam/focus-mode.jpg)

If everything is connected, enter LiveView mode and press the Info button several times until the settings frame disappears.

# Video4Linux

After everything was connected, the camera showed up immediately without further settings on my Manjaro Linux machine.

List all available formats:

```bash
v4l2-ctl --device /dev/video0 --list-formats-ext
```

# OBS Studio

Okay, this is pretty well-known today, but a link for the sake of completeness: [https://obsproject.com](https://obsproject.com)

Big software which provides a lot of options for recording, testing settings etc.

You are free to use any other recording software, and most softwares will detect the video as a webcam input automatically.

# FPS problems

In YUYV mode, I was only able to get 5 FPS and everything was laggish.
However, if I use YV12 mode, I was able to use full 60 FPS.

![]({{ site.baseurl }}/images/2021-03-08-nikon-dslr-webcam/obs-60-fps.jpg)

# Delay, sync video and audio

I had a video delay of about 300ms. OBS doesn't offer you an option to set the delay for the video.
However, setting it for the audio works well.

Make sure to select the Microphone from the Capture Card to get best synced results.

# Links

- [https://gwegner.de/know-how/dslr-als-webcam-hdmi-video-aufnahme/](https://gwegner.de/know-how/dslr-als-webcam-hdmi-video-aufnahme/)
- [https://www.crackedthecode.co/how-to-use-your-dslr-as-a-webcam-in-linux/#arch-linux](https://www.crackedthecode.co/how-to-use-your-dslr-as-a-webcam-in-linux/#arch-linux)
