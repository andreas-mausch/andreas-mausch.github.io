---
title: "Setting up my first eSIM via adapter on Linux"
date: 2025-03-22T19:00:00+07:00
tags: ['esim', 'smartphone', 'internet access', 'travel']
thumbnail: eiotclub-esim.jpg
---

Most modern phones already support eSIM by their hardware.
Older phones sometimes do not, and I wanted to use a Samsung S10e
as my travel phone.

It does not support eSIM, but there are adapter cards available, which are physical
SIM cards you can install an eSIM profile on.\
Even multiple ones, if you like. But only one profile can be active at the same time.

{% image "eiotclub-esim.jpg", "EIOTCLUB eSIM" %}

In the manual is a link to a website with their software:

<https://www.eiotclub.com/pages/eiotclub-esim-reader-guide>

{% image "eiotclub-esim-reader.jpg", "EIOTCLUB eSIM Reader software" %}

I bought this without even knowing whether the software runs on Linux.
After the download I found a hint to LPAC and it mentioned Linux in a file.

So after looking it up I landed here:
<https://github.com/estkme-group/lpac>

LPAC means either *Lesbian Super PAC* or *C-based eUICC LPA*.

**C-based eUICC LPA**
Aha!

Glossary:

- eUICC: Embedded Universal Integrated Circuit Card
  The part which can store your eSIM profile. Usually built-in into a modern phone,
  or in our case in the eSIM adapter.
- LPA: Local Profile Assistant
  A software which can talk to the eUICC, to list and download eSIM profiles.

So `lpac` is an open-source CLI LPA tool list and download profiles.
Exactly what I was looking for.

After some more searching, I also found an open-source GUI tool:
[EasyLPAC](https://github.com/creamlike1024/EasyLPAC)

{% image "easylpac.png", "easyLPAC" %}

It looks frighteningly similar to the tool provided by EIOTCLUB, doesn't it?

# Inserting the eSIM adapter card into the USB adapter

{% image "eiotclub-esim-opened.jpg", "EIOTCLUB eSIM opened" %}

# Using the CLI via lpac

Reference:
<https://github.com/estkme-group/lpac/blob/main/docs/USAGE.md>

## View information

```bash
lpac chip info | jq
lpac profile list | jq
```

## Install a new profile

<https://wiki.soprani.ca/eSIM%20Adapter/lpac>

You need a QR-Code, which will give you a string in the format
`LPA:1$example.tld$XX-YYYYYY-ZZZZZZZ`.

```bash
lpac profile download -s example.tld -m "XX-YYYYYY-ZZZZZZZ" [-c 123456]
lpac profile enable [ICCID]
lpac profile nickname [ICCID] "My new eSIM"
```

`-c` is the confirmation code given by your provider.
If your provider gave you one, you must use it, otherwise the download will fail.
If you don't have one, skip this parameter.

> If you get an error involving * SCardEstablishContext() * APDU **driver** init failed
> 
> Try installing a possible missing dependency ccid. Also enable the systemd pcscd.socket with a command like
> `systemctl enable --now pcscd.socket`

# Using the GUI via EasyLPAC

```bash
paru -S easylpac
```

This takes some time to build, be patient.

The GUI is very self-explanatory.
There is a *Download* button and you can choose to enter the code string manually,
upload an image file with a QR code or scan it from your camera.

Just make sure to select your eSIM adapter beforehand and then press the refresh button.

Please note: eSIM profiles can only be downloaded once.
If you remove it afterwards from the device, it is gone.
If the download fails for some reason, you cannot retry it.
Make sure you have a good internet connection before trying it.

If you wish to transfer it to another device, it is sometimes possible, sometimes not,
depending on your provider.

# Technical details about eSIM

Harald Welte did a deep technical talk about eSIM, which I enjoyed
even though I only understood 1% of it:

<https://www.youtube.com/watch?v=vms_beSPhfY>
