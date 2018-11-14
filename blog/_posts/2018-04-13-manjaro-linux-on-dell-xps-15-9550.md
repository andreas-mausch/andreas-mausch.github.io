---
layout: post
title:  "Manjaro Linux on Dell XPS 15 9550"
date:   2018-04-13 20:00:00 +02:00
tags:
---

Below is a list of how I configured my laptop. Most is personal preference, some settings might affect more users. Maybe someone find it useful.

# My device

I use the XPS 15 9550 in the maxed-out configuration.

- Intel i7-6700HQ
- 32 GB DDR4-2133MHz
- 4K (Ultra-HD) Display
- 1 TB SSD (Toshiba)

# Preparation

Previously, I've had Linux Mint 18.3 installed, together with Windows 7 in a dual-boot configuration.
I've made a mistake during the Manjaro setup and accidentally overwritten my */boot* partition.

So after the installation finished I couldn't boot Windows anymore, but that could be fixed by calling some Windows repair commands.
Unfortunately, they can only be called from the Windows Setup. So you need a bootable USB stick with Windows 7 setup files.
Windows 7 can only be installed when your disk is set to AHCI mode in the BIOS.
I've created my USB stick via Rufus. Make sure you choose "GPT partition for UEFI". Afterwards, I also needed some drivers for the SSD, in my case Toshiba OCZ. They need to be integrated into the setup files before continuing (I've used DISM GUI to do it), otherwise Windows Setup won't find your disk.

When Windows setup is started, execute these commands:

```
Bootrec /fixmbr
Bootrec /fixboot
Bootrec /rebuildbcd
```

For some reason I had to call them a couple of tries until the files in */boot/efi/EFI/Microsoft/Boot/* were recovered, not sure why.

*Important*: You need to boot from the USB stick via EFI. If you boot in legacy mode, Windows Setup will complain that the
installed version is not compatible.

# Post Installation

## HiDPI

Linux is still a big pain when it comes to out-of-the-box support for HiDPI displays, which are too common nowadays to not care about them.
Linux is lacking behind in this regard and I don't understand why I have to run any of the commands below manually. :(

### Grub

Grub is really old and has 1500ms reaction time when used on a 4K screen. :/
However, until I get [EFISTUB](https://wiki.archlinux.org/index.php/EFISTUB) to work I have to use it.
Fonts are too small by default, this can be fixed by calling:

```
sudo grub-mkfont --output=/boot/grub/fonts/DroidSansMono32.pf2 --size=32 /usr/share/fonts/TTF/DroidSansMono.ttf
```

Then, edit or create an entry in */etc/default/grub*:

```
GRUB_FONT=/boot/grub/fonts/DroidSansMono32.pf2
```

### Manjaro

