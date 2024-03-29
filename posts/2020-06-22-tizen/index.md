---
title: Tizen on Samsung Gear S3
date: 2020-06-22T14:00:00+02:00
tags: ['tizen', 'samsung', 'gear-s3', 'software-development', 'typescript', 'toys']
thumbnail: DSC_3608_.jpg
toc: true
---

I want to share my experience developing a watch face for a Galaxy S3 Gear smartwatch.

{% image "DSC_3608_.jpg" %}

You can find the resulting project here: [https://gitlab.com/andreas-mausch/moonwatch](https://gitlab.com/andreas-mausch/moonwatch)

# Development environment setup

First off, it was difficult to set up a development environment:  
The only Linux Tizen SDK supports is Ubuntu.

So, I don't want to switch to a different operating system just to be able to develop software for my target (Hello, Apple!).

I tried to install Tizen SDK [the unofficial way](https://www.linuxsecrets.com/archlinux-wiki/wiki.archlinux.org/index.php/Tizen_SDK.html). Long story short: Didn't work well.

Tizen SDK requires Java 8 and only Java 8. I had a recent Java installed, and it didn't work (can't remember the error message tho).

Next try: Install Ubuntu in VirtualBox, add Java 8 and install Tizen SDK there.  
Voilà, some progress. Everything installed correctly.

I spent some hours until I found it's possible to develop a watch face via the web tooling. Not sure if I was very blind or the documentation very unclear.
(Actually it is pretty much documented [here](https://docs.tizen.org/application/web/get-started/wearable-watch/first-app-watch/), but that link was hard to be find for me as I started [here](https://developer.samsung.com/galaxy-watch-develop/creating-your-first-app/overview.html)).  
The sample project is really helpful tho.

# Running the app

## Emulator

When I tried to run the sample project for the first time, I had trouble with the emulator.
It just gave me a kernel panic:

<details>
  <summary>Kernel Panic!</summary>
  <pre>
    *** Setting model-config.xml
    [   19.584182] system_info_ini (1250) used greatest stack depth: 6220 bytes left
    Illegal instruction
    Illegal instruction
    - width=360, height=360
    Illegal instruction
    Illegal instruction
    Illegal instruction
    - dpi=301
    /init: /new_root/etc/emulator/prerun.d/set-model-config.sh: line 109: /new_root/usr/bin/system_info_update_db: not found
    /init: /new_root/etc/emulator/prerun.d/set-model-config.sh: line 109: /new_root/usr/bin/system_info_update_db: not found
    [1;34mSwitching root...[0m
    [   20.541447] Kernel panic - not syncing: Attempted to kill init! exitcode=0x00000004
    [   20.541447] 
    [   20.542005] CPU: 2 PID: 1 Comm: systemd Tainted: G S      W       4.4.35 #1
    [   20.542315] Hardware name: QEMU Standard PC (i440FX + PIIX, 1996), BIOS rel-1.10.1-0-g8891697-prebuilt.qemu-project.org 04/01/2014
    [   20.542798]  00000000 00000046 df4c3e20 c120c92a df4d0000 c189c098 df4c3e38 c10d3937
    [   20.543203]  c189c098 df4d0000 c189c098 df4d0000 df4c3e74 c103b4ec c179bca9 00000004
    [   20.543641]  df4d047c df4d0000 00000001 de786738 00000000 df4c3e5c df4c3e60 df4c3e60
    [   20.544032] Call Trace:
    [   20.544173]  [&lt;c120c92a&gt;] dump_stack+0x5d/0x84
    [   20.544370]  [&lt;c10d3937&gt;] panic+0x86/0x1aa
    [   20.544565]  [&lt;c103b4ec&gt;] do_exit+0x436/0x85a
    [   20.544764]  [&lt;c103b978&gt;] do_group_exit+0x37/0x84
    [   20.544970]  [&lt;c1043624&gt;] get_signal+0x4b9/0x507
    [   20.545175]  [&lt;c1002114&gt;] do_signal+0x1e/0x4c7
    [   20.545385]  [&lt;c10027f1&gt;] ? do_trap+0x74/0x7a
    [   20.545571]  [&lt;c10028b5&gt;] ? do_error_trap+0xae/0xb9
    [   20.545781]  [&lt;c1112109&gt;] ? SyS_fstatat64+0x2f/0x34
    [   20.545995]  [&lt;c10011c8&gt;] prepare_exit_to_usermode+0x57/0x92
    [   20.546219]  [&lt;c1002dc7&gt;] ? do_overflow+0x1a/0x1a
    [   20.546403]  [&lt;c1628a4d&gt;] resume_userspace+0xd/0x14
    [   20.546592]  [&lt;c1002dc7&gt;] ? do_overflow+0x1a/0x1a
    [   20.550408] Kernel Offset: disabled
    [   20.550408] ---[ end Kernel panic - not syncing: Attempted to kill init! exitcode=0x00000004
    [   20.550408] 
  </pre>
</details>

After some googling it turned out to be a problem with the hardware acceleration. I couldn't enable it because VirtualBox and KVM...something.  
The [wiki](https://wiki.tizen.org/Emulator#Tizen:Common_on_virtualbox) says:

> As of today VirtualBox does not provide guest addition with support for Wayland and therefore Weston can not run with hardware acceleration. This restriction makes it impossible to run Tizen IVI in VirtualBox at the moment.

## Simulator

There is also a web simulator, which is basically a Google Chrome (which needs to be installed) with some add-on for the tizen runtime.

[However](https://developer.tizen.org/development/tizen-studio/web-tools/using-web-simulator):

> The Web Simulator does not support a wearable circular UI.

For me, even the BasicWatch example didn't work, because the browser console explained `tizen.time.setTimezoneChangeListener` is undefined.
`tizen.time.getCurrentDateTime` is defined however, so I just assume the API is not implemented 100% for watches.

## Real device

Luckily, running the app on the real device worked (after setting up a certificate).
It is not the optimal way to develop, because the turnaround time always takes like ~1min to deploy to a real device, but I can work with that.

One thing I've noticed: I cannot deploy to the real device when I still have the Simulator open. Gna.

## Workaround for development

Because I only have a very simple app and only call two API functions from tizen,
I've decided to mock them for developing purposes.
Then, I can just develop with Google Chrome, which makes the whole development process a lot faster.

See [this file](https://gitlab.com/andreas-mausch/moonwatch/-/blob/70966b3513b68ebdc77a5d21438b9136814e2661/tizen/tizenMock.ts).  
Note: It is only loaded during development mode, so it is not included in the generated production build!

## Tizen4Docker to the rescue?

I found it late, but there is a very nice repo [https://github.com/kamildzi/Tizen4Docker](https://github.com/kamildzi/Tizen4Docker) which makes it possible to run the Tizen IDE (based on Eclipse), the simulator and the emulator with full hardware acceleration on a Linux other than Ubuntu!

Hooray!

This seems to be the best solution in hindsight.

One note: On manjaro I had to do this to get it working:

```bash
sudo pacman -S xorg-xhost
xhost +local:docker
docker-compose --env-file=.env build

# Then, you can execute these commands to run the IDE, the tizen cli tool or the sdb tool
docker-compose run --rm tizen /opt/scripts/runTizenIDE.sh
docker-compose run --rm tizen ~/tizen-studio/tools/ide/bin/tizen
docker-compose run --rm tizen ~/tizen-studio/tools/sdb
```

## Summary

- Linux: Tizen SDK only supports Ubuntu
- Only with JDK 8
- Emulator: Kernel virtualization strictly required
- ..and not working inside VirtualBox
- Simulator: Not showing all options? Doesn't support tizen.time.setTimezoneChangeListener
- *Run in Simulator* and *Run on real device* cannot be done at the same time
- Tizen4Docker is the best tool to run the IDE and the emulator

# Problems with the sample

The sample uses just plain JavaScript with no dependencies.

No npm, no SCSS, no TypeScript, no Babel, no Webpack, ...

[Somebody else noticed that already](https://github.com/LukeDS-it/tizen-web-base) and hopes

> that the Tizen team realizes that advanced js tools exist

I hope that, too!

# CLI commands I use

```bash
sdb connect 192.168.178.25
sdb devices

tizen clean
tizen build-web
tizen cli-config -l
tizen package --type wgt -- ./.buildResult/
tizen install -n ./.buildResult/MoonWatch.wgt
tizen run -p KJAMc748fQ
```

# Modern web technologies

My goal was to use TypeScript, SCSS, npm and webpack as technologies and Visual Studio Code and Google Chrome as development environment.

I've started off with LukeDS' code and adjusted it a bit (to use a more recent webpack etc.).

In the end, I'm very happy with the result and have a good feeling developing apps for Tizen, even tho it was quite a bit of work to get to that point.

# Samsung Certificates

This is a topic on it's own.  
I've written about the process [here](https://gitlab.com/andreas-mausch/moonwatch/-/blob/master/certificates/CreateSamsungCertificate.md)
and I plan to move it to the blog.

For just the commands, I have created [this gist](https://gist.github.com/andreas-mausch/026413d908ba61cda15981bb4fbcd276).
