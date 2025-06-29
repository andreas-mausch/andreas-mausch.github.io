---
title: "Near-field communication (NFC): Tags, Smartcards, Javacards"
date: 2025-06-18T17:20:00+02:00
tags: ["nfc", "openpgp", "smartcard", "javacard", "ntag216", "ndef", "pcsc"]
toc: true
---

I tinkered with NFC tags the last couple of days and want to share what I learned.

# NFC tag types and protocols

There are different kind of NFC tags from different vendors,
which speak different protocols.

I first bought the wrong type, because I thought every NFC tag would
speak the same standardized protocol. So don't make my mistake.

Most tags speak one of those:

- ISO 14443A - Type 2
  Very common, e.g. NTAG213/NTAG215/NTAG216,
  optimized for simple NDEF data (e.g. URLs, IDs, coupons)
- ISO 14443A - Type 4
  Ideal for authentication, payments, access control
- MIFARE Classic – Legacy (proprietary)
  Still found in older transit systems and access cards
- MIFARE Ultralight – Based on NFC Forum Type 2
- MIFARE DESFire – Based on ISO 14443A; used in secure applications
- ISO 7816: Smart card command set (APDU)
  Used in Type 4 tags, secure elements, ePassports, bank cards

The simple tags like NTAG216 speak `ISO 14443A - Type 2`.

The more advanced ones which offer encryption and/or smartcard-like
features speak `ISO 14443A - Type 4`.

# NDEF

If you ever see a simple NFC tag which opens a website or
provides contact data (vCard), it usually uses the NFC Data Exchange Format (NDEF).

Most of the tags which use NDEF are ISO 14443A - Type 2, like the NTAG213.

# Read speed

In my experience, some tags need to be placed very accurately on the reader
or the back of your phone and take some seconds to be recognized.
Others are detected almost instantly, even when not touching the reader yet.

In my experience it depended on the type of the tag and the amount of data which
is transmitted. So a NTAG213 with 144 bytes is detected way faster and more
reliable than a MIFARE DESFire EV3 with 8 KB.

So from my preference, I like the smaller ones a lot, and if they are sufficient to
your needs, I recommend them to you.

# PC/SC and APDU

PC/SC (Personal Computer/Smart Card) is a standardized interface
for software to talk to smart card readers.

We can talk to our tags via APDU (Application Protocol Data Unit) commands.

One note: Some NFC communication is more low-level than APDU, and cannot
be easily captured or sent.

# Tools to read NFC tags

## Linux

- https://github.com/nfc-tools/libnfc
- pcsc-lite
- pcsc-rust

