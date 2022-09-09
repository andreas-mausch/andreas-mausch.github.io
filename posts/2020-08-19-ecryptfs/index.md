---
title: Unable to login after uninstalling eCryptFS
date: 2020-08-19T18:00:00+02:00
tags: ['ecryptfs', 'linux']
thumbnail: unable-to-login.jpg
---

{% image "unable-to-login.jpg" %}

# The setup

I've used eCryptFS for the several past years to secure the data in my home directory.

However it comes with a big limitation: Filenames cannot be longer than 144 chars (plus minus).
So this will fail on an eCryptFS'd directory:

```bash
touch xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx
```

The limitation only applies to single filenames. The path in total can be longer than 144 chars.

Most of the times you won't have such long single filenames. However, for my new job I tried to clone a repo which contained long filenames.
I wasn't able to clone it because of eCryptFS. :(

# Uninstall eCryptFS

So I've decided to ditch it, since the files which required special security aren't on that drive anymore anyway.

I've found a good [step-by-step tutorial](https://askubuntu.com/questions/4950/how-to-stop-using-built-in-home-directory-encryption) how to get rid of eCryptFS, however..

**PAM**

When I've installed eCryptFS, I've also changed the configuration of the *The Pluggable Authentication Modules* according to the [Arch wiki](https://wiki.archlinux.org/index.php/ECryptfs#Auto-mounting).
But I forgot about it, and didn't revert the changes on uninstallation.

As a consequence, I've uninstalled everything regarding eCryptFS, but my PAM config still pointed to it.

# The lock-out

This resulted in a lock-out of my own system.

I couldn't login anymore.  
Not even as *root*.

Fortunately I've already decryted all my data before.

My only choice to get the system running again was to use a Manjaro USB Boot.  
I've then reverted the changes in */etc/pam.d/system-auth* and I was able to login again. Phew.

# Alternative to eCryptFS

Today I would try LUKS, which is also suggested by the official Manjaro installer.
It's full disk encryption vs. just your home folder.
The setup seems to be easier and more user-friendly.
And also, it doesn't have a limitation on the filename length.
