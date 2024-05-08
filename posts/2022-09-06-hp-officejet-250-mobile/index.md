---
title: Printing and Scanning on Linux
date: 2022-09-06T22:00:00+02:00
tags: ['printing', 'scanning', 'android', 'linux', 'hp', 'hplip', 'avahi', 'cups', 'sane']
thumbnail: hplip-printer.jpg
toc: true
---

{% image "hplip-printer.jpg" %}

# Introduction

## HP DeskJet 320

Since a kid I always found printing difficult to do.
My first printer I had was a HP DeskJet 320.
It was a very small and compact printer, but since I didn't know much about printers usually look like,
I didn't care too much about it.

It had a standard LPT port and worked fine on my Windows 98 machine.
Except: The document feeder didn't work well. Sometimes I was lucky to get a whole page printed,
but the printer **always** needed help with the start of feeding and usually also during the print.

Many pages ended up being crumpled.
It was a mess.

## HP OfficeJet Pro 6970

My last printer I used was a HP OfficeJet Pro 6970, which was especially interesting to me due to the
duplex scanning function.

The printer was annoying though: I rarely print, and each time I booted the printer it did a full
"cartridge-maintenance-program". Which not only lasts for a too long time, but also wastes a lot of ink.

And the biggest problem: After the first cartridge that came with the printer (it is just a sample cartridge which is not 100% filled)
was empty, I've ordered a replacement.
But to my surprise whenever I printed despite hearing the usual noises the resulting page was still white.
It just didn't put any ink on pages anymore.

The device was still in warranty, so I got it replaced by another model.
Same story: After the first cartridge I wasn't able to print anymore.
I cannot tell if it was me just being stupied twice, but I remember at least the second time I tried to be extra careful.

## HP...again? HP OfficeJet 250 Mobile

So today my new printer arrived: A HP OfficeJet 250 Mobile.

You might think: This guy is stupid, he was disappointed by HP for three times in a row and still buys a new model from them.
The reason I did: I wasn't able to find any good alternatives.
Canon doesn't support Linux and the other brands don't really have portable printers (for full-size A4).
Also, the reviewers for the product seemed to be very happy with it.

And since I also like it very much (as of today), I would like to share the setup process.

# Android

## Printing on Android

For printing, HP provides an Android plugin which integrates very well into the system:  
[HP Print Service Plugin](https://play.google.com/store/apps/details?id=com.hp.android.printservice)

{{ "android/print-plugin/*.png" | glob | carousel }}

If you add the printer for the first time, it might take a while to be discovered.
But for me it appeared almost instantly.

## Scanning on Android

For scanning, HP provides a different app:  
[HP Smart](https://play.google.com/store/apps/details?id=com.hp.printercontrol)

To make it short: I hate it.

- The first start took a long time. I don't know what happened there.
- It comes with ads, you have to agree to their data usage.
- And: You need to create an account at HP in order to be able to scan. 🤮

{{ "android/hp-smart/*.png" | glob | carousel }}

I didn't continue here.

# USB

You can directly store a scan on at usb stick (FAT32 file system).
Works without any further software. 👍

If you scan via USB, the scan will result in a .pdf file.
To convert a scanned .pdf to .jpg, I recommend to use the tool `pdfimages`.
The `-j` option saves images as jpegs.

```bash
pdfimages -list input.pdf
pdfimages -j input.pdf .
```

# Linux

For Linux, HP provides an open-source library [HPLIP](https://sourceforge.net/projects/hplip/).
It can be used for both, printing (via CUPS) and scanning (via SANE).

## Printing on Linux

```shell-session
$ lsusb | grep HP
Bus 003 Device 003: ID 03f0:e911 HP, Inc OfficeJet 250 Mobile Series
```

```bash
sudo pacman -S cups hplip
# optional: paru -S hplip-plugin
hp-setup --interactive
```

This will walk you through a CLI wizard, it will show all available devices and will add the selected one to CUPS:

{% thumbnail-clickable "linux/hp-setup.png" %}

To validate the installation was correct, you can call `hp-info`.
It will output lots of information about your device.

If everything worked correctly, you can now just select the printer in your favorite app.

To list all printers, run this:

```bash
lpstat -t
```

## Scanning on Linux

You can use `scanimage` to scan a page.

```shell-session
$ scanimage --list-devices
device `v4l:/dev/video2' is a Noname Integrated Camera: Integrated I virtual device
device `v4l:/dev/video0' is a Noname Integrated Camera: Integrated C virtual device
device `escl:https://192.168.178.72:443' is a HP OfficeJet 250 Mobile Series [C5372E] adf scanner
device `hpaio:/usb/OfficeJet_250_Mobile_Series?serial=TH' is a Hewlett-Packard OfficeJet_250_Mobile_Series all-in-one
device `hpaio:/net/officejet_250_mobile_series?ip=192.168.178.72&queue=false' is a Hewlett-Packard officejet_250_mobile_series all-in-one
```

As you can see, the OfficeJet pops up twice: One time for the wired connection, and the second one for the wireless one.
I tried both, and I was very happy to see wireless worked on first try.

Save scan as .jpg:

```bash
scanimage --device-name "hpaio:/usb/OfficeJet_250_Mobile_Series?serial=TH" --progress --format tiff --mode Color --resolution 300dpi -l 0mm -t 0mm -x 210mm -y 297mm | magick convert - -resize "1920x1920>" -quality 75 image.jpg
```

Just replace the `device-name` by the one with the IP address and you can scan without a wire.

# Findings the firmware version

I couldn't find the firmware version in the menus on the printer, but I found a menu item to print a status page.
It contained the firmware version.

{% thumbnail-clickable "printer-status.jpg" %}

# Firewall Settings on FritzBox

I want to make sure the printer stays as functional as it is right now,
so I don't want to allow any automatic updates on the device.

Therefore, I disabled automatic updates in it's settings.
Additionally, I also restricted the internet access in the FritzBox, so it cannot access the internet at all.

{% image "fritzbox-profiles.png" %}
