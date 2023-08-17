---
title: "Nostalgia: Highscreen 386"
date: 2020-09-07T19:00:00+02:00
tags: ['nostalgia', 'highscreen', '386', 'msdos', 'lpt', 'toys']
thumbnail: 20200813_202113-ausgeschaltet.jpg
toc: true
---

# Intro

My first own PC was a 286 with MS-DOS 3 (or maybe 4?).

My second PC, and the one I've spent most time with, was a *Highscreen 386*.

For nostalgia, I've decided to buy almost the exact model I had owned back then.
Despite being a popular model, it was not that easy to find a functional computer together with it's original monitor, keyboard and mouse on the internet.

# Hardware

That's why it cost me quite some time to find it on eBay and **386 Euro**.

{% image "20200813_202113-ausgeschaltet.jpg" %}

{% thumbnail-clickable "20200907_201853-keyboard-and-pc.jpg" %}
{% thumbnail-clickable "20200907_201936-pc.jpg" %}

{% video "VID_32750525_133650_266-booting.webm" "video/webm; codecs=av01.0.05M.08,opus" "controls" %}

Back in 1991 ads looked like this:

{% thumbnail-clickable "IMG-20200213-WA0006-werbung.jpg" %}
{% thumbnail-clickable "vobis-denkzettel-1991.jpg" %}

# Accessories

## Printer: Highscreen MP-24 BB

I've also ordered a Highscreen MP-24 BB dot matrix printer (29 Euro).
And I was able to order a brand new ink ribbon for it (10 Euro). Incredible. :)

{% thumbnail-clickable "20200811_210621-printer.jpg" %}
{% thumbnail-clickable "20200813_221326-printer.jpg" %}

## Scanner: Highscreen Grey Scan 64

The icing on the cake was the Highscreen Grey Scan 64 handset scanner (10 Euro), together with the original packaging and the ISA bus card.

{{ "20200907_195518-highscreen-scanner.jpg 20200907_195333-highscreen-scanner-box.jpg 20200907_195409-highscreen-scanner-in-box.jpg DSC_5877-scanner-card.jpg" | split: " " | carousel }}

In order to transfer files to my "new" PC I use a USB floppy drive (15 Euro) and a bunch of floppy disks (about 1 Euro per piece, brand new and shrink-wrapped).

{% thumbnail-clickable "20200904_191422-floppy-disk.jpg" %}
{% thumbnail-clickable "20200904_191530-floppy-usb-drive.jpg" %}

# Copying files

Nice: I didn't have to install any driver or configure anything to use the USB floppy drive.
The disks were pre-formatted and ready to use. The file system was recognized on both computers out-of-the-box.

After using the USB floppy drive for some time, I've noticed some file transfers were corrupt.
After blaming the first and second floppy disk to be faulty, I realized I've misused the drive on my linux PC.
I've copied the files over using the file manager Thunar and just removed the disk after the usage LED didn't show light anymore.
This was bad, because I had not unmounted the floppy properly.
A bit strange: For memory sticks and external HDDs Thunar offers a button for unmounting. For the external USB drive it does not.

