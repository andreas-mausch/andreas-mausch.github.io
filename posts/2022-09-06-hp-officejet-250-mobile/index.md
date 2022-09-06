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

# Linux

## Printing on Linux

## Scanning on Linux
