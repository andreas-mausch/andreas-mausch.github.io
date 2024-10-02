---
title: "Nitrokey 3C NFC: WebAuthn and OpenPGP"
date: 2024-10-02T19:00:00+02:00
tags: ['nitrokey', 'encryption', 'gpg', 'openpgp', 'privacy', 'security', 'fido2', 'webauthn']
---

Some time has passed since my [last post]({% link-post "2021-02-23-nitrokey" %}) about the Nitrokey.

I do own the newer model Nitrokey 3C NFC and want to share my experience with it,
especially in regards of OpenPGP (which I [use heavily]({% link-post "2023-03-29-gnupg" %}))
and WebAuthn, which I'd like to use more in the future.

# OpenPGP and nitropy

`nitropy` is a utility to control your Nitrokey.

## Install required packages

Check their [official documentation](https://docs.nitrokey.com/nitrokey3/linux/nitropy) please,
but here are some commands which I have used.

```bash
sudo pacman -S python-pynitrokey
sudo wget --directory-prefix=/etc/udev/rules.d/ https://raw.githubusercontent.com/Nitrokey/nitrokey-udev-rules/main/41-nitrokey.rules
```

Reboot afterwards.

## General commands

```bash
nitropy nk3 list
nitropy nk3 status
nitropy nk3 get-config opcard.use_se050_backend
```

## Firmware update

```bash
nitropy nk3 update
# Optional:
nitropy nk3 factory-reset
```

Be careful of course, a factory reset will delete everything on the device.

The current firmware at the time of writing is `1.7.2`.

## Enable the secure element

By default, the secure element is **not** used to store your OpenPGP private key.
Instead, it is stored (unencrypted?) in the flash memory of the controller.

Make sure you use the secure element by doing this:

```bash
nitropy nk3 set-config opcard.use_se050_backend true
```

See [their FAQ](https://docs.nitrokey.com/nitrokey3/faq).

## Generate test secret key and move it to the Nitrokey

```bash
gpg --quick-generate-key "My Name (MyComment) <my@email.com>" rsa4096 cert,sign,auth,encrypt 30d
gpg --list-secret-keys --keyid-format long --with-keygrip --with-subkey-fingerprints

gpg --card-status
gpg --edit-key my@email.com keytocard
```

## Testing a signature

```bash
echo test | gpg --clear-sign --local-user my@email.com
```

You should be prompted to insert the GPG card, if the Nitrokey is not already connected.
Then, you will be prompted to enter the user PIN (default: 123456).
The signature will be printed to the stdout on success.

You won't be able to sign messages without the Nitrokey now.

## Android support via OpenKeychain

[OpenKeychain](https://github.com/open-keychain/open-keychain) is a great app to handle OpenPGP credentials on Android.

Their [list of supported hardware tokens](https://github.com/open-keychain/open-keychain/wiki/Security-Tokens)
does not include my Nitrokey model, and there is an [open issue](https://github.com/open-keychain/open-keychain/issues/2840) for it.

What used to work and does not work any longer is NFC support,
see [here](https://github.com/Nitrokey/nitrokey-3-firmware/issues/270#issuecomment-1568152589):

> NK3A worked with OpenKeychain over NFC on alpha versions 1.3.0 when I tested it in March. I decided to try the same on 1.4.0, and it doesn't connect durin encryption, it says that I removed the token too early, although this is not the case. At the same time, a red light is on on the token.

> The NFC chip gives not enough power for the additional storage and secure element use.

This is really, really sad and it seems like a closed-source Yubikey is your only option if you want to have
OpenPGP via NFC on your Android phone. :(

I can at least use my Nitrokey via NFC on Android for WebAuthn,
which brings us to the next topic.

# WebAuthn and Passkeys

I don't fully understand passkeys yet.
What I do know: WebAuthn Keys stay on a device and are never shared.
I do like that approach.

Passkeys however are synced in the cloud to grant multi-device access.
This made me think.
ChatGPT told me the keys are indeed sent over the internet, but are end-to-end encrypted.
See the [full chat](chatgpt.txt).
I don't even understand why you would encrypt a key with another key. Inception.

I am oldschool in this regard:
No matter how secure that process might be, I don't like the idea to share a private key
over the internet.

## WebAuthn: Resident vs. non-resident (a.k.a Discoverable credentials)

In both cases, the private key stays on the Nitrokey.

Resident keys can be used for username-less authentication.
User details like an ID, username or similar is stored together with a
relying party ID and the whole private key on the Nitrokey and therefore
require storage.
Storage is limited so are the number of resident keys you can store on a device.

Nitrokey does not publish how many keys can be stored.
I don't know a way to list all stored resident keys on a Nitrokey.

> The Nitrokey 3 currently is also restricted to 10 Passkeys
> -- [https://support.nitrokey.com/t/how-many-passkeys-can-be-stored-on-a-nitrokey/5652/2](https://support.nitrokey.com/t/how-many-passkeys-can-be-stored-on-a-nitrokey/5652/2)

For non-resident credentials, you can store an unlimited amount.
They are not persisted, but I guess somehow derived from a single private key on the device.
Not sure about that, though.

## My preference

I prefer non-resident credentials.
They are never shared, you can have unlimited of them on your device.

The only thing you need to be careful about: You should have a second device
or another way to access a service in case the device gets lost or stolen.

## Test WebAuthn

This website is great for testing WebAuthn:
[https://webauthn.io/](https://webauthn.io/).

## WebAuthn and Android

I successfully tested the Nitrokey with NFC and the Firefox browser on the website above.
I just had to change the option *User Verification* to *Discouraged*,
otherwise I would see an error message.

For the more privacy-focused browsers like Mull or Fennec it did not work however,
and for Mull they state [WebAuthn is not supported](https://github.com/Divested-Mobile/Mull-Fenix/issues/89),
because of *Google Play Services and proprietary blobs*.
