---
title: "Samsung S4: Ad-Hoc WiFi (IBSS) on LineageOS 14.1"
date: 2017-12-11T02:00:00+01:00
tags: ['android', 'lineageos', 'mesh', 'ad-hoc']
thumbnail: olsr.png
---

I did some investigations into [Mesh Networks]({% link-post "2017-07-20-mesh-networks-on-android" %}) few weeks ago, in which I set up an Ad-Hoc WiFi network on my Samsung S4 phone.  
However, I used CyanogenMod 11, which is a little outdated.

I've received an e-mail from Andrew Hunter <andrew.hunter@utexas.edu> from Texas, who tried to run an Ad-Hoc network on the current LineageOS, 14.1.  

For some reason, CyanogenMod decided to drop support for Ad-Hoc, so the current LineageOS doesn't have it.  
In fact, you won't be even able to see Ad-Hoc networks on the network list. They are filtered out.

So he tried to establish a connection by directly calling the Linux command in the adb shell ($SSID can be TestAdHoc and $FREQ 2412 for example):

```bash
iw wlan0 set type ibss
iw wlan0 ibss join $SSID $FREQ
```

However, this results in an error message:

> command failed: File table overflow (-23)

For some reason we need a special firmware for the WiFi chip.

Andrew had this problem and asked me if I knew any details on how to fix it.  
Well, I didn't. But after several trials and errors he made great progress and got it running!

> If you don't load the IBSS firmware, the join command will fail. Also, if you try to set the frequency in IBSS mode without the IBSS firmware loaded, it might crash the device, and restart.  
> In /sys/module/dhd/parameters/ are the files firmware_path and nvram_path. These two are empty by default and, I believe, are cleared whenever wifi is brought down. If you populate these before bringing the interface backup, you cause the firmware and driver to assume certain settings. The folder /system/etc/wifi has a variety of firmware and nvram settings you can select.  
> It may be that populating path variables for module loading is a standard paradigm, but I was not aware of it; I merely guessed based on module loading commands I had seen years ago. As I said, I expected to be using insmod and rmmod to set such things, but these aren't available here.  
> This isn't hard once you know it, but I'm rather surprised I couldn't find any discussion of this.
>
> -- Andrew

Luckily, the IBSS firmware is part of the LineageOS image and already on the phone.
In order to load it, open up a shell on your rooted phone:

```shell-session
$ adb shell
jfltexx:/ $ su
jfltexx:/ #
```

Now open the network view on the phone and disable WiFi.

Execute the following commands:

```bash
# WiFi should be down already, just make sure it is
ifconfig wlan0 down

# Load the correct firmware files for WiFi Ad-Hoc (IBSS)
echo "/system/etc/wifi/bcmdhd_ibss.bin" >> /sys/module/dhd/parameters/firmware_path
echo "/system/etc/wifi/nvram_net.txt" >> /sys/module/dhd/parameters/nvram_path

# Start WiFi again and assign a static IP address
ifconfig wlan0 10.0.0.1 netmask 255.255.255.0 up

# Set mode to WiFi Ad-Hoc (IBSS)
iw wlan0 set type ibss

# Join or create the network
iw wlan0 ibss join $SSID $FREQ
```

The new WiFi with the SSID should now show up on other devices when you scan for open networks.

**Thank you Andrew for the work you put into this and for sharing the knowledge!**

# Why did it work on CyanogenMod 11?

thinktube.com created patches for CM 11 and 12.
These patches included a GUI to select/create a WiFi Ad-Hoc network, but also [patched the bcmdhd driver](http://www.thinktube.com/files/android-ibss/patches/kernel-samsung-tuna-0001-bcmdhd-Enable-Ad-Hoc-IBSS-mode.patch).
Please check their page here for details:

[http://www.thinktube.com/android-tech/46-android-wifi-ibss](http://www.thinktube.com/android-tech/46-android-wifi-ibss)

It would also be very interesting to know the reasons for the dropped support of Ad-Hoc in newer versions of CyanogenMod/LineageOS.
Most likely, thinktube.com just didn't provide patches.

# List of firmwares

- /system/etc/wifi/bcmdhd_apsta.bin
- /system/etc/wifi/bcmdhd_ibss.bin
- /system/etc/wifi/bcmdhd_mfg.bin
- /system/etc/wifi/bcmdhd_sta.bin

I've used lineage-14.1-20171206-nightly-jfltexx-signed.zip

{% image "olsr.png" %}
