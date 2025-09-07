---
title: "OpenPGP: Deterministic Key Derivation via BIP39"
date: 2025-04-18T17:00:00+07:00
tags: ['gpg', 'openpgp', 'kdf']
thumbnail: thumbnail.jpg
---

Some of you might know BIP-39 from Bitcoin.
It is used to generate multiple addresses from a base key,
which is written as normal words.

Thus, it is easy to backup and store.

However, you can apply BIP-39 to represent any bits as a list of words.
This is used by the following tool, which generates a private OpenPGP key for you
based on a word list (also called seed phrase or mnemonic phrase) like:

```
pitch angle zero rubber index domain nature undo engine scrub gate mosquito
```

Actually I found two tools for it:
One [python tool](https://github.com/Logicwax/gpg-hd), which I haven't tried,
and one tool written in Rust:

<https://github.com/jpdarago/bip39key>

# Benefits

Key backup is much easier.

That's basically it, but it is a huge benefit compared to my big A4 prints
of my RSA-2048 keys using [Paperkey](https://www.jabberwocky.com/software/paperkey/).

# Generate a seed phrase

For testing purposes, you can try:
<https://iancoleman.io/bip39/>

For production, you can use the same tool.
Download it [here](https://github.com/iancoleman/bip39/releases) and run it on your computer.

Please note that for production keys I strongly recommend to generate them on an offline machine and protect them by a strong passphrase.

The seed phrase used in this article is just an example and not my actual key. :)

# Generate an OpenPGP key from the seed phrase

```shell-session
$ bip39key --user-id="TestUser <testuser@email.com>" --format=pgp --armor --use-concatenation --authorization-for-sign-key --output-filename=key.pgp
pitch angle zero rubber index domain nature undo engine scrub gate mosquito

$ cat key.pgp
-----BEGIN PGP PRIVATE KEY BLOCK-----
Version: GnuPG v2

xVgESV+rKRYJKwYBBAHaRw8BAQdA0fdM6JaAoITPpTWGnr/
iwaWvZIUJUY1Ezm9fTAifq+4AAP44vavWJmATuhpsVLxu4Z7FlkPLE5BKmd7FYaJ
Et5bzmxH+zR1UZXN0VXNlciA8dGVzdHVzZXJAZW1haWwuY29tPsJ/
BBMWCAAxBQJJX6spCRA+dbZr6H+dYBYhBOXCfCBgRZ21UcXr9T51tmvof51gAhsD
Ah4BAwUAeAAAnS8A/0xKfiZThoxFTopic40T/2B17w8eZ8RE4Y7PDBkl2OioAP49
2ek0iRNYsK/cZ6be1brUHHEbS0L6LX/
uaTzLcS+wDsddBElfqykSCisGAQQBl1UBBQEBB0COnyJnGIk4q+3xVOXcnY9EHyF
ihc03UWb3JxS7fqmbaQMBCAkAAP9eb2CaNUcf3kKNh6u+3sd3P3Dj5lioLpAB5Gj
lkhhxkBEtwnwEGBYIAC4FAklfqykJED51tmvof51gFiEE5cJ8IGBFnbVRxev1PnW
2a+h/nWACGwwDBQB4AABK/AEAljT/
icU2XdKYpiMSP3bXjf6j082K+9SCrQKlGwtKHgoA/
RYGEl4LVEx1Ouc37gqnb/1kFXX461JVICDwrD6V0n8J
=a1bk
-----END PGP PRIVATE KEY BLOCK-----

$ sq inspect key.pgp
key.pgp: Transferable Secret Key.

      Fingerprint: E5C27C2060459DB551C5EBF53E75B66BE87F9D60
  Public-key algo: EdDSA
  Public-key size: 256 bits
       Secret key: Unencrypted
    Creation time: 2009-01-03 18:15:05 UTC
        Key flags: certification, signing

           Subkey: 5CA1B2FDCEE8825C26417BAEFE3E1699CF296CD7
  Public-key algo: ECDH
  Public-key size: 256 bits
       Secret key: Unencrypted
    Creation time: 2009-01-03 18:15:05 UTC
        Key flags: transport encryption, data-at-rest encryption

           UserID: TestUser <testuser@email.com>
```

# Import and use the OpenPGP key

```bash
$ mkdir /tmp/key

$ GNUPGHOME=/tmp/key gpg --import ./key.pgp
gpg: key 4B898A6688554ED6: public key "TestUser <testuser@email.com>" imported
gpg: key 3E75B66BE87F9D60: secret key imported
gpg: Total number processed: 1
gpg:              unchanged: 1
gpg:       secret keys read: 1
gpg:   secret keys imported: 1

$ GNUPGHOME=/tmp/key gpg --list-secret-keys
/tmp/key/pubring.kbx
--------------------
sec   ed25519 2009-01-03 [SC]
      E5C27C2060459DB551C5EBF53E75B66BE87F9D60
uid           [ unknown] TestUser <testuser@email.com>
ssb   cv25519 2009-01-03 [E]

$ echo test | GNUPGHOME=/tmp/key gpg --clear-sign --local-user=TestUser
-----BEGIN PGP SIGNED MESSAGE-----
Hash: SHA512

test
-----BEGIN PGP SIGNATURE-----

iIkEARYKADEWIQTlwnwgYEWdtVHF6/U+dbZr6H+dYAUCaAJ2SxMcdGVzdHVzZXJA
ZW1haWwuY29tAAoJED51tmvof51gAu0A+wYW/lHRxJA1+s3w9euZaufIZ5ovrM3X
/HQHWdT140U7AP9QindnT2tiWRcQzlb5WpIbDtX5Z33p88A+e+k8eFbkCg==
=9XNM
-----END PGP SIGNATURE-----
```

# Some notes

The creation date is set automatically:

> The creation timestamp for the OpenPGP keys is set to the Bitcoin genesis block timestamp (1231006505 in seconds from Unix epoch). GPG considers this part of the key so it is important to keep it consistent. We use that timestamp because it's easy to retrieve, and it's not zero (which can trigger bad corner cases in GPG).

You can override it via `--creation-timestamp`.
I have asked the developer (jpdarago) to add an expiration date, and he responded and implemented the feature within hours:
<https://github.com/jpdarago/bip39key/issues/2>.
You can (optionally) set it via `--expiration-timestamp`.

You can also provide a passphrase either via `--passphrase` or `--pinentry`. I suggest the latter.

> When providing a passphrase, the tool will use it to generate the key together with the seed from the BIP39 mnemonic, and will also encrypt the resulting OpenPGP/OpenSSH keys with the provided passphrase.

I have created two more issues, which are still open:

- [Add missing Key Usage: Authentication](https://github.com/jpdarago/bip39key/issues/1)
- [Split passphrases (BIP39 vs. OpenPGP)](https://github.com/jpdarago/bip39key/issues/3)

As a workaround for the latter, I do this via `sequoia-pgp`:

```bash
bip39key --user-id="TestUser <testuser@email.com>" --format=pgp --armor --authorization-for-sign-key --use-concatenation | sq key password --cert-file - --output - > key.secured.pgp
```
