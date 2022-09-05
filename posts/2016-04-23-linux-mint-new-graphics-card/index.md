---
title: "Linux Mint: Login loop after new graphics card"
date: 2016-04-23T04:00:00+02:00
tags: ['linux', 'login loop', 'bug']
---
I am a big fan of Linux and open-source in general. Despite the big improvements
on usability there are still too many moments where you need to use the terminal.

Well, I am a developer and used to the terminal. However, this week I have
experienced a problem which cost me some hours.

I have changed my graphics card from ATI to Nvidia. My PC recognized the new card,
it reset the BIOS and my Windows partition booted up. It required new drivers
which was fine.

When I tried to boot my Linux partition, I faced a black screen. After uninstalling
the ATI drivers and installing the proprietary Nvidia drivers in recovery mode
on command line I got to the login screen.

```bash
sudo apt-get purge "fglrx.*"
sudo apt-get install --reinstall xserver-xorg-core libgl1-mesa-glx:i386 libgl1-mesa-dri:i386 libgl1-mesa-glx:amd64 libgl1-mesa-dri:amd64

sudo add-apt-repository ppa:graphics-drivers/ppa
sudo apt-get update
sudo apt-get install nvidia-364 nvidia-settings
```

But after I entered my credentials the screen went black for two seconds and
I was on the login screen again. A login loop.
I tried a lot, reinstalled Xorg lots of times, tried different packages but
nothing worked.

After some googling I found other users experienced this as well. But the common
solution for the login loop on Linux Mint is to fix file permissions on .Xauthority.
My file permissions where fine though.

After a lot of more googling I found this helpful post, which suggested to reinstall
some cinnamon packages. It worked for me, I must have broken them accidentally
during my Xorg experiments. Thank you very much, Marco77!

[http://www.linuxmintusers.de/index.php?topic=27767.0](http://www.linuxmintusers.de/index.php?topic=27767.0)

```bash
sudo apt-get install cinnamon mint-meta-cinnamon nemo
```