Problem with `libnfc`:
[Cannot dump NTAG216: Empty ATQA (00 00) on NFC reader AK9567 #755](https://github.com/nfc-tools/libnfc/issues/755)

My reader does not provide a special field (ATQA) to the PC which is transferred
between the tag and the reader during the initial handshake.
`libnfc` relies on that value though to detect the tag type, which then fails.
I couldn't find a way to spoof that ATQA field neither, so I cannot use my reader with libnfc. :(

### pcsc-lite

List readers:

```bash
systemctl start pcscd.service

# List readers
pcsc_scan -r

# List cards
pcsc_scan -c
```

There is also `scriptor`, which is part of the pcsc-tools.
It can send APDU commands directly to your reader.

```shell-session
$ scriptor -r 'Alcor Link AK9567 [Contactless Card Reader] 01 00'
Using given card reader: Alcor Link AK9567 [Contactless Card Reader] 01 00
Using T=1 protocol
Reading commands from STDIN
reset
> RESET
< OK: 3B 8F 80 01 80 4F 0C A0 00 00 03 06 03 00 03 00 00 00 00 68
^C⏎
```

See below for a list of APDU commands I have tried.

### nfc-tools

Hardly documented, but you might want to set environment variables for more output
and selecting the right device:

```env
LIBNFC_LOG_LEVEL=3
LIBNFC_DEVICE='pcsc:Alcor Link AK9567 [Contactless Card Reader] 01 00'
```

#### List readers

```bash
nfc-list [-v]
```

Example output:

```shell-session
$ nfc-scan-device -v
nfc-scan-device uses libnfc 1.8.0
2 NFC device(s) found:
- Alcor Link AK9567 00 00:
    pcsc:Alcor Link AK9567 00 00
Generic (MLM�U)
- Alcor Link AK9567 [Contactless Card Reader] 01 00:
    pcsc:Alcor Link AK9567 [Contactless Card Reader] 01 00
Generic (�\LM�U)
```

```shell-session
$ nfc-list
nfc-list uses libnfc 1.8.0
NFC device: Alcor Link AK9567 00 00 opened
NFC device: Alcor Link AK9567 [Contactless Card Reader] 01 00 opened
1 ISO14443A passive target(s) found:
ISO/IEC 14443A (106 kbps) target:
    ATQA (SENS_RES): 00  00
       UID (NFCID1): 04  89  b1  8a  90  6b  81
      SAK (SEL_RES): 20
                ATS: 75  77  81  02  80  4f  0c  a0  00  00  03  06  03  00  03  00  00  00  00
```

#### Reading data

As mentioned, this fails with `nfc-tools` and my reader.

They tell nfc-tools which kind of tag is scanned.
If it is not available, the `nfc-mfultralight r` command fails,
because it says the tag is not a _MIFARE Ultralight card_.

I have used a NTAG216 for testing this.

However, I later found a way to read single blocks
using APDU directly. Please see below.

### pcsc-rust

A neat tool written in Rust to communicate with PC/SC.

```shell-session
$ ./target/debug/examples/readme
Using reader: "Alcor Link AK9567 [Contactless Card Reader] 01 00"
Sending APDU: [0, 164, 4, 0, 10, 160, 0, 0, 0, 98, 3, 1, 12, 6, 1]
APDU response: [106, 130]
```

I have not tried anything further than the provided example.

## Android

- [NFSee - NFC Card Helper](https://f-droid.org/packages/im.nfc.nfsee/)
- [MIFARE Classic Tool](https://github.com/ikarus23/MifareClassicTool)
  only works with Mifare Classic, not other Mifare products (Ultralight for example)
- Non-free: [NFC Tools](https://play.google.com/store/apps/details?id=com.wakdev.wdnfc&hl=en)
  the best I have tried. They also provide a Desktop variant.

# APDU commands

Some commands are specific to your reader and may not work or
even destroy your tag, so please use at your own risk.

- `FF CA 00 00 00`
  Read serial number (UID)
- `FF B0 00 01 10`
  Read block 01
- `FF D6 00 06 10 01 02 03 04`
  Write block 06

Get available memory: `FF B0 00 03 04`
This reads the `CC` (Capability Container) block.
It describes how the memory of the tag is structured and how it should be accessed.
On Type 2 tags (like NTAG213), it’s at bytes 12–15 (block 3).
On Type 4 tags, it's inside a special EF (Elementary File) called `EF.CC`.

The response looks like this `E1 10 6D 00 90 00`.
In this case 0x6D * 8 = 876 bytes user memory (this is NTAG216).

> This follows the ISO/IEC 7816-4 standard for APDUs.
> FF: Class byte – proprietary class (non-ISO standard), often used for vendor-specific commands (commonly for memory cards, contactless cards, etc.)
> B0: Instruction – typically B0 means Read Binary

Example call with request and response:

```shell-session
$ scriptor -r 'Alcor Link AK9567 [Contactless Card Reader] 01 00'
Using given card reader: Alcor Link AK9567 [Contactless Card Reader] 01 00
Using T=1 protocol
Reading commands from STDIN
reset
> RESET
< OK: 3B 8F 80 01 80 4F 0C A0 00 00 03 06 03 00 03 00 00 00 00 68
FF CA 00 00 00
> FF CA 00 00 00
< 04 BD 0F 8A CD 11 90 90 00 : Normal processing.
```

# Java Cards

Java cards or the Java Card OpenPlatform (JCOP) are very interesting.

They provide smart card functionality and can store a key in a secret way,
so the key cannot be extracted from the card.

You can install special Java Card applets onto the chip.
Examples are:

- [SmartPGP](https://github.com/github-af/SmartPGP)
  an OpenPGP card, compatible with GnuPG (gpg)
- [openjavacard-ndef](https://github.com/OpenJavaCard/openjavacard-ndef)
- [Satochip](https://github.com/Toporin/SatoChipApplet)
  a crypto-currency hardware wallet with full BIP32/BIP39 support

Especially the SmartPGP applet is really cool in my opinion,
as it allows to use a PGP key in combination with Android and OpenKeychain via NFC.

I also own a Nitrokey 3C NFC, and it's not possible there, because the
secure element cannot be powered via NFC.
The Java Card however, it magically can. I'm not sure why, maybe it is more power efficient.

While most Java Cards come in the form of SIM cards with dual interface (physical or NFC),
there is one cool project called [OMNI Ring](https://store.nfcring.com/products/omni.html),
which is a full Java Card (unfortunately only version 3.0.1) in the form factor of a ring.
It is sold out though. :(

# List of common tags

Here is a list of common tags
(mostly ChatGPT, not verified).

| Vendor             | Model                 | User Memory (Bytes) | ISO Standard(s)                                                        | NFC Type                     | Encryption                          | Password Protection | Secure Messaging | Tamper Detection | Energy Harvesting | Fast Read | Applications / Notes                                                     |
| ------------------ | --------------------- | ------------------- | ---------------------------------------------------------------------- | ---------------------------- | ----------------------------------- | ------------------- | ---------------- | ---------------- | ----------------- | --------- | ------------------------------------------------------------------------ |
| NXP                | NTAG213               | 144                 | ISO 14443 Type A                                                       | Type 2                       | None                                | ✅                  | ❌               | ❌               | ❌                | ✅        | NFC Forum compliant                                                      |
| NXP                | NTAG215               | 504                 | ISO 14443 Type A                                                       | Type 2                       | None                                | ✅                  | ❌               | ❌               | ❌                | ✅        | Used in Amiibo                                                           |
| NXP                | NTAG216               | 888                 | ISO 14443 Type A                                                       | Type 2                       | None                                | ✅                  | ❌               | ❌               | ❌                | ✅        | High capacity                                                            |
| NXP                | NTAG424 DNA           | 256                 | ISO 14443 Type A                                                       | Type 4                       | AES-128                             | ✅                  | ✅               | ❌               | ❌                | ✅        | Secure authentication, URL mirroring                                     |
| NXP                | MIFARE Classic 1K     | 1024                | ISO 14443 Type A                                                       | Proprietary                  | CRYPTO1 (weak)                      | ✅                  | ❌               | ❌               | ❌                | ❌        | 16 sectors, legacy access                                                |
| NXP                | MIFARE Classic 4K     | 4096                | ISO 14443 Type A                                                       | Proprietary                  | CRYPTO1 (weak)                      | ✅                  | ❌               | ❌               | ❌                | ❌        | 40 sectors, large memory                                                 |
| NXP                | MIFARE DESFire EV1    | 2K / 4K / 8K        | ISO 14443 Type A                                                       | Type 4                       | AES/3DES                            | ✅                  | ✅               | ❌               | ❌                | ❌        | Enterprise-grade, multi-application                                      |
| NXP                | MIFARE DESFire EV3    | 2K / 4K / 8K        | ISO 14443 Type A                                                       | Type 4                       | AES                                 | ✅                  | ✅               | ✅               | ❌                | ❌        | Enhanced security, random IDs                                            |
| NXP                | MIFARE Plus EV1       | 2K / 4K             | ISO 14443 Type A                                                       | Type 4                       | AES-128                             | ✅                  | ✅               | ❌               | ❌                | ❌        | Upgrade path from Classic, AES-secured access                            |
| NXP                | MIFARE Plus S / X     | 2K / 4K             | ISO 14443 Type A                                                       | Type 2 / 4 (SL1/SL3)         | AES-128 (SL3 only)                  | ✅                  | ✅               | ❌               | ❌                | ❌        | Less features than EV1-Version, Upgradeable to AES-secured access in SL3 |
| NXP                | MIFARE Ultralight C   | 192                 | ISO 14443 Type A                                                       | Type 2                       | 3DES                                | ✅                  | ❌               | ❌               | ❌                | ❌        | Low-cost ticketing                                                       |
| NXP                | MIFARE Ultralight EV1 | 48 / 128            | ISO 14443 Type A                                                       | Type 2                       | AES-128                             | ✅                  | ✅               | ❌               | ❌                | ✅        | Improved Ultralight version, secure tickets                              |
| STMicroelectronics | ST25TA02K             | 256                 | ISO 14443 Type A                                                       | Type 4                       | None                                | ✅                  | ❌               | ✅               | ❌                | ❌        | Tamper detection                                                         |
| STMicroelectronics | ST25TV02K             | 256                 | ISO 15693                                                              | Type 5                       | None                                | ✅                  | ❌               | ✅               | ❌                | ❌        | Long range                                                               |
| STMicroelectronics | ST25DV04K             | 4096 (EEPROM)       | ISO 15693 + I²C                                                        | Dual (Type 5 + I²C)          | None                                | ✅                  | ✅               | ❌               | ✅                | ✅        | Mailbox, fast transfer                                                   |
| Sony               | FeliCa Lite-S         | 224                 | FeliCa (Proprietary)                                                   | Type 3                       | AES MAC (auth only)                 | ✅                  | ✅               | ❌               | ❌                | ❌        | Lightweight auth, IDm                                                    |
| Sony               | FeliCa RC-S620        | 1024                | FeliCa (Proprietary)                                                   | Type 3                       | Proprietary                         | ✅                  | ✅               | ❌               | ❌                | ✅        | Transit card use (e.g., Suica)                                           |
| Infineon           | my-d move             | 320                 | ISO 14443 Type A                                                       | Type 2                       | None                                | ✅                  | ❌               | ❌               | ❌                | ❌        | Basic protection                                                         |
| Infineon           | my-d proximity        | 1024                | ISO 14443 Type A                                                       | Type 2                       | Proprietary                         | ✅                  | ✅               | ❌               | ❌                | ❌        | Multiple apps/security levels                                            |
| Broadcom (Legacy)  | Topaz 512             | 64                  | ISO 14443 Type A                                                       | Type 1                       | None                                | ❌                  | ❌               | ❌               | ❌                | ❌        | Simple, low-cost, now obsolete                                           |
| NXP                | JCOP4 J3R180          | 180 KB              | JavaCard 3.0.5 Classic, ISO 7816, ISO 14443 A, GlobalPlatform 2.x, EMV | Contact + Contactless (dual) | AES‑256 / 3DES / RSA‑4096 / ECC‑521 | ✅                  | ✅               | ✅               | ❌                | ❌        | Secure OS, multi‑app, EMV, eID, ePassport, digital signature             |

- Secure Messaging: Includes features like random UID, mutual authentication, etc.
- Tamper Detection: Built-in mechanism for detecting physical tampering.
- Energy Harvesting: Can power small external circuitry from the reader's field.
- Fast Read: Optimized for reading multiple blocks quickly.

The Nitrokey 3C NFC is a **MIFARE Plus**.
