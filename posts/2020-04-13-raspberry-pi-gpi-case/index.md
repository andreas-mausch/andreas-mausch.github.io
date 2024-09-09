---
title: Retroflag GPi Case with a Raspberry Pi Zero W
date: 2020-04-13T23:00:00+02:00
tags: ['single board computer', 'raspberrypi', 'retroflag', 'gpi-case', 'retropie', 'dos', 'gameboy', 'playstation', 'toys']
thumbnail: games/omf2097.jpg
---

Corona quarantine time. So I've gotten myself a toy.

{% image "gpi-case.jpg" %}

This Game Boy looking device can hold a Raspberry Pi Zero (W), has inputs, a display and sound.
I've installed RetroPie onto it.

What's also impressive: If you don't want to use RetroPie,
you still have a fully functional Raspi (+ a display) which runs just on batteries!

{{ "games/*.jpg" | glob | carousel }}

# Installation RetroPie

Here is a good [guide](https://howchoo.com/g/ndc3njbhytv/retroflag-gpi-setup).

Steps:

- Flash image
- Install [GPi Case patch](https://support.retroflag.com/Products/GPi_Case/GPi_Case_patch.zip) ([Mirror on github.com](https://github.com/kristijandraca/GPi_Case_patch))
- Enable ssh: *touch ssh* in boot partition
- Setup WiFi: *wpa_supplicant.conf* in boot partition with:

```{data-filename=wpa_supplicant.conf}
country=US
ctrl_interface=DIR=/var/run/wpa_supplicant GROUP=netdev
update_config=1

# RETROPIE CONFIG START
network={
    ssid="your_real_wifi_ssid"
    psk="your_real_password"
}
```

- Boot
- Install [safe shutdown scripts](https://github.com/RetroFlag/retroflag-picase)

# Kodi

You can [install Kodi](https://github.com/RetroPie/RetroPie-Setup/wiki/KODI) if you like.

# Emulators

## Game Boy / Game Boy Color / Game Boy Advanced

You might need to copy a BIOS file for each Game Boy.

See [here (GB)](https://github.com/RetroPie/RetroPie-Setup/wiki/Game-Boy)
and [here (GBA)](https://github.com/RetroPie/RetroPie-Setup/wiki/Game-Boy-Advance).

And I had to do this:

```bash
ln -s /opt/retropie/libretrocores/lr-gpsp/game_config.txt /home/pi/RetroPie/roms/gba/game_config.txt
```

## DosBox

I wasn't able to configure inputs with lr-dosbox.
Same for rpix86, which runs games much faster, but I couldn't get it working with the inputs. :(

So I used the normal *dosbox* emulator.
To configure keys, I've [ran](https://www.freddyblog.de/retropie-dosbox-controller-mapping-erstellen/):

```bash
ssh -X pi@retropie
cd /opt/retropie/emulators/dosbox/bin/
./dosbox -startmapper
```

{% image "dosbox-mapper.png" %}

Config file: */opt/retropie/configs/pc/mapper-SVN.map*  
[Download]({{ "files/mapper-SVN.map" | relativeFile | url }})

Controls:

- I've mapped mod_1 and mod_2 to the shoulder keys (L and R) at the back
- *L+Down* exits DosBox
- *Select* is Escape
- *Start* is Enter
- *A* is Control
- *B* is Alt
- *X* is Space
- *R+up* is *Y*, *R+down* is *N* (needed for some games)

For real fullscreen mode without black bars, make sure you set *aspect=true* and *fullscreen=true* in the config.

Config file: */opt/retropie/configs/pc/dosbox-SVN.conf*  
[Download]({{ "files/dosbox-SVN.conf" | relativeFile | url }})

timidity was eating a lot of CPU and slowed games down.
I couldn't even figure out what it's useful for, since games still played midi sounds perfectly well even when I disabled it.

Edit the file */home/pi/RetroPie/roms/pc/+Start DOSBox.sh* and comment out the lines *midi_synth start* and *midi_synth stop*.
Should be four lines in total.

## Playstation

Emulator: PCSX-reARMed  
Guide: [here](https://www.reddit.com/r/retroflag_gpi/comments/d91tuv/how_to_get_pcsxrearmed_to_work_on_retropie_for/)

Maybe better solution?: [xboxdrv](https://sinisterspatula.github.io/RetroflagGpiGuides/Controls_Updater_Menu)

Config file: */opt/retropie/configs/psx/pcsx/pcsx.cfg*  
[Download]({{ "files/pcsx.cfg" | relativeFile | url }})

It was a bit confusing, because there is also an empty folder *cfg* there.
But that's how I got it working.

**START and D-PAD LEFT** to enable Joystick/Axis input mode  
**START and D-PAD UP** to enable D-PAD input mode

The light at the top of the GPi case will do a confirmation blink purple on every mode change.

# Themes

I like TFT, but I like [Super Retroboy](https://github.com/KALEL1981/es-theme-Super-Retroboy) even better.

## Splashscreen

I use [this video](https://www.youtube.com/watch?v=xblMd-je7eU).

And I had to set audio_pwm_mode=0 in */boot/config.txt*.

See [here](https://sudomod.com/forum/viewtopic.php?f=44&t=5953&sid=a445fc61f5d69f18b005c1318d303f41&start=10#p61371).

# Power consumption

The GPi Case runs either with 3x AA batteries, or with a provided USB power supply cable.

I've measured power consumption in-game with 100% CPU and in the menu of EmulationStation with 0% CPU.
Medium brightness.
Make sure to enable EmulationStation's Power safe options.

Power consumption under 100% load is about **1.63 W**.

Battery lifetime is about 4h.

{% image "power-consumption-idle.jpg" %}

{% image "power-consumption-load.jpg" %}