Open Settings Manager → Appearance → Fonts (in German it's Einstellungen → Erscheinungsbild → Schriften) and overwrite the DPI value (I set mine to 192).

### Gnome, GTK+

Add to ~/.profile:

```
export GDK_SCALE=2
export GDK_DPI_SCALE=0.5
```

### TTY

You can open the Linux console if you press CTRL+ALT+F2 (go back to graphical UI: CTRL+ALT+F7). To make fonts bigger here as well, make sure you have the font inside */usr/share/kbd/consolefonts/* and edit or create the file */etc/vconsole.conf*:

```
KEYMAP=de-latin1-nodeadkeys
FONT=ter-132n
FONT_MAP=8859-2
```

(Choose your own Keymap of course.)

## Terminal

By default, Manjaro has this weird collapsible terminal. I don't like it too much, so I've decided to change it back to classic mode.
Therefore, I've rebound the CTRL+ALT+T shortcut to *xfce4-terminal*.

Unfortunately, the old xfce4-terminal works poorly with GDK_SCALE and GDK_DPI_SCALE.
Fonts looks blurred, and I hate it. I've managed to work around that by creating a file at ~/terminal.sh:

```
GDK_SCALE=1 GDK_DPI_SCALE=1 xfce4-terminal
```

`chmod +x ~/terminal.sh` and bind the shortcut to the terminal.sh.
This way, the GDK variables are set for all other programs but xfce4-terminal.
It's super-ugly, but it works well for me.

### Fish Shell

Fish is my favorite shell. I love the autocompletion features. To install it, run:

```
pacman -S fish
chsh -s /usr/bin/fish
```

To install custom themes and much more, I use [Oh-My-Fish](https://github.com/oh-my-fish/oh-my-fish):

```curl -L https://get.oh-my.fish | fish```

My favorite theme is eclm, it shows a success flag of the last command, the current git branch and if there's any changes on your current branch: ```omf theme eclm```

### Autojump

```
pacman -S autojump
```

Edit *~/.config/fish/config.fish* and append:

```
begin
    set --local AUTOJUMP_PATH /usr/share/autojump/autojump.fish
    if test -e $AUTOJUMP_PATH
        source $AUTOJUMP_PATH
    end
end
```

## Bluetooth

Bluetooth was enabled by default on each boot, which I don't like.
To disable it, append the following line to */etc/rc.local*

```
rfkill block bluetooth
```

Check it worked by calling ```rfkill list```, which should state hci0 is soft-blocked.

## Graphic card drivers, ACPI

### Block Nouveau (Nvidia driver)

Create a file */etc/modprobe.d/blacklist-nouveau.conf* with the content:

```
blacklist nouveau
options nouveau modeset=0
```

Disable the Nvidia GPU completely (this will save power, see below), create two services:

*/usr/lib/systemd/user/dgpu-off.service*

```
[Unit]
Description=Power-off dGPU
After=graphical.target

[Service]
Type=oneshot
ExecStart=/bin/sh -c "echo '\\_SB.PCI0.PEG0.PEGP._OFF' > /proc/acpi/call; cat /proc/acpi/call > /tmp/nvidia-off"

[Install]
WantedBy=graphical.target
```

*/usr/lib/systemd/user/dgpu-off-after-resume.service*

```
[Unit]
Description=Power-off dGPU after resume from suspend
After=suspend.target

[Service]
Type=simple
ExecStart=/bin/sh -c "echo '\\_SB.PCI0.PEG0.PEGP._OFF' > /proc/acpi/call; cat /proc/acpi/call > /tmp/nvidia-off"

[Install]
WantedBy=suspend.target
```

## Lock screen

I personally like i3lock-color, called with these settings:

```
i3lock --clock --blur=6 --radius=400 --timesize=100 --datesize=100 --timepos="w/2:h/2+70" --datepos="w/2:h/2-80" --datestr="%Y-%m-%d" --datecolor=ffffffff --timecolor=ffffffff --ring-width=20 -i /home/neonew/i3lock/lockscreen.png -t -n
```

*lockscreen.png* is just a one-pixel file, which has the alpha value set to 0.75 (to darken the screen).

## ulimit

Don't really know what it is, but Visual Studio Code and IntelliJ needs this value increased in */etc/security/limits.conf* (add these lines):

```
*       soft    nofile  380180
*       hard    nofile  380180
```

# Measures

## Power consumption

When the laptop was idling, I had a power consumption of ~13 W.  
(According to */sys/class/power_supply/BAT0/current_now*)

With the Nvidia GPU disabled, it was reduced to 6.5 W.  
(In both cases connected to WiFi, lowest brightness).

## Boot time

```
$ systemd-analyze
Startup finished in 7.796s (firmware) + 3.584s (loader) + 1.312s (kernel) + 2.324s (userspace) = 15.017s
graphical.target reached after 2.140s in userspace
```

## Terminal font

I use `Source Code Pro Regular` in 11pt.

## Conky

![]({{ site.baseurl }}/images/2018-04-13-manjaro-linux-on-dell-xps-15-9550/conky.jpg)

[config file]({{ site.baseurl }}/files/2018-04-13-manjaro-linux-on-dell-xps-15-9550/conkyrc.txt)

Most of it was created by [Mervyn McCreight](https://github.com/mervyn-mccreight), thanks dude.

For Autostart, create a file `~/.config/autostart/conky.desktop`:

```
[Desktop Entry]
Type=Application
Name=conky
Exec=conky --daemonize --pause=5
StartupNotify=false
Terminal=false
```

## Package manager for AUR

I like to use [yay](https://github.com/Jguer/yay).

One adjustment: In `/etc/makepkg.conf` I've set `PKGEXT='.pkg.tar'` to improve the build speed.
Otherwise it tends to spend a lot of time in the "Compressing..." step.

## Favorite editor

I like to use [Microsoft Code](https://aur.archlinux.org/packages/code-git/), in the open-source variant.

## Chromium

Chromium keeps asking me for the password of the default keyring.
I've never set it up and don't really know about it.
The bad thing is, every time Chromium gets updated, it loses all of my stored passwords
if I don't enter the keyring password.

Therefore, I've decided to store them in *plaintext* in my user directory.
This might not be recommended, but I prefer to not be annoyed on every update.

I also use multiple profiles, and Chromium remembers the last used profile.
So when you boot your system and start the first Chromium instance,
the last used profile is loaded automatically.
I like to use my personal profile on every fresh Chromium instead.

`~/.config/chromium-flags.conf`

```
--password-store=basic
--profile-directory=Default
```

# Links

[archlinux.org]: https://wiki.archlinux.org/index.php/Dell_XPS_15_(9550)
[yobi.be]: http://wiki.yobi.be/wiki/Laptop_Dell_XPS_15

* [archlinux.org]
* [yobi.be]
