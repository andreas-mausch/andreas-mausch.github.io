---
title: "Waveshare 7.3inch ACeP 7-Color E-Paper"
date: 2024-11-10T19:00:00+01:00
tags: ['eink', 'epaper', 'rpi-pico']
toc: true
thumbnail: madeira-optimized.jpg
---

I have bought a digitial photo frame with an e-Ink Display.

It works really well, but copying new images is a bit hacky
and colors look a bit pale due to the display technology.

{% image "madeira-optimized.jpg" %}

# Specs

[Link](https://www.waveshare.com/wiki/PhotoPainter)

- RP2040 chip (also used in Raspberry Pi Pico)
- Neither WiFi nor Bluetooth
- instead, it has a Micro SD card slot
- The displayed photo can be updated at chosen intervals
- No power consumption, unless the photo is changed
- Battery life for several months, if the image is updated daily
- When the battery dies, the last photo is still shown

So there is no app on your phone to transfer new images to the device,
instead you need to manually prepare them on your computer,
copy them on the SD card and press a button on the device to show the next image.

If you have several hundreds of images on it, it is impracticable to select it by hand.
Each change takes about 30 secs.

# Convert images

The device can only read images in 24-bit RGB `.bmp` format,
which only use the seven colors the display can show. See below for a list.

Waveshare provides an `convert.py` python script for converting images.

I like it better to do it with ImageMagick, and here is how I do it.

## Generate a palette

The e-Ink display only supports seven different colors.
You can find them in the `convert.py` script or by extracting them from a converted image.
They are:

- #000000 black
- #FF0000 red
- #00FF00 lime
- #FF8000 orange
- #FFFF00 yellow
- #0000FF blue
- #FFFFFF white

<img src="{% image-url 'palette.png' %}" width="350" height="50" style="image-rendering: pixelated" alt="Palette">

To generate a `palette.png` use this command:

```bash
magick convert -size 1x1 xc:black xc:red xc:lime 'xc:rgb(255,128,0)' xc:yellow xc:blue xc:white +append palette.png
```

## Convert any image using ImageMagick

```bash
magick convert source.jpg -resize 800x480^ -gravity center -extent 800x480 -dither FloydSteinberg -remap palette.png -type truecolor -set filename:myname '%t.%wx%h' '%[filename:myname].bmp'
```

I suggest two more changes:

- increase the contrast of the image by 30%
  `-brightness-contrast 0,30`
- increase the saturation of the image to 200%, because the colors on the screen are more pale:
  `-modulate 100,200,100`

The `FloydSteinberg` algorithm gave me the best results, but you can try others, like `Riemersma`.

My **complete command** looks like:

```bash
magick convert source.jpg -resize 800x480^ -gravity center -extent 800x480 -brightness-contrast 0,30 -modulate 100,200,100 -dither FloydSteinberg -remap palette.png -type truecolor -set filename:myname '%t.%wx%h' '%[filename:myname].bmp'
```

On a computer the image will look very shitty now, but on the actual photo frame it is much better in my opinion.

## Copy image to SD card

As the official instructions say: Format the SD card as FAT32, create a folder `pic`
and copy all the .bmps you like to the folder.

On the first start inside the device, it will generate a file list and the last used index.

# Color comparison

This is the original image:

{% image "madeira.jpg" %}

That was the first version of it on the frame, which was kind of disappointing.
It almost looked like a monochrome version (tbh, the photo was also taken in bad lighting):

{% image "madeira-on-frame.jpg" %}

Here is how it looked after +30% contrast and 100% saturation,
which in my opinion looks really good:

{% image "madeira-optimized.jpg" %}

You cannot expect any color accuracy of course, but the colors still look great.

Here is a close-up where you can clearly see the dithering.
But from ~1 meter distance is it barely noticable anymore.

{% image "madeira-optimized-closeup.jpg" %}

Here is the color palette for reference:

{% image "palette-on-frame.jpg" %}

# Modded firmware

<https://github.com/tcellerier/Pico_ePaper_73>

> New mode 3, featuring:
>
> - Maximum files increased to 2000 (from 100)
> - Complete randomization of photo sequence
> - More refresh rate precompiled options

How to flash:
<https://www.youtube.com/watch?v=Kc_lxVL6aMw>
