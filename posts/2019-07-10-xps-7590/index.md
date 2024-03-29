---
title: Dell XPS 15 7590
date: 2019-07-10T22:00:00+02:00
tags: ['dell', 'xps', 'linux', 'manjaro', 'wifi']
thumbnail: wifi/08-xps-7590-opened-close.jpg
toc: true
---

# Change WiFi chip for Intel 9260

{{ "wifi/*.jpg" | glob | carousel }}

# BIOS settings

{{ "bios/*.jpg" | glob | carousel }}

# Manjaro

{{ "manjaro/*.jpg" | glob | carousel }}

# Arch Wiki

[https://wiki.archlinux.org/index.php/Dell_XPS_15_7590](https://wiki.archlinux.org/index.php/Dell_XPS_15_7590)

# Terminal settings

{% image "terminal.jpg" %}

```{data-filename=~/.config/xfce4/terminal/terminalrc}
[Configuration]
MiscAlwaysShowTabs=FALSE
MiscBell=FALSE
MiscBordersDefault=FALSE
MiscCursorBlinks=FALSE
MiscCursorShape=TERMINAL_CURSOR_SHAPE_BLOCK
MiscDefaultGeometry=130x38
MiscInheritGeometry=FALSE
MiscMenubarDefault=FALSE
MiscMouseAutohide=FALSE
MiscToolbarDefault=FALSE
MiscConfirmClose=TRUE
MiscCycleTabs=TRUE
MiscTabCloseButtons=TRUE
MiscTabCloseMiddleClick=TRUE
MiscTabPosition=GTK_POS_TOP
MiscHighlightUrls=TRUE
ScrollingLines=999999
BackgroundDarkness=0,860000
ScrollingOnOutput=FALSE
MiscBellUrgent=FALSE
MiscMouseWheelZoom=TRUE
MiscMiddleClickOpensUri=FALSE
MiscCopyOnSelect=FALSE
MiscRewrapOnResize=TRUE
MiscUseShiftArrowsToScroll=FALSE
MiscSlimTabs=FALSE
MiscNewTabAdjacent=FALSE
BackgroundImageFile=/home/neonew/Bilder/Frischer-Waldtropfen.jpg
BackgroundImageStyle=TERMINAL_BACKGROUND_STYLE_STRETCHED
BackgroundImageShading=0,650000
MiscShowRelaunchDialog=TRUE
FontName=Source Code Pro 11
BackgroundMode=TERMINAL_BACKGROUND_IMAGE
MiscSearchDialogOpacity=100
MiscShowUnsafePasteDialog=TRUE
ScrollingBar=TERMINAL_SCROLLBAR_NONE
DropdownAlwaysShowTabs=FALSE
DropdownKeepAbove=FALSE
DropdownKeepOpenDefault=TRUE
DropdownStatusIcon=FALSE
ColorPalette=rgb(37,31,31);rgb(230,131,96);rgb(148,231,107);rgb(255,172,24);rgb(70,174,222);rgb(240,85,121);rgb(214,219,172);rgb(239,239,239);rgb(94,94,94);rgb(255,169,138);rgb(149,231,107);rgb(255,172,24);rgb(70,174,222);rgb(238,94,128);rgb(214,219,172);rgb(239,239,239)
DropdownWidth=100
DropdownHeight=75
ColorForeground=#ffffffffffff
ColorBackground=#000000000000
ColorCursor=#ffffffffffff
```

# yay

Just as in the [readme](https://github.com/Jguer/yay):

```bash
cd /tmp
mkdir yay-build
cd yay-build
git clone https://aur.archlinux.org/yay.git
cd yay
makepkg -si
```

## PKGBUILD (.tar)

In */etc/makepkg.conf* change the line:

```{data-filename=/etc/makepkg.conf}
PKGEXT='.pkg.tar'
```

# intel-undervolt

```bash
yay -S intel-undervolt
```

Modify */etc/intel-undervolt.conf*.  
I've set this on my i9-9980HK:

```{data-filename=/etc/intel-undervolt.conf}
undervolt 0 'CPU' -150
undervolt 1 'GPU' -75
undervolt 2 'CPU Cache' -80
```

```bash
sudo intel-undervolt apply
# If this was successful, and you did some tests to make sure it's stable:
systemctl enable intel-undervolt.service
```

# XDG user dirs

Manjaro creates localized user directories by default. I don't like it too much.

So my *~/.config/user-dirs.dirs* looks like:

```{data-filename=~/.config/user-dirs.dirs}
XDG_DESKTOP_DIR="$HOME/Desktop"
XDG_DOWNLOAD_DIR="$HOME/Downloads"
XDG_TEMPLATES_DIR="$HOME/Templates"
XDG_PUBLICSHARE_DIR="$HOME/Public"
XDG_DOCUMENTS_DIR="$HOME/Documents"
XDG_MUSIC_DIR="$HOME/Music"
XDG_PICTURES_DIR="$HOME/Pictures"
XDG_VIDEOS_DIR="$HOME/Videos"
```

# ecryptfs

Login as root after a fresh reboot. No other user session should exist.

```bash
modprobe ecryptfs
ecryptfs-migrate-home -u username
```

Change */etc/pam.d/system-auth* according to [ECryptfs#Encrypting_a_home_directory](https://wiki.archlinux.org/index.php/ECryptfs#Encrypting_a_home_directory).

# hwclock

Set current system time and write it to BIOS.

```bash
sudo ntpdate 0.europe.pool.ntp.org
sudo hwclock --show
sudo hwclock --systohc
```

# xcape

There is a problem if you want the *Super Key* to open your whiskermenu, but also want to set custom shortcuts like *Super+E* to open your file manager. So create a new file:

```{data-filename=~/.config/autostart/xcape.desktop}
[Desktop Entry]
Type=Application
Name=xcape
Exec=/usr/bin/xcape -e 'Super_L=Alt_L|F9;Super_R=Alt_L|F9'
StartupNotify=false
Terminal=false
```

Install xcape:

```bash
sudo pacman -S xcape
```

From now on, if you just press the *Super Key*, the whiskermenu should open. But if you press *Super+E*, your file manager opens **but the whiskermenu does not**.

# My shortcuts

| Command                       | Shortcut                | Description                                  |
|-------------------------------|-------------------------|----------------------------------------------|
| exo-open --launch FileManager | *Super+E*               | Thunar                                       |
| exo-open --launch MailReader  | *Super+T*               | Thunderbird                                  |
| exo-open --launch WebBrowser  | *Super+W*               | Chromium                                     |
| galculator                    | *Super+C*               | Calculator                                   |
| xfce4-screenshooter -f        | *Print*                 | Full screen                                  |
| xfce4-screenshooter -w        | *Shift+Print*           | Window                                       |
| xfce4-screenshooter -r        | *Ctrl+Print*            | Region (user can select it)                  |
| xfce4-terminal --drop-down    | *Super+dead circumflex* | Console (Counter-Strike style)               |
| xflock4                       | *Ctrl+Alt+Del*          | Lock the screen                              |

# ä vs ^ (aka dead circumflex)

First, I've tried to open the terminal by using just the *dead circumflex* key.
This worked, however my 'ä' key didn't anymore.

Even *xev* didn't recognize the key.
That's why I've changed the shortcut to *Super+dead circumflex*.

# xbacklightmon

OLEDs don't have a backlight brightness control. So we can achieve the same effect by changing the gamma.

To test the brightness change manually, run `xrandr --output eDP1 --brightness 0.5`.

```sh {data-filename=/usr/local/bin/xbacklightmon}
#!/bin/sh

path=/sys/class/backlight/intel_backlight

luminance() {
    read -r level < "$path"/actual_brightness
    factor=$((max))
    new_brightness="$(bc -l <<< "scale = 2; $level / $factor")"
    echo "${new_brightness}"
}

read -r max < "$path"/max_brightness

xrandr --output eDP1 --brightness "$(luminance)"

inotifywait -me modify "$path"/actual_brightness | while read; do
    xrandr --output eDP1 --brightness "$(luminance)"
done
```

```{data-filename=~/.config/autostart/xbacklightmon.desktop}
[Desktop Entry]
Type=Application
Name=xbacklightmon
Exec=/usr/local/bin/xbacklightmon
StartupNotify=false
Terminal=false
```

# slock

slock is a display locker. Clean and fast, no gimmicks.

```bash
sudo pacman -S slock
# light-locker opens the lightdm greeter after suspend.
# I don't want this. Go away.
sudo pacman -R light-locker
xfconf-query -c xfce4-session -p /general/LockCommand -s "slock"
```

```{data-filename=/etc/systemd/system/slock@.service}
[Unit]
Description=Lock X session using slock for user %i
Before=sleep.target

[Service]
User=%i
Environment=DISPLAY=:0
ExecStartPre=/usr/bin/xset dpms force suspend
ExecStart=/usr/bin/slock

[Install]
WantedBy=sleep.target
```

```bash
sudo systemctl enable slock@neonew.service
```

# slick-greeter

```bash
yay -S lightdm-slick-greeter
```

HiDPI worked out of the box.  
I've changed the background image in */etc/lightdm/slick-greeter.conf*.

To test it without going to suspend, you can run `dm-tool switch-to-greeter`.

# Power saving

This is what powertop suggested me.

powertop suggested min_power, but Arch Wiki says it might lose data and doesn't save much more power.

```{data-filename=/etc/udev/rules.d/hd_power_save.rules}
ACTION=="add", SUBSYSTEM=="scsi_host", KERNEL=="host*", ATTR{link_power_management_policy}="med_power_with_dipm"
```

This is for the fingerprint reader. Doesn't work anyway.

```{data-filename=/etc/udev/rules.d/50-usb_power_save.rules}
ACTION=="add", SUBSYSTEM=="usb", TEST=="power/control", ATTR{idVendor}=="27c6", ATTR{idProduct}=="5395", ATTR{power/control}="auto"
```

```{data-filename=/etc/udev/rules.d/pci_pm.rules}
SUBSYSTEM=="pci", ATTR{power/control}="auto"
```

*/etc/sysctl.d/98-powersaving.conf*

```{data-filename=/etc/sysctl.d/98-powersaving.conf}
vm.dirty_writeback_centisecs = 1500
```

On idle I get ~7W power consumption.

# smbios-thermal-ctl

You can switch between different presets for your CPU, depending on your preference power vs. battery life.

```bash
sudo pacman -S libsmbios
sudo smbios-thermal-ctl --info
sudo smbios-thermal-ctl --get-thermal-info
sudo smbios-thermal-ctl --set-thermal-mode=Balanced
```

See also here: [mtorressahli/linuxXPS9570](https://github.com/mtorressahli/linuxXPS9570)

# Albert

{% image "albert.jpg" %}

```bash
sudo pacman -S albert
sudo pacman -S muparser
```

```{data-filename=~/.config/albert/albert.conf}
[General]
frontendId=org.albert.frontend.qmlboxmodel
hotkey=Alt+F9
showTray=false
telemetry=false
terminal=xfce4-terminal --drop-down

[org.albert.extension.applications]
enabled=true

[org.albert.extension.calculator]
enabled=false

[org.albert.extension.hashgenerator]
enabled=true

[org.albert.extension.terminal]
enabled=true

[org.albert.extension.virtualbox]
enabled=true

[org.albert.frontend.qmlboxmodel]
alwaysOnTop=true
clearOnHide=false
hideOnClose=false
hideOnFocusLoss=true
showCentered=true
stylePath=/usr/share/albert/org.albert.frontend.qmlboxmodel/styles/BoxModel/MainComponent.qml
windowPosition=@Point(289 94)

[org.albert.frontend.widgetboxmodel]
alwaysOnTop=true
clearOnHide=false
displayIcons=true
displayScrollbar=false
displayShadow=true
hideOnClose=false
hideOnFocusLoss=true
itemCount=5
showCentered=true
theme=DarkOrange
```

# Not working

- Fingerprint reader
