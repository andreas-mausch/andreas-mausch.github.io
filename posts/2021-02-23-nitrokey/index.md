---
title: NitroKey, encryption, gpg
date: 2021-02-23T23:00:00+01:00
tags: ['nitrokey', 'encryption', 'gpg', 'privacy', 'security']
thumbnail: nitrokey-1.jpg
---

I've used the following commands to get my NitroKey Pro running on Manjaro Linux.

NitroKey is an alternative for the YubiKey, which is better known, cheaper, has more functionality...**BUT**:  
The NitroKey's [hardware](https://github.com/Nitrokey/nitrokey-pro-hardware) and [firmware](https://github.com/Nitrokey/nitrokey-pro-firmware) are open source!

I use my NitroKey mainly for [pass](https://www.passwordstore.org/), the "standard unix password manager",
to keep my very important passwords top secret.

So I don't really use FIDO2 or other features of a YubiKey.
NitroKey provides a [comparison sheet](https://www.nitrokey.com/de#comparison) for their different keys,
and as you can see you have to decide between gpg or FIDO2. Too bad.

# Controversy about gpg

Last month there was [a bug](https://lists.gnupg.org/pipermail/gnupg-announce/2021q1/000455.html) in libgcrypt,
discovered by [Project Zero](https://bugs.chromium.org/p/project-zero/issues/detail?id=2145).

It was published on January 28. A fixed libgcrypt version (1.9.1) was published the next day.

[golem.de](https://www.golem.de/news/verschluesselung-gpg-muss-endlich-weg-2102-153820.html) said the main developer,
Werner Koch, [reacted in an unprofessional way](https://dev.gnupg.org/T5279#142667) to the suggestion to introduce a CI.  
My opinion: They (the ticket author Hanno and Werner Koch) seem to know each other and I don't give too much about decency. Nobody was hurt.

It's further about the [lacking code quality](https://twitter.com/tqbf/status/1355176541139972098) of gpg.
The only alternative mentioned is [RNP](https://github.com/rnpgp/rnp).

However, gpg is the only OpenPGP implementation I know of which supports smartcards.
It might be of poor code quality, it might be missing a CI.
While I usually insist on good test coverage and everything automated, I don't really have a choice here.
Beside, I can't really judge gpg about those things, because I haven't taken a closer look.  
So for me, I will continue using it.

If anybody knows any alternative which works with smartcards, please let me know.

# Pictures

I've ordered my NitroKey bundled with a tiny USB-A to -C adapter.

{% image "nitrokey-1.jpg" %}

{% image "nitrokey-2.jpg" %}

{% image "usb-a-to-c-adapter.jpg" %}

# NitroKey setup

```bash
sudo pacman -S ccid
sudo wget -O /etc/udev/rules.d/41-nitrokey.rules https://raw.githubusercontent.com/Nitrokey/libnitrokey/master/data/41-nitrokey.rules
```

..as described in the official [documentation](https://www.nitrokey.com/documentation/frequently-asked-questions-faq#openpgp-card-not-available).  
[Here]({{ "41-nitrokey.rules" | relativeFile | url }}) is a mirror of that file.

Restart, and `gpg --card-status` should return something similar to this:

```shell-session
$ gpg --card-status
Reader ...........: 20A0:4108:00000000000000000000AAAA:0
Application ID ...: D27600011111111100050000AAAA0000
Application type .: OpenPGP
Version ..........: 3.3
Manufacturer .....: ZeitControl
Serial number ....: 0000AAAA
Name of cardholder: [nicht gesetzt]
Language prefs ...: de
Salutation .......: 
URL of public key : [nicht gesetzt]
Login data .......: [nicht gesetzt]
Signature PIN ....: zwingend
Key attributes ...: rsa2048 rsa2048 rsa2048
Max. PIN lengths .: 64 64 64
PIN retry counter : 3 0 3
Signature counter : 0
KDF setting ......: off
Signature key ....: [none]
Encryption key....: [none]
Authentication key: [none]
General key info..: [none]
```

# GPG test file

Let's assume you have both, the public and secret key, in your local gpg ring.
No NitroKey in play, yet.

Here are some basic commands to encrypt and decrypt a file with your key.

```bash
gpg --list-public-keys
gpg --list-secret-keys

echo test > test.txt

# Encryption
gpg --output test.txt.gpg --encrypt --recipient username@email test.txt

# Decryption
gpg --output test.decrypted.txt --decrypt test.txt.gpg
```

# Move the secret key to the NitroKey

```bash
gpg --edit-key --expert username@email
```

It will show you some info, then type the `keytocard` command to transfer the key to the NitroKey.
I had to enter the admin PIN twice (default: 12345678).
After this, type `quit` and confirm.

After this, the `gpg --list-secret-keys` command should show some output like this:

```shell-session
$ gpg --list-secret-keys
/home/user/.gnupg/pubring.kbx
-------------------------------
sec>  rsa4096 1999-01-01 [SC]
      BE6B9238A3F73D41599A474AE430E46A820299F6
      Kartenseriennr. = 0005 0000AAAA
uid        [ unbekannt ] username@email
ssb>  rsa4096 1999-01-01 [E]
```

As you can see, the *Kartenseriennr* (english: card serial number) is shown.
That means the reference to the NitroKey was successfully installed. Good work.

Try to run the decryption command from above again.
It should now ask you for your PIN (default: 123456), and the NitroKey is queried by gpg.

# On a different computer

On a new computer, run `gpg --card-edit`, then enter `fetch` and `quit` to import
the reference to the secret key on the NitroKey.

Note: The public key must be known to gpg at this point. It is ~~[not possible](https://stackoverflow.com/a/46735922)~~
to just import the public key from the NitroKey itself, because some information is missing.

If your public key is not on some server, please see the steps below how to export your key.
Afterwards, you can run `gpg --import file`.

Update: Apperently, it is indeed possible to recover the public key.
See this post:

[Recovering lost GPG public keys from your YubiKey](https://www.nicksherlock.com/2021/08/recovering-lost-gpg-public-keys-from-your-yubikey/)

# Exporting keys with gpg

## Public key

```bash
gpg --output public.asc --armor --export username@email
```

`armor` makes the output file a *ASCII-Armor-Format*, a 7-bit copy-pastable file.

## Secret key

```bash
gpg --output private.asc --armor --export-secret-key username@email
```

If you run this on a key which was already moved to the NitroKey, this command will not fail,
but only copies the *reference* to the private key.
There is no (gpg) way to get access to the private key anymore. That's why you own a NitroKey, right?

# Nitrokey 3C NFC

I've bought the new Nitrokey with USB-C port in March 2021, and it arrived in November 2021.
However, since then I never really used it, because I was waiting for the promised OpenGPG support.
When I ordered Nitrokey already said they are still working on that feature.
Then, they had other problems, like supply-chain issues and re-writing the firmware for a different chip (not 100% sure about it, but something like that).

Months passed by and I almost gave up on any update regarding this issue.
But today (2022-12-18), I found some updates in [their blog](https://www.nitrokey.com/de/blog):

- 2022-07-27: [Nitrokey 3: OpenPGP Card Development](https://www.nitrokey.com/blog/2022/nitrokey-3-openpgp-card-development)
- 2022-10-07: [Nitrokey 3 Status Update](https://www.nitrokey.com/blog/2022/nitrokey-3-status-update-2)
- 2022-10-22: [OpenPGP Card Alpha For Nitrokey 3](https://www.nitrokey.com/blog/2022/openpgp-card-alpha-nitrokey-3)
- 2022-12-06: [Nitrokey 3 Alpha Firmware](https://www.nitrokey.com/blog/2022/nitrokey-3-alpha-firmware)
- 2022-12-07: [Nitrokey 3A is Available; OpenPGP Card and One-Time Passwords as Test Versions](https://www.nitrokey.com/news/2022/nitrokey-3a-available-openpgp-card-and-one-time-passwords-test-versions)

Also, in December 2022 they added RSA support to the alpha firmware.
Keys are not yet stored in the secure element ("cryptographic keys are still stored unencrypted in the microprocessor"), which is a bummer, but well, there is progress.

I still criticize there is no status page on their website to track the progress, so I follow
[this issue](https://github.com/Nitrokey/nitrokey-3-firmware/issues/100) and
[this issue](https://github.com/Nitrokey/nitrokey-3-firmware/issues/136) on GitHub.

# Links

I've scraped these sites during my setup:

- [https://www.kuketz-blog.de/gnupg-schluesselerstellung-und-smartcard-transfer-nitrokey-teil2/](https://www.kuketz-blog.de/gnupg-schluesselerstellung-und-smartcard-transfer-nitrokey-teil2/)
- [https://dokuwiki.nausch.org/doku.php/centos:nitrokey:pro](https://dokuwiki.nausch.org/doku.php/centos:nitrokey:pro)
- [https://www.nitrokey.com/documentation/frequently-asked-questions-faq#openpgp-card-not-available](https://www.nitrokey.com/documentation/frequently-asked-questions-faq#openpgp-card-not-available)
- [https://freundederlust.de/doku.php?id=lenovo_thinkpad_t460s#nitrokey](https://freundederlust.de/doku.php?id=lenovo_thinkpad_t460s#nitrokey)
- [https://raymii.org/s/articles/Get_Started_With_The_Nitrokey_HSM.html](https://raymii.org/s/articles/Get_Started_With_The_Nitrokey_HSM.html)
- [https://www.privacy-handbuch.de/handbuch_32r.htm](https://www.privacy-handbuch.de/handbuch_32r.htm)
