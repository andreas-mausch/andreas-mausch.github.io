---
title: "Bluetooth Speaker with 16x16 Display (Divoom Ditoo Pro)"
date: 2023-08-14T14:00:00+02:00
tags: ['hacking', 'reverse engineering', 'led', 'animations', 'pixel art']
thumbnail: ditoo-pro-playstation-symbols.jpg
toc: true
---

{% image "ditoo-pro-playstation-symbols.jpg" %}

I've received a gift! It's a Divoom Ditoo Pro.

It's a bluetooth speaker with some keys and extras, and it looks fantastic.

However, I quickly discovered you need to create an Divoom account to use the app.
You can enter anything you want, I did not receive any code via e-mail.
I still really dislike the need for the account in the first place.

The only connection I made to the device was via bluetooth, so I thought it should be possible to create
an open-source app which offers the basic features.

I looked around on GitHub and found there are similar devices from the same company, but I couldn't find exactly what
I was looking for: Sending gifs via bluetooth without the need of the official app.

# Capture Bluetooth network traffic on Samsung smartphone

First, I wanted to record what secret data the proprietary app sends and receives.
I was happy the whole transfer was made via bluetooth, and WiFi was not necessary
(the app also offers it, but I haven't tried it).

## Enable Bluetooth HCI Snoop Log

Enable the developer settings and enable the option to log bluetooth traffic.

Note: I had to restart my device afterwards to make it work.

{% thumbnail-clickable "android-developer-settings.png" %}

## Get the Bluetooth log

Now, I started the official app, did some settings, changed the image and so on.
When I thought I gathered enough information, I then had to [get the bluetooth log file](https://stackoverflow.com/questions/50639978/where-is-bluetooth-hci-log-of-samsung-s8-android-8-0).

I think this is now special to Samsung and there is no general way for it on Android, so it might be different on your device.

I dealt the phone number `*#9900#` to enter the service mode menu.
Then, I selected *Run dumpstate/logcat*. It took some minutes to finish.
Next, I selected *Copy to sdcard(include CP Ramdump)*.
And finally, there was a file `/sdcard/logs/bluetooth/btsnoop_hci_202308131606.cfa` which I copied on my PC via adb.

{% thumbnail-clickable "android-samsung-service-mode.png" %}

# Analyse the Bluetooth log via Wireshark

This .cfa file you can now open in Wireshark (or, if you also like the terminal: with Termshark).
There was a lot of stuff going on. Some of what seemed familiar (like A2DP), but also something new.

I didn't know an audio device can also handle a serial connection next to it, the Serial Port Profile (SPP).
I still don't know what limitations it has, but it seems to be a pretty straight-forward pipe in both directions.

I quickly discovered I need to the set the filter to *btspp* (see [here](https://www.wireshark.org/docs/dfref/b/btspp.html))
to get the messages I am interested in.

{% image "termshark.png" %}

# Existing GitHub projects for Divoom

Of course I wasn't the first person to look closer at the communication of these devices.
And as already mentioned, there are several similar devices. Here is a bunch of links which I found to be helpful:

- [https://github.com/RomRider/node-divoom-timebox-evo](https://github.com/RomRider/node-divoom-timebox-evo)  
  (especially [https://github.com/RomRider/node-divoom-timebox-evo/blob/master/PROTOCOL.md](https://github.com/RomRider/node-divoom-timebox-evo/blob/master/PROTOCOL.md))
- [https://github.com/eelcocramer/node-bluetooth-serial-port](https://github.com/eelcocramer/node-bluetooth-serial-port)
- [https://github.com/redphx/apixoo](https://github.com/redphx/apixoo)
- [https://estebon.mx/?p=202](https://estebon.mx/?p=202)  
  Teardown of a similar model
- [https://github.com/virtualabs/pixoo-client](https://github.com/virtualabs/pixoo-client)  
  Python implementation which supports converting .gif -> Divoom format
- [https://github.com/MattIPv4/divoom-control](https://github.com/MattIPv4/divoom-control)  
  A little script/CLI for controlling Divoom devices (I wish I had found this earlier)
- [https://forum.fhem.de/index.php?topic=81593.0](https://forum.fhem.de/index.php?topic=81593.0)

# Analyse the .apk

I downloaded the *Divoom pixel art editor_3.6.40.apk* file and opened it in the tool *JADX-GUI*.
It offers some help for deobfuscation and after some time I found an enum with all the commands available via SPP.

{% image "jadx-gui.png" %}

**TOOO**

# Send the first self-constructed message to the Ditoo Pro

My goal was to send the simplest possible message to the Ditoo to just see if it receives it and also to make sure
there are not extra security measures like a device authentication, certificates or something similar.

I failed to find a convenient tool to replay the bluetooth messages from a Linux machine.
I only found an [entry for sdptool](https://unix.stackexchange.com/questions/92255/how-do-i-connect-and-send-data-to-a-bluetooth-serial-port-on-linux),
which wasn't convenient at all (and the method described might be outdated anyway), so I went with Node.js instead.

In the traffic capture file was a command to enable and disable an alarm and I thought that would be a good start.

I spotted it fairly easily, by combining what I saw in the .apk, the length of the messages and two messages which only differed in one byte:
One of them was 00, the other one 01, which made me confident it was the enable/disable alarm message.

So I copied the bytes from the capture (see the termshark screenshot above), used the (very easy to use) library `bluetooth-serial-port`
and tried this:

```js
import { BluetoothSerialPort } from "bluetooth-serial-port";

const port = new BluetoothSerialPort();

port.findSerialPortChannel("11:22:33:44:55:66", channel => {
  console.log("found serial port channel:", channel);
  port.connect("11:22:33:44:55:66", channel, () => {
    console.log("connected");

    port.write(Buffer.from("010d00430000142e000200000028bc0002", "hex"), (err, bytesWritten) => {
      console.log("Sent command to disable alarm", err, bytesWritten);
    });
  }, () => {
    console.log("cannot connect");
  });
}, () => {
  console.log("found nothing");
});
```

Replace the MAC address and boom, it worked on the first try. The Ditoo showed a screen with a sign an alarm was disabled.

So a milestone was reached:
Now I am able to communicate with the Ditoo and send whatever commands I like to.

# The image file format

I call the file format *divoom16* from here on.
I only cover 16x16 animations here.

Let's take this example image (which I have converted to a .gif so we can view it in the browser).

<img src="{% image-url 'witch.gif' %}" width="256" height="256" style="image-rendering: pixelated" alt="Animation of a witch">

I have colored the sections of the original frame bytes in this screenshot (in dhex):

{% image "image-in-hex.png" %}

See also the very detailed description here:
[https://github.com/RomRider/node-divoom-timebox-evo/blob/master/PROTOCOL.md](https://github.com/RomRider/node-divoom-timebox-evo/blob/master/PROTOCOL.md)

Each frame (FRAME_DATA) consists of:
`AA LLLL TTTT RR NN COLOR_DATA PIXEL_DATA`

- `AA`: Frame Start
- `LLLL`: FRAME_DATA length in bytes
- `TTTT`: Time of the frame in ms
- `RR`: He describes it as *Reset Palette*, but I think it rather says whether to re-use the palette from the previous frame
- `NN`: Number of Colors in the frame's palette
- `COLOR_DATA`: 3 bytes for each color, one for R, G, B
- `PIXEL_DATA`: See below

The colors of the image in the screenshot are:

<pre>
Color [000]: #000000 <span style="color: #000000">████</span>
Color [001]: #9b9b9b <span style="color: #9b9b9b">████</span>
Color [002]: #36055e <span style="color: #36055e">████</span>
Color [003]: #926dc4 <span style="color: #926dc4">████</span>
Color [004]: #e0c3c3 <span style="color: #e0c3c3">████</span>
Color [005]: #8f00ff <span style="color: #8f00ff">████</span>
Color [006]: #cc8989 <span style="color: #cc8989">████</span>
Color [007]: #a13d3d <span style="color: #a13d3d">████</span>
</pre>

The pixel data format differs, depending on the number of colors in the image.
Each pixel uses log2(colors) bits to reference to a color of the palette.

For example an image with 8 colors (like in the screenshot above) uses 3 bits per pixel.
An image with 12 colors would use 4 bits per pixel instead, and a 256 color image uses 8 bits per pixel.

# The network protocol

**TODO**

# Send a gif animation

**TODO**

## Decode the image format

**TODO**

# Project with all my code

I have uploaded my code to GitHub:
[https://github.com/andreas-mausch/divoom-ditoo-pro-controller](https://github.com/andreas-mausch/divoom-ditoo-pro-controller).

# More to come

I would like to implement an alternative app, which doesn't require an account and offers basic features like setting a new image.
I looked briefly at possible technologies for that.

I have used Ionic in the past, which was a good experience for me.

I now consider Flutter and NativeScript.

I would like to use Vue.js, but I also want to have native UI elements.
NativeScript has a medium reputation and people on Reddit prefer Flutter or React Native all day long.
But since this is a new, small project for me I am willing to experiment here to see what is so bad about NativeScript.
The concept just looks right to me.
