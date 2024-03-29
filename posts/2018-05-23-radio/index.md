---
title: Radio
date: 2018-05-23T23:00:00+02:00
tags: ['radio', 'hackrf-one', 'sdr', 'limesdr', 'rtl-sdr', 'gqrx', 'gsm', 'gr-gsm', 'wireshark', 'gps', 'gnss-sdr', 'toys']
thumbnail: notebook.jpg
---

During the last weeks I wondered how radio works.
I wasn't able to find a good source which explains in simple words how the transformation of eletric current to radio waves is done.

I wonder if it's comparable to a lightbulb, which also transforms current to electromagnetic waves.
And I wonder if it's the opposite of the photoelectric effect, which takes photons to transform them into current.
Even the (usually really good) [Sendung mit der Maus](https://www.youtube.com/watch?v=Nc0tk8WemGg) couldn't really explain it to me. Armin rather focused on assembling pre-built components. :/

A lot of stuff is done via radio. Of course, there is FM/AM broadcasting, but there is way more:

- RFID
- Radar
- WiFi
- Bluetooth
- Amateur radio
- TV (DVB-T(2))
- CCTV / cameras
- Navigation (GPS / Galileo / GLONASS / Beidou)
- Mobile communications (GSM / 3G / LTE)

All of them use the same base technology.

# Hardware

If you have a radio which can send and receive on any frequency, you could use all of the above technologies with the same single device.
There is software which can take the raw radio wave and then run all the complicated [modulation](https://en.wikipedia.org/wiki/Modulation) on it to extract binary data. A radio which works with this kind of software is called [Software-defined radio](https://en.wikipedia.org/wiki/Software-defined_radio). Some radios are the [HackRF One](https://greatscottgadgets.com/hackrf/), the [bladeRF x40](https://www.nuand.com/blog/product/bladerf-x40/), the [LimeSDR](https://myriadrf.org/projects/limesdr/), the [Airspy](https://airspy.com/) and the [USRP](https://www.ettus.com/).

Luckily, there is also [RTL-SDR](https://www.rtl-sdr.com/about-rtl-sdr/), which stands for SDRs based on the very cheap RTL2832U chip. It's 10 EUR on ebay and works in the frequency range from 24 up to 1766 MHz, which doesn't work for WiFi/Bluetooth, but for example GSM. For me it was enough to play around have some fun with.

# Software

A nice tool to visualize the waves is [gqrx](http://gqrx.dk/). Connect the RTL-SDR, install gqrx (I used `sudo pacman -S gqrx` on Manjaro), select the frequency (I used 90.3 MHz for [NDR](https://www.ndr.de/903/index.html)), make sure the mode is set correctly in the dropdown (I used WFM mono), and you are ready to listen to radio on your computer.

{% image "notebook.jpg" %}

# GSM

There is a good series on [YouTube](https://www.youtube.com/watch?v=PExa5sC4sbE) which shows how to receive GSM data and explains it's broken encryption.
I found it interesting and decided to try it myself.
For this, you need [gr-gsm](https://github.com/ptrkrysik/gr-gsm) and [Wireshark](https://www.wireshark.org/).

First, put your phone in GSM mode (2G) and find out which channel it uses.
For my Samsung S7, I could dial `*#0011#` and it showed me the following screen:

{% image "samsung-gsm-arfcn.png" %}

We are interested in the BCCH arfcn (in this case 121), which we can put in an [online calculator](https://www.cellmapper.net/arfcn) which will give us the up- and downlink frequencies (in my case 959.2 MHz for downlink).

Install gr-gsm (On my machine via `yaourt -S gr-gsm-git`, see also [here](https://github.com/ptrkrysik/gr-gsm)), and run

```bash
grgsm_livemon
```

Enter the frequency in the following screen, and gr-gsm will start to convert the radio waves to binary GSM packages and send them to the loopback network interface of your machine.

{% image "grgsm-livemon.png" %}

Now if you open Wireshark and select the loopback device, you can see real GSM packages:

{% image "wireshark-gsm.png" %}

You can apply different filters. Just start typing gsm in the filter field and suggestions will pop up.
Please note that some packages might get lost.

Of course, GSM transfer is encrypted. So you cannot just read SMS in plain text.
However, lots of device use the A5/1 algorithm, which can be fairly easy broken by using a 2 TB rainbow table.
My particular phone (Samsung S7) uses the A5/3 algorithm instead, which is harder to attack, so I stopped here.

# GPS

I've tried to set the frequency to 1575.42 MHz in order to receive GPS signals. Unfortunately, I only saw random noise in gqrx.
The reason: GPS satellites only send with 50 watts and are ~20,000 km away from us.
I know it's not really comparable, but I've imagined to look at a 60 W light bulb from that distance. You wouldn't see shit.

But with some incredible tricks (like pseudorandom noise, it's not really random), GPS receivers can still recover the signal.
The satellites can even send on the same frequency as Galileo for example and the signal can be separated.

I've also found it impressing that time dilation needs to be considered in two ways:

1. The satellites are moving. Therefore, time elapses slower than on earth.
2. Gravity is lower for the satellites. Therefore, time elapses faster than on earth.

In 20,000 km height, the gravitational effect outclasses the speed effect by factor six.
So time elapses faster on the satellites than on earth.
Only by a little tiny bit, but if you don't consider it, your calculated position will be wrong!

I've found something on github which should be able to work with the raw radio data, however I haven't tested it yet:
[gnss-sdr](https://github.com/gnss-sdr/gnss-sdr)  
It probably won't work with a passive antenna.
