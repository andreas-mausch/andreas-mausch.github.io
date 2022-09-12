---
title: "makemkv: Backup Blu-ray discs"
date: 2022-03-14T19:00:00+01:00
tags: ['video', 'firmware flashing', 'blu-ray']
---

I still like to use Blu-ray discs to watch movies.

Sometimes I want to watch them over the network though, and therefore I need to rip them from disc to put them on a hard-drive.

I stumbled across [makemkv](https://www.makemkv.com/) and a Docker image [on github](https://github.com/jlesage/docker-makemkv).

Since I prefer CLI usage over GUI, I also looked up [this Docker image](https://github.com/lasley/docker-makemkvcon),
which provides only the CLI part named `makemkvcon`.

# Installation

First thing I noticed: I need a license key.
Luckily, [it is freely available](https://forum.makemkv.com/forum/viewtopic.php?t=1053) while the software is still beta.

Next thing: I need to pass the device to the software.
For some reason, you need to pass two devices: */dev/sr0* and */dev/sg0* (on my machine, your numbers might be different).
And I had the */dev/sr0*, but */dev/sg0* was missing.

After some googling, I found that `sudo modprobe sg` solved it, and the device appeared.
To have the module loaded at every boot, you can also do this:

```bash
echo sg > /etc/modules-load.d/sg.conf
```

# Disable Auto-Update, settings.conf

There is a file settings.conf with various settings, but barely documented.

The software greets me with this message:

```
Automatic checking for updates is enabled, you may disable it in preferences if you don't want MakeMKV to contact web server.
```

..but I couldn't find a CLI flag to disable it.

I searched for a flag for the settings.conf to disable it, but didn't find it.

Eventually I used the GUI to disable the checkbox, and checked the settings.conf afterwards.
And voilá, a key `app_UpdateEnable` was written in the file.

There was a [request for documentation in the forum]((https://forum.makemkv.com/forum/viewtopic.php?t=8820)), but it's an old thread
and the auto update wasn't mentioned there.
After knowing the key, I found [this post](https://forum.makemkv.com/forum/viewtopic.php?t=20364).

# My drive

I own a techPulse 120 drive.

makemkv told me the drive was detected as:

```
HL-DT-ST_BD-RE_BU40N_1.02_211711301218_KZMIXXXXX51
```

which luckily is a very common model.

# Rip the disc

To just rip the whole disc, run this command:

```bash
docker run -it --rm -e "APP_KEY=<secret key>" --device /dev/sr0 --device /dev/sg0 -v (pwd):/output lasley/makemkvcon:1.14.5 makemkvcon mkv disc:0 all /output
```

In general, I didn't find much documentation about the CLI commands.

I found [this great gist](https://gist.github.com/pjobson/b17a869f6a0a722521fd0f008ba45355) and a lot of commands in the forum,
but it required some searching to find the commands I need.

# Corrupt or invalid at offset

I got presented a lot of errors, and I heard the drive slowed down a lot of times.
[See this thread](https://forum.makemkv.com/forum/viewtopic.php?t=7678).

The most named reason was a dirty disc or drive, so I cleaned both.
It didn't help.

# Flashing a new firmware

The next thing was an updated firmware. Not only does it unlock all region codes, but it also enables something called *LibreDrive*,
which (from what I understand) grants makemkv more direct access to the hardware.

Before flashing the firmware, I saw this log message:

```
LibreDrive firmware support is not yet available for this drive (id=5B235XXXXFC2)
```

I was a bit scared to flash the firmware, because when I bought the model I remember there were like seven variations of the drive
(with/without 4K support, with/without M-Disc write support and some more).
So I feared to lose like the M-Disc support by flashing a wrong firmware variant.

Luckily it worked without major damage.

- Ultimate UHD Drives Flashing Guide Updated 2022: [https://forum.makemkv.com/forum/viewtopic.php?f=16&t=19634](https://forum.makemkv.com/forum/viewtopic.php?f=16&t=19634)
- Custom firmware pack with LibreDrive patches: [https://forum.makemkv.com/forum/viewtopic.php?t=19113](https://forum.makemkv.com/forum/viewtopic.php?t=19113)
- SDFtool Flasher: [https://forum.makemkv.com/forum/viewtopic.php?t=22896](https://forum.makemkv.com/forum/viewtopic.php?t=22896)
- sdf.bin: [https://makemkv.com/sdf.bin](https://makemkv.com/sdf.bin)

The commands I ran were:

```bash
$ ./makemkvcon f -l
Found 1 drives(s)
00: dev_21:0, /dev/sr0, /dev/sr0
  HL-DT-ST_BD-RE_BU40N_1.02_211711301218_KZMIXXXXX51

$ ./makemkvcon f -v -v -v -d /dev/sr0 -f ./sdf.bin rawflash main -i ./HL-DT-ST-BD-RE_BU40N-1.03-NM00000-211810241934.bin
```

And it worked! On the next connection, my drive was detected with the updated firmware.

# Docker, VirtualBox

However, the flashed firmware didn't solve the problem of the corrupt sectors.
So I tried a Windows VM in VirtualBox, passed the USB connection over and tried there.
First it looked and sounded a bit better, but after some time the same errors occured.

# Windows...and success!

So my last resort was to use another PC. This time my gaming PC, with a Windows running directly
without virtualization.

And what can I say...first try and the backup worked immediately.

I'm not sure what the problem was. :( I could only guess.
But I'm happy it works now.