The faulty floppies couldn't even be formatted on the original 386 anymore.
I was able to bring them back to life by low-level formatting them on linux via [ufiformat](https://github.com/jumski/ufiformat). Phew.

I've continued to do the mounting and unmounting manually on the command line, instead of using Thunar. I didn't have another faulty floppy disk since then.

{% image "20200907_200413-have-a-nice-dos.jpg" %}

# Sounds

I love the sounds it makes:
- HDD
- Floppy drives
- Speaker

# SoundBlaster and Music trackers

Due to the lack of a sound card as a kid, I've discovered the tracker softwares way later, but I'm in love with the looks of the tools.

{{ "20200916_183351-soundblaster-creative-ct4170.jpg DSC_5876-soundblaster-creative-ct4170.jpg DSC_5880-case-opened.jpg DSC_5888-soundblaster-software.jpg" | split: " " | carousel }}

Scream Tracker:

{% video "20200916_203116-scream-tracker.webm" "video/webm; codecs=vp9,opus" "controls" %}

FastTracker:

{% thumbnail-clickable "DSC_5890-fasttracker.jpg" %}
{% thumbnail-clickable "DSC_5892-fasttracker-close.jpg" %}

{% video "20200916_215742-fast-tracker.webm" "video/webm; codecs=vp9,opus" "controls" %}

# Games

- Commander Keen
- Raptor
- One must fall 2097
- Sam & Max: Hit the road
- Tropfen
- Battle Chess

I've owned a lot of sharewares back then, where you could play parts of the game.

It was quite challenging to find original floppy disk images on the internet for my favorite software.

Sometimes I found a download with a 8 MB zip file. Well. How am I supposed to pack it onto 1.44 MB floppy disks?

I've found that the combination of [lxsplit](http://lxsplit.sourceforge.net) and Norton Commander's file merging worked well to copy big files.

{% image "20200907_201647-sam-and-max.jpg" %}

{% video "20200916_194310-soundcard-test-omf-2097.webm" "video/webm; codecs=vp9,opus" "controls" %}

{{ "20200828_213240-sam-and-max-setup.jpg 20200907_201458-sam-and-max-copy-protection.jpg 20200907_195757-commander-keen-4.jpg 20200907_195925-battle-chess-title-screen.jpg 20200907_200002-battle-chess.jpg 20200907_200323-crime-fighter-menu.jpg 20200907_200330-crime-fighter.jpg 20200907_200442-grand-prix.jpg 20200829_133837-one-must-fall-setup.jpg 20200907_201159-omf-2097-menu.jpg 20200907_201347-omf-prefight.jpg 20200907_201250-omf-fight.jpg 20200907_200053-tropfen-title-screen.jpg 20200907_200047-tropfen.jpg" | split: " " | carousel }}

# Software development

- GW-BASIC
- QBasic / QuickBasic
- Turbo Pascal 7.0

To my surprise, GW-BASIC was not part of the MS-DOS 5.0 which was installed on the machine.
After some research I realized QBasic replaced GW-BASIC in newer DOS versions.

I've made my first steps in software development with GW-BASIC and a book from the public library. The most interesting books in the whole library were the ones with floppy disks inside!
(Some even had a CD, but I had no computer to use them with yet.)

I've spent **lots** of hours learning by those books. And looking back, it was very different to today: No internet, no googling, no stackoverflow. I had a book or two and the manpages (aka Help) from the programs. And it was a great feeling of success when I've learned some new command.

But some things in the process are still the same: Learning from my own mistakes, logical problem solving, getting aware of when the program is getting too complex.

One note on Turbo Pascal: The images I've found on the internet were for 720 KB floppy disks, but my floppy disks have 1.44 MB. I've mounted the disk images on linux and manually copied the files over to the disk.

```bash
sudo mount -o loop,ro -t vfat ~/Downloads/disk1.img ./floppy/
```

{% image "20200907_205812-programming-books.jpg" %}

{% thumbnail-clickable "20200829_140131-turbo-pascal-setup.jpg" %}
{% thumbnail-clickable "20200829_143939-turbo-pascal.jpg" %}
{% thumbnail-clickable "20200907_201801-edit-autoexec.jpg" %}

# Windows

{% image "20200907_190937-paintbrush.jpg" %}

{{ "20200907_183810-windows-setup.jpg 20200907_184314-windows-setup.jpg 20200907_190545-windows-boot-screen.jpg 20200907_190418-windows-started.jpg 20200907_190425-windows-file-manager.jpg 20200907_191224-windows-games.jpg" | split: " " | carousel }}

# Other apps

Lotus 1-2-3

{% image "DSC_5894-lotus_1-2-3.jpg" %}
