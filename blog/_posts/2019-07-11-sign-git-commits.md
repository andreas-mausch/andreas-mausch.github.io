---
layout: post
title:  "Sign Git commits"
date:   2019-07-12 16:00:00 +02:00
tags:
---

# Find signingkey
Assuming you already have a GPG key:

```bash
gpg --list-secret-keys --keyid-format LONG
```

Output looks like this:

```
/home/neonew/.gnupg/pubring.kbx
-------------------------------
sec   rsa2048/1234567890123456 2018-09-01 [SC] [verfällt: 2019-09-01]
      21DC32103D5A8C9FE2B26EC69170EACB0809D64B
uid              [ ultimativ ] Andreas Mausch <andreas@test.com>
ssb   rsa2048/12345BEFBD9E7997 2018-09-01 [E] [verfällt: 2019-09-01]

```

In this case, **1234567890123456** would be your signingkey you need to configure in git.

# Configure git user.signingkey

```bash
git config user.signingkey 1234567890123456
```

[https://help.github.com/en/articles/telling-git-about-your-signing-key](https://help.github.com/en/articles/telling-git-about-your-signing-key)

# Sign commits

In order to sign your commits, you can either use the `-S` command option:

```bash
git commit -S -m "My commit msg"
```

Or the method I personally prefer, to tell git to sign all commits automatically:

```bash
git config commit.gpgsign true
```
