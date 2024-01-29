---
title: "GnuPG for everything"
date: 2023-03-29T19:00:00+02:00
tags: ['gpg', 'openpgp', 'keyserver', 'tpm', 'pass', 'ssh', 'security', 'signing', 'encryption']
toc: true
thumbnail: gnupg.jpg
---

{% image "gnupg.jpg" %}

When I work with Git, I use SSH keys for authentication with GitHub, GitLab etc.
Same goes for SSH connections for terminal connections to servers.

When I want to sign or encrypt my e-mails, I use GPG.
I also use GPG indirectly when using [pass - The Standard Unix Password Manager](https://www.passwordstore.org/).
And you need GPG if you want to publish a package to Maven Central, for example.
You can also use GPG to sign your git commits.

I barely used GPG in the past, but since I heard you can use the GPG key also for SSH connections,
I thought that this would be a big improvement for me.
I would only have to handle the single GPG key instead of having GPG and SSH simultaneously.

I have also used a Nitrokey in [the past]({% link-post "2021-02-23-nitrokey" %}), which can be used as a GPG smartcard.
That means your keys wouldn't be stored on your computer, but inaccessible on a secure device. Nice.
Modern computers also have a secure chip built-in, which works similar to a Nitrokey: TPM.

I tried to put this all together to end up with a GPG key stored in the TPM which I can use for:

- Sign and encrypt files
- Sign e-mails
- SSH terminal connections
- Git authentication (GitHub, GitLab)
- Passwords (via pass)

# Setup keys

## Install gpg

The default [gpg package](https://archlinux.org/packages/core/x86_64/gnupg/) in Manjaro/Arch is still 2.2.41, which is the latest LTS version.
However, you need at least 2.3 to work with TPM 2.0. The latest version (as of today) is 2.4.0 released on 2022-12-16.

> The current stable branch is the 2.2 series, so that's what Arch packages.
> The 2.3 series is currently a testing branch for what will become the next stable release, 2.4.
> Actually above statement on which version is stable is  incorrect according to Wener Koch of gnupg:
> 2.3 is in fact the stable branch and latest release is 2.3.4 [1]
> 2.2 is the older long term stable branch with current version 2.2.34 [2]
> -- https://bbs.archlinux.org/viewtopic.php?id=269394

In AUR I couldn't find a 2.4 though. There is a [gnupg-git](https://aur.archlinux.org/packages/gnupg-git) which just points to the latest master.
And there is [gnupg23](https://aur.archlinux.org/packages/gnupg23), which is not the latest, but at least an officially released version and the version
just before 2.4.0. I decided to use it.

**Edit**: And just as I write this, there was a new package: [gnupg24](https://aur.archlinux.org/packages/gnupg24).
Thank you, ImperatorStorm.

```bash
paru -S gnupg24
```

It will warn you that..

> :: gnupg24 and gnupg are in conflict. Remove gnupg? [y/N]

but you can just proceed with yes.

```shell-session
$ gpg --version
gpg (GnuPG) 2.4.0
libgcrypt 1.10.1-unknown
Copyright (C) 2021 Free Software Foundation, Inc.
License GNU GPL-3.0-or-later <https://gnu.org/licenses/gpl.html>
This is free software: you are free to change and redistribute it.
There is NO WARRANTY, to the extent permitted by law.

Home: /home/neonew/.gnupg
Supported algorithms:
Pubkey: RSA, ELG, DSA, ECDH, ECDSA, EDDSA
Cipher: IDEA, 3DES, CAST5, BLOWFISH, AES, AES192, AES256, TWOFISH,
        CAMELLIA128, CAMELLIA192, CAMELLIA256
Hash: SHA1, RIPEMD160, SHA256, SHA384, SHA512, SHA224
Compression: Uncompressed, ZIP, ZLIB, BZIP2
```

## Generate primary key

We will generate one key for each usage flag of GPG.
Usage flags are: cert, encrypt, sign and auth.

Our primary key will only have the cert flag, and we will have one subkey for each other flag.

You can of course decide you want to do this differently, like having just one primary key with all the flags and no subkeys to have a simpler process.

### Using a config file

I recommend to use the method below, but for completeness, here is an alternative:

```{data-filename=key.config}
%echo Generating a OpenPGP key
%echo https://www.gnupg.org/documentation/manuals/gnupg/Unattended-GPG-key-generation.html
Key-Type: RSA
Key-Length: 4096
# Allowed values are ‘encrypt’, ‘sign’, and ‘auth’.
Key-Usage: cert
Subkey-Type: RSA
Subkey-Length: 2048
Name-Real: My Name
Name-Comment: MyComment
Name-Email: my@email.com
Expire-Date: 0
# Passphrase: <not used, passed via stdin>
# Do a commit here, so that we can later print "done" :-)
%commit
%echo done
```

```bash
gpg --batch --generate-key key.config
```

### Using quick-generate-key (recommended)

You can also use `gpg --gen-key` or `gpg --full-generate-key`, but they require more interactive input, that's
why I like `gpg --quick-generate-key` best.

```bash
gpg --quick-generate-key "My Name (MyComment) <my@email.com>" rsa4096 cert 1y
```

### Revocation key

You should also generate a revocation key now, in case you forget your password or your key is compromised.
Use the long key id as argument for `gen-revoke`.

```bash
gpg --list-secret-keys --keyid-format long --with-keygrip --with-subkey-fingerprints
gpg --output primary.revoke.asc --gen-revoke 1111111190ABCDEF1234567890ABCDEF11111111
```

Revoke certificate generation is not possible in batch mode. :/

### Add photo

> “Keeping the image close to 240×288 is a good size to use”. Further, there is a warning displayed if the image is above 6144 bytes saying that “This JPEG is really large”.
> -- [Creating a small JPEG photo for your OpenPGP key](https://blog.josefsson.org/2014/06/19/creating-a-small-jpeg-photo-for-your-openpgp-key/)

This is the command I used to generate my small photo, which is just under 6.144 bytes.

```bash
magick convert -auto-orient -strip -gaussian-blur 0.05 -gravity center -crop 240:288 +repage -resize "240x288" -sampling-factor 4:2:0 -interlace JPEG -colorspace YUV -quality 52 input.jpg gpg.jpg
```

Verify the sampling factor via `identify`:

```bash
identify -format "%[jpeg:sampling-factor]" gpg.jpg
```

| Sampling Factor | identity output |
|-----------------|-----------------|
| 4:2:0           | 2x2,1x1,1x1     |
| 4:2:2H          | 2x1,1x1,1x1     |
| 4:2:2V          | 1x2,1x1,1x1     |
| 4:4:4           | 1x1,1x1,1x1     |

See here: [How to find out the chroma subsampling of a jpg?](https://www.reddit.com/r/GIMP/comments/31w0j2/how_to_find_out_the_chroma_subsampling_of_a_jpg/).
In my case, the output was just `2x2`.

If you are happy with the result, add the jpg to your key via:

```bash
gpg --edit-key 1111111190ABCDEF1234567890ABCDEF11111111 addphoto save
```

Here is my photo, a 6.109 bytes file:

{% image "me.jpg" %}

## Generate Subkeys

```bash
gpg --batch --quick-add-key 1111111190ABCDEF1234567890ABCDEF11111111 rsa2048 sign 1y
gpg --batch --quick-add-key 1111111190ABCDEF1234567890ABCDEF11111111 rsa2048 encrypt 1y
gpg --batch --quick-add-key 1111111190ABCDEF1234567890ABCDEF11111111 rsa2048 auth 1y
```

## Backup all your keys

This is very important. In the following steps, we are going to delete all keys from GPG,
so you need to have a backup of your keys!

Please be aware you should take precautions during this step to make sure your keys don't get stolen.
For example disable network connections, bluetooth etc. and use a strong password.

### Reset password (optional)

I case you do not want to use a strong password (for example when you fear you might forget it)
and can make sure nobody gets access to the plain key files, you can reset your password from your key like this:

```bash
gpg --change-passphrase 1111111190ABCDEF1234567890ABCDEF11111111
```

### Backup to file

```bash
gpg --output primary-with-subkeys.public.asc --armor --export 1111111190ABCDEF1234567890ABCDEF11111111
gpg --output primary-with-subkeys.secret.asc --armor --export-secret-keys --export-options export-backup 1111111190ABCDEF1234567890ABCDEF11111111
gpg --output subkeys-only.secret.asc --armor --export-secret-subkeys --export-options export-backup 1111111190ABCDEF1234567890ABCDEF11111111

# Validate:
gpg --show-keys primary-with-subkeys.public.asc
gpg --list-packets primary-with-subkeys.public.asc
pgpdump primary-with-subkeys.public.asc
```

> Subkeys are bound to the primary key and exported together with it when calling gpg --export or gpg --send-keys. Same applies to signatures and user ID packages.
> -- [One public key contains all subkeys?](https://security.stackexchange.com/questions/51474/one-public-key-contains-all-subkeys)

Please note that the exported files will still be password protected by the same password as the original key.

## Delete private key

Please, make sure you have a working backup before executing this.

```bash
gpg --delete-secret-keys 1111111190ABCDEF1234567890ABCDEF11111111

# Validate:
gpg --list-secret-keys --keyid-format long --with-keygrip --with-subkey-fingerprints

# To delete a sub-key only, you need the exclamation mark!
# gpg --delete-secret-keys 5555ABCDEFAB5555!
```

## Re-Import the Sub-Keys only

We want to put the primary key backup in a secure place and only leave the sub-keys on our system for everyday use.

```bash
gpg --import subkeys-only.secret.asc

# Validate:
gpg --list-secret-keys --keyid-format long --with-keygrip --with-subkey-fingerprints
```

Not the hash sign (#) after the primary key, which indicates it is not stored on the disk.

## Trust the key

In order to sign and encrypt, we need to trust this key.
Just set the trust level to *ultimate (5)*.

```bash
gpg --edit-key 1111111190ABCDEF1234567890ABCDEF11111111 trust quit
```

## Optional: Publish key to keyserver

If you like, you can share your public key to others by uploading it on a keyserver, like [keyserver.ubuntu.com](https://keyserver.ubuntu.com)

```bash
gpg --send-keys 1111111190ABCDEF1234567890ABCDEF11111111
```

See my published key [here](https://keyserver.ubuntu.com/pks/lookup?search=6FB79D6D075A268571DE9E42C2C14B464D7B72E9&fingerprint=on&op=index):

{% image "keyserver-ubuntu.png" %}

[Download]({{ "andreas-mausch.public.asc" | relativeFile | url }})

# Key ID: Short vs. Long vs. Keygrip vs. Fingerprint

| Type         | Value                                              |
|--------------|---------------------------------------------------:|
| Fingerprint  | 7196 E081 94D5 3FCB FD15  D960 FA6C 71F9 A73D BE0B |
| Long Key ID  |                                FA6C 71F9 A73D BE0B |
| Short Key ID |                                          A73D BE0B |
| Keygrip      | 69B7 D1FB F6F4 8ACA 5453  1CB7 7108 8109 C081 C081 |

> Neither of these [long and short ID] should be used for key identification nowadays — it is possible to create keys with matching key ids (and this has been demonstrated with short key ids).
> -- [https://unix.stackexchange.com/questions/576933/what-are-the-keyid-and-finguerprint-of-a-public-key-in-gpg-and-apt-key](https://unix.stackexchange.com/questions/576933/what-are-the-keyid-and-finguerprint-of-a-public-key-in-gpg-and-apt-key)

-> **Always use the fingerprint for the Key ID**

What is the Keygrip then?

> So a keygrip is protocol agnostic, that means no information coming from GnuPG (e.g. the packet version) nor SSH (e.g. the typename) is used to build them. Only information coming from the key algorithm is used.
> -- [https://blog.djoproject.net/2020/05/03/main-differences-between-a-gnupg-fingerprint-a-ssh-fingerprint-and-a-keygrip/](https://blog.djoproject.net/2020/05/03/main-differences-between-a-gnupg-fingerprint-a-ssh-fingerprint-and-a-keygrip/)

Also, the keygrip has the same length as a fingerprint:

```
7196E08194D53FCBFD15D960FA6C71F9A73DBE0B
69B7D1FBF6F48ACA54531CB771088109C081C081
```

Pff...confuse me more.
gpg cli in my opinion should never display the short and long key ids if they are not to be trusted.
`--with-subkey-fingerprints` should be the default.
And gpg should put a prefix/name if it outputs a (seemingly) random number to the user. But well.

# Thoughts on multiple identities

I would love to only use a single identity for all purposes, because I am a single person.

However, I do use a separate GPG key for personal and business usages.
I might even split up my personal keys further, depending on how secret something should really be.

The reason is (as someone on the internet pointed out): You need to expose your whole social network with GPG.
You need to connect all your personal and business e-mail addresses to your UIDs, if you decide to use a single key.
You cannot keep like a single e-mail-address private or disconnect it. It would need to be a UID in a different key then.

It is by design.

I would like to see a combined key which expresses "I am Andreas and I am using my personal laptop", which is pretty much
the same as *please confirm your new device* messages from various services.
My identity would still be *Andreas*, but I'd need a second secret to get access to some service.
I'm not sure whether this is possible with GPG.

# Thoughts on pinentry

I dislike you cannot see which process asked for the key when doing a decryption or signing.
pinentry just pops ups and asks for a your passphrase.

The user cannot see which process (maybe with PID and icon) wants to use the key for what reason.

# Use TPM 2.0

See [this guide](https://gnupg.org/blog/20210315-using-tpm-with-gnupg-2.3.html) from the official gnupg.org page.

Important: TPM only supports a specific set of algorithms for encryption and hashing.
Make sure you use algorithms supported by your hardware.

TPM 2.0 gurantees RSA-2048 and SHA-256 will work.

Make sure to add yourself to the *tss* group:

```bash
sudo pacman -S tpm2-tools
sudo usermod -aG tss $USER
```

One thing I'd like to see is TPM with a smartcard interface.
I can't understand why there need to be `keytocard` and `keytotpm` commands, when they are essentially doing the same thing.
I do understand TPM is different from a smartcard and maybe offers more features, but it just would be nice to support the smartcard interface.
On Windows for example, there is a thing like a [TPM virtual smart card](https://learn.microsoft.com/en-us/windows/security/identity-protection/virtual-smart-cards/virtual-smart-card-overview).
That's what I mean, but it should be part of TPM, in my opinion.

Regarding the trustworthiness of TPM: I can't really tell, and there might be backdoors.
I just like the concept that the private key is never accessible in the RAM of the computer.
That's the main reason I prefer it over password-protected keys (without TPM), even though the latter might be more trustworthy.

## Move subkeys

```bash
gpg --edit-key 1111111190ABCDEF1234567890ABCDEF11111111 "key 5555ABCDEFAB5555" keytotpm quit
gpg --edit-key 1111111190ABCDEF1234567890ABCDEF11111111 "key 6666ABCDEFAB6666" keytotpm quit
gpg --edit-key 1111111190ABCDEF1234567890ABCDEF11111111 "key 7777725CD5447777" keytotpm quit
```

You need to enter the original password of your gpg key and then you can choose the same (or different) password used by the TPM.
Note the `>` signs after ssb in the `gpg --list-secret-keys` output, which tells the key is now stored inside the TPM and cannot be accessed directly anymore.

## Test signing

Make sure the subkey still works:

```bash
echo Test > test.txt
gpg --clear-sign --local-user my@email.com --output test.txt.asc test.txt
cat test.txt.asc
rm test.txt test.txt.asc
```

You are now asked to enter the TPM password.

## Troubleshooting SHA-512

I had a problem connecting to my server via SSH after I moved the keys to the TPM.

It took me some time to find the reason: SSH tried to do the signature with SHA-512, which is not supported by my TPM.

```shell-session
$ ssh -vvvv nuc@nuc
debug1: Server accepts key: (none) RSA SHA256:++3tZOdzV9LhXrOHIkn8Cvfm4OknxQ8UYT7vjg7PQDw agent
debug3: sign_and_send_pubkey: using publickey with RSA SHA256:++3tZOdzV9LhXrOHIkn8Cvfm4OknxQ8UYT7vjg7PQDw
debug3: sign_and_send_pubkey: signing using rsa-sha2-512 SHA256:++3tZOdzV9LhXrOHIkn8Cvfm4OknxQ8UYT7vjg7PQDw
sign_and_send_pubkey: signing failed for RSA "(none)" from agent: agent refused operation

$ systemctl --user status gpg-agent
● gpg-agent.service - GnuPG cryptographic agent and passphrase cache
     Loaded: loaded (/usr/lib/systemd/user/gpg-agent.service; static)
     Active: active (running) since Tue 2023-03-28 23:39:17 CEST; 33min ago
TriggeredBy: ● gpg-agent-extra.socket
             ● gpg-agent-ssh.socket
             ● gpg-agent-browser.socket
             ● gpg-agent.socket
       Docs: man:gpg-agent(1)
   Main PID: 1316 (gpg-agent)
      Tasks: 8 (limit: 38083)
     Memory: 16.6M
        CPU: 6.257s
     CGroup: /user.slice/user-1000.slice/user@1000.service/app.slice/gpg-agent.service
             ├─1316 /usr/bin/gpg-agent --supervised
             ├─3031 scdaemon --multi-server
             └─3034 tpm2daemon --multi-server

Mär 29 00:12:57 andreas-peac gpg-agent[3034]: ERROR:esys:src/tss2-esys/esys_iutil.c:394:iesys_handle_to_tpm_handle() Error: Esys invalid ESAPI handle (ff).
Mär 29 00:12:57 andreas-peac gpg-agent[3034]: ERROR:esys:src/tss2-esys/esys_iutil.c:1105:esys_GetResourceObject() Unknown ESYS handle. ErrorCode (0x0007000b)
Mär 29 00:12:57 andreas-peac gpg-agent[3034]: ERROR:esys:src/tss2-esys/esys_tr.c:522:Esys_TRSess_SetAttributes() Object not found ErrorCode (0x0007000b)
Mär 29 00:12:57 andreas-peac gpg-agent[3034]: tpm2daemon[3034]: DBG: asking for PIN 'TPM Key Passphrase'
Mär 29 00:12:58 andreas-peac gpg-agent[3034]: WARNING:esys:src/tss2-esys/api/Esys_Sign.c:311:Esys_Sign_Finish() Received TPM Error
Mär 29 00:12:58 andreas-peac gpg-agent[3034]: ERROR:esys:src/tss2-esys/api/Esys_Sign.c:105:Esys_Sign() Esys Finish ErrorCode (0x000001d5)
Mär 29 00:12:58 andreas-peac gpg-agent[3034]: TPM2_Sign failed with 469
Mär 29 00:12:58 andreas-peac gpg-agent[3034]: tpm:parameter(1):structure is the wrong size
Mär 29 00:12:58 andreas-peac gpg-agent[1316]: smartcard signing failed: Kartenfehler
Mär 29 00:12:58 andreas-peac gpg-agent[1316]: ssh sign request failed: Kartenfehler <Quelle nicht angegeben>
```

The important bits here are `TPM2_Sign failed with 469` and `structure is the wrong size`.
See here: [lists.archive.carbon60.com/gnupg/devel/91138](https://lists.archive.carbon60.com/gnupg/devel/91138)

Depending on the sshd_config, you might need to specify the algorithm.
SHA-512 is not compatible with TPM2.0, so you might try this:

```bash
ssh -vvvv -o PubkeyAcceptedKeyTypes=rsa-sha2-256 nuc@nuc
```

Or, alternatively you can set this option for all connections (you might need to append the file):

```{data-filename=~/.ssh/config}
Host *
  PubkeyAcceptedKeyTypes rsa-sha2-256
```

## Use tpm2 from command line

To use TPM without GPG you can run [this example](https://github.com/salrashid123/tpm2/tree/master/tpm_import_external_rsa):

```bash
openssl genrsa -out private.pem 2048
openssl rsa -in private.pem -outform PEM -pubout -out public.pem
tpm2_createprimary -C e -c primary.ctx
tpm2_import -C primary.ctx -G rsa -i private.pem -u key.pub -r key.priv
rm private.pem

echo "This is the secret" > test.txt
openssl pkeyutl -encrypt -pubin -inkey public.pem -in test.txt -out test.txt.enc

tpm2_load -C primary.ctx -u key.pub -r key.priv -c key.ctx
tpm2_rsadecrypt -c key.ctx -o test.decrypted.txt test.txt.enc
cat test.decrypted.txt
rm test.txt test.txt.enc test.decrypted.txt public.pem primary.ctx key.pub key.priv
```

# gpg-agent log

```bash
systemctl --user status gpg-agent
```

# SSH via GPG

GPG Key with usage flag *Authentication* is needed.

Here is my setup for `gpg-agent` and the `fish` shell.

```bash
echo enable-ssh-support >> ~/.gnupg/gpg-agent.conf
echo <SSH-SUBKEY-KEYGRIP> >> ~/.gnupg/sshcontrol
gpg --export-ssh-key 1111111190ABCDEF1234567890ABCDEF11111111
```

```{data-filename=~/.config/fish/conf.d/gpg-ssh.fish}
set --erase SSH_AGENT_PID
set --erase SSH_AUTH_SOCK
set --universal --export SSH_AUTH_SOCK (gpgconf --list-dirs agent-ssh-socket)
set --export GPG_TTY (tty)
gpg-connect-agent updatestartuptty /bye >/dev/null
```

# pass

pass automatically works with GPG, so all you need to do is set up the right key:

```bash
pass init [-p subfolder] 1111111190ABCDEF1234567890ABCDEF11111111
```

## PassFF for Firefox

To automatically fill passwords in your browser, use this sweet extension:
[github.com/passff/passff](https://github.com/passff/passff)

Unfortunately, it requires a host service to run on your machine.
It works well, though.

I prefer it over [github.com/browserpass/browserpass-extension](https://github.com/browserpass/browserpass-extension),
because it doesn't require your filename to match the URL of a service.
I prefer to have a paypal.gpg rather than a paypal.com.gpg.

Reason: I have an account for a service, not a domain.
Domains might change, and to support multiple domains, you
[need hacks](https://github.com/browserpass/browserpass-extension#how-to-use-the-same-username-and-password-pair-on-multiple-domains).

This specific problem is [not solved](https://github.com/passff/passff/issues/466) for passff either,
but I like the approach to specify the URL inside the data just better.

Make sure to enable the configuration option `Index URL fields on startup`.

Installation and example usage of passff:

```bash
sudo pacman -S passff-host firefox-extension-passff
```

```shell-session
$ pass insert -m someservice
Enter contents of someservice and press Ctrl+D when finished:

my-secret-password
login: my@email.com
url: someservice.com
[master 6e0d7a4] Add given password for someservice to store.
 1 file changed, 2 insertions(+)
 create mode 100644 someservice.gpg
```

## pass-otp

There is also the neat [pass-otp](https://archlinux.org/packages/community/any/pass-otp/) extension for pass, which can generate your 2FA numbers.
However, I prefer to keep a real second factor with my Android phone and [Aegis](https://github.com/beemdevelopment/Aegis).
I dislike the idea of having all secrets on the same device for a reason.

# git: Sign commits SSH vs. GPG

Since 2021 it is also possible to use SSH (and not just GPG) to sign commits.

I like GPG better though: It can contain your uid (or multiple), a photo, sharing via keyservers is easier..

Also, I'm not sure if common other tools like Thunderbird support signing via SSH key, so I want to have a GPG key anyway.

# E-Mails

I'd love to use OpenPGP signing with Thunderbird.
I don't really care about encryption here, but signing would be nice.

However, I wasn't able to connect Thunderbird to my GPG-managed TPM key.

Previous to Thunderbird 78 there was a plugin named Enigmail, which worked great in combination with GnuPG.
Since then, Thunderbird decided to not use GnuPG any longer "to avoid licensing issues" [source](https://support.mozilla.org/en-US/kb/openpgp-thunderbird-howto-and-faq#w_does-openpgp-in-thunderbird-78-look-and-work-exactly-like-enigmail).

They chose to integrate OpenPGP directly into the program (so no additional plugin needed -> yay),
but their library RNP does not support SmartCards at all, and also no TPM (boo!).
To me it is not understandable how you strip an important feature like that from a working extension
without replacement.

Sooo....Thunderbird added a hidden feature *allow_external_gnupg* which uses the GPGME library to access the GnuPG keys.
See their [guide here](https://wiki.mozilla.org/Thunderbird:OpenPGP:Smartcards).

I tried to use it and failed, and in general it seemed not user-friendly to me yet.
Duplicating the public keys in another keychain is bad enough, you can only configure one Key-ID, there is no check the Key-ID you enter is valid
and the error message I got when signing a message was only visible in the Error Console.

It complained that `GPGME.allDependenciesLoaded()` returned false, however I had the `gpgme` package installed on my machine.

```shell-session
$ ls -lah /usr/lib/libgpgme.so
lrwxrwxrwx 1 root root 19 20. Mär 14:58 /usr/lib/libgpgme.so -> libgpgme.so.11.28.0*

$ gpgme-tool
OK GPGME-Tool 1.19.0 ready
KEYLIST
D <?xml version="1.0" encoding="UTF-8" standalone="yes"?>%0A
D <gpgme>%0A
D   <keylist>%0A
D     <key>%0A
D       <revoked value="0x0" />%0A
D       <expired value="0x0" />%0A
```

Maybe in an incompatible version, because I have updated gpg manually..? I don't know, and I didn't investigate further.

Update: After restarting my system and re-configuring the GPG key in Thunderbird I got it working.
I needed to use the Long Key ID.
I use multiple e-mail addresses, so I had to make sure to configure the right one (via *Manage identities...*):

{% image "thunderbird-settings.png" %}

# Chat

XMPP supports an experimental [extension](https://xmpp.org/extensions/xep-0373.html) for OpenPGP support.

I've tried to use it with the Gajim client, which did not work well.

The [OpenPGP plugin](https://dev.gajim.org/gajim/gajim-plugins/-/tree/master/openpgp)
for Gajim tries to create a new key and fails.
I wasn't able to re-use my existing key.

{% image "gajim-openpgp-wizard-error.png" %}

I did install `sudo pacman -S python-gpgme` beforehand and I was able to call gpgme in the python interpreter successfully
(`gpg.Context().create_key('myname')`), so I don't know what went wrong here.

# Links

- [https://wxcafe.net/posts/yubikey_for_everything/](https://wxcafe.net/posts/yubikey_for_everything/) (Post title was inspired by this)
- [https://mikeross.xyz/create-gpg-key-pair-with-subkeys/](https://mikeross.xyz/create-gpg-key-pair-with-subkeys/)
- [https://wiki.archlinux.org/title/GnuPG#SSH_agent](https://wiki.archlinux.org/title/GnuPG#SSH_agent)
- [https://gist.github.com/mcattarinussi/834fc4b641ff4572018d0c665e5a94d3](https://gist.github.com/mcattarinussi/834fc4b641ff4572018d0c665e5a94d3)
- [https://opensource.com/article/19/4/gpg-subkeys-ssh](https://opensource.com/article/19/4/gpg-subkeys-ssh)
- [https://www.foxk.it/blog/gpg-ssh-agent-fish/](https://www.foxk.it/blog/gpg-ssh-agent-fish/)
