---
title: "LUKS container encryption"
date: 2025-01-17T19:00:00+01:00
tags: ['encryption', 'security']
thumbnail: luks-encryption.png
---

While looking for a good way to encrypt my private data,
I've tested several options:

- GnuPG: Still my favorite for single files,
  because I can use my main master key without having any additional secrets.
- Tomb and gocryptfs look like a viable options, but requires an additional key
- VeraCrypt I haven't tested yet, but it is very popular
- eCryptfs: I have used it in the past, but due to
  [a limitation in filepath length]({% link-post "2020-08-19-ecryptfs" %})
  I discourage anyone to use it.
- EncFS has several security issues still open for several years now

But now I have tried **LUKS** for container encryption for the first time
and want to share the commands I have used.

# First approach: Using a key file

## Create the key file

We will have a key file and only the key file.
It is encrypted via GnuPG and we won't have any passphrase to protect it.
We assume the GPG-Key is well-protected itself.

In other tutorials on the internet the LUKS key is written in plain text to the filesystem.
We will avoid that here, but rather encrypt it on-the-fly via GPG.

```bash
dd if=/dev/random bs=512 count=8 | gpg --encrypt --sign --recipient 1111111190ABCDEF1234567890ABCDEF11111111 --output ./cryptkey.gpg
```

## Create the encrypted file container

```bash
dd if=/dev/urandom of=./luks-container.img bs=1M count=1024 iflag=fullblock
gpg --decrypt ./cryptkey.gpg | sudo cryptsetup -c aes-xts-plain64 -s 512 -h sha512 -y --key-file=- luksFormat ./luks-container.img
```

`luksAddKey` was not needed, which I like. I have seen it in several other examples in the internet.
In general, you can use it to have multiple passphrases or key files, which all can be used to
decrypt the master key.

Now, mount the container and create the initial filesystem:

```bash
gpg --decrypt ./cryptkey.gpg | sudo cryptsetup --key-file=- open --type=luks ./luks-container.img my_container
sudo mkfs.ext4 /dev/mapper/my_container
sudo mkdir /mnt/luks-container
sudo mount -t ext4 /dev/mapper/my_container /mnt/luks-container/

sudo umount /mnt/luks-container
sudo cryptsetup luksClose my_container
```

## Common usage

The container is now ready to be used.

On some systems, it might be enough to just call `cryptsetup open` and your file manager will offer you an option to mount.
Then, you can skip the mount commands on CLI.

```bash
gpg --decrypt ./cryptkey.gpg | sudo cryptsetup --key-file=- open --type=luks ./luks-container.img my_container
sudo mount -t ext4 /dev/mapper/my_container /mnt/luks-container/
```

```bash
sudo umount /mnt/luks-container
sudo cryptsetup luksClose my_container
```

# Second (and preferred) approach: Using a detached header

LUKS offers an option to not store the header at the beginning of the container file,
but rather in a separate file.
This has the benefit that the container file will just look like random data,
and contains no hints of LUKS being used.

The header contains multiple key slots, and each one contains the master key encrypted
with your key data, which is either a passphrase or a key file.
So, without the header, you won't be able to decrypt the container.

I had some thoughts on it and I'm still not sure whether this is a good idea,
but I like to store the header GPG-encrypted in my [password store](https://www.passwordstore.org/)
and then have an empty passphrase.

That way, only my GPG key is needed to access the container, which I like very much.
However, mosts sites discourage having an empty passphrase.
I think it's not that relevant here, when your master key inside the header is encrypted via GPG.

Here are the commands I have used with this approach:

```bash
dd if=/dev/urandom of=./luks-container-without-header.img bs=1M count=1024 iflag=fullblock
# Use empty passphrase on `luksFormat`.
# We will store the detached header in a secure place instead.
sudo cryptsetup luksFormat ./luks-container-without-header.img --header=detached-header.bin
echo '' | sudo cryptsetup open --type=luks ./luks-container-without-header.img my_container --header=detached-header.bin
sudo mkfs.ext4 /dev/mapper/my_container
sudo mkdir /mnt/luks-container
sudo mount -t ext4 /dev/mapper/my_container /mnt/luks-container/

sudo umount /mnt/luks-container
sudo cryptsetup luksClose my_container
```

Some debugging commands:

```bash
sudo cryptsetup luksDump ./detached-header.bin
sudo dmsetup ls --target crypt
sudo dmsetup info -C
```

The default detached header file size was 16 MB in my case.
You can reduce it by using these options on `luksFormat`:

```bash
sudo cryptsetup luksFormat --type luks2 --luks2-metadata-size=16k --luks2-keyslots-size=256k ./luks-container-without-header.img --header=detached-header.bin
```

Please note this will reduce the number of keyslots to just one,
so you won't be able to add addtional keyslots afterwards.

You can also set the option `--align-payload` to `0` or `1`,
but I am not sure if this has any effect when you use detached headers.

# Provide a volume master key?

There also seems to be a way to directly provide a volume master key with the flag `--volume-key-file`.
By default, LUKS generates a master key for you and then encrypts it with your passphrase.

But in case you don't trust how that master key is generated, you might want to provide your own.
I haven't tested this, though.

# Mount via fstab?

I'd love to have integration into my file manager, Thunar, so I would
only need to click on an icon to decrypt the container and show the files,
without the need to struggle with CLI commands.

However, my try was **not successful**.

I couldn't manage to mount the container file via `/etc/fstab` and `/etc/crypttab`,
because the crypttab file requires an entry like this:

```{data-filename=/etc/crypttab}
my_container_fstab /opt/luks-container.img header=/opt/detached-header.bin luks
```

So the header is expected as a file, but in my dream it would be stored in `pass`.
But then we would need to call a command in cryptsetup, rather than passing a file, and that, unfortunately, is not offered by `cryptsetup open`.

# Links

- <https://www.privacy-handbuch.de/handbuch_37h3.htm>
- <https://wiki.archlinux.org/title/Dm-crypt/Encrypting_a_non-root_file_system#File_container>
- <https://wiki.ubuntuusers.de/LUKS/Containerdatei/>
- <https://cryptsetup-team.pages.debian.net/cryptsetup/README.gnupg.html>
- <https://cryptsetup-team.pages.debian.net/cryptsetup/README.gnupg-sc.html>
