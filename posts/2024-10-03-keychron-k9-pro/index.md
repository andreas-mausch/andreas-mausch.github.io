---
title: "Keychron K9 Pro QMK/VIA"
date: 2024-10-03T20:00:00+01:00
tags: ['mechanical keyboard', 'fn+left', 'via', 'vial', 'qmk', 'firmware']
---

I have bought a *Keychron K9 Pro* some months ago (I still love my [K8 TKL]({% link-post "2023-02-27-keyboard-layouts" %}) though).

I like it a lot, and one reason to buy it was it's open-source firmware *Quantum Mechanical Keyboard*.
Check their [website](https://qmk.fm/) or [repo](https://github.com/qmk/qmk_firmware).

The mappings for all keys can be redefined to your preferences via [VIA](https://www.caniusevia.com/),
which is very handy on a 60% keyboard where you will need to have combos for some inputs.

Today I tried to compile the firmware QMK myself, and tried to follow the instructions from Keychron.

# The (outdated) repository

The first thing I have noticed: Their link from the product page goes to
[https://github.com/Keychron/qmk_firmware/tree/bluetooth_playground/keyboards/keychron/k9_pro](https://github.com/Keychron/qmk_firmware/tree/bluetooth_playground/keyboards/keychron/k9_pro)

Neither is that the official QMK repo, nor is it on a `master` branch,
but rather on the one named `bluetooth_playground`.
This is a production keyboard, I don't think the firmware should be on something called playground..

Then I discovered a binary file `firmware/keychron_k9_pro_ansi_rgb_via.bin` and I was a bit shocked,
because I feared this would be a blob and no real open-source.
However, we will find out that we will be able to build this .bin file ourselves.

The last change in this directory was made over one year ago, and it is
4716 commits behind the official QMK repo, which is disappointing.
Especially, since [some Keychron keyboards](https://github.com/qmk/qmk_firmware/tree/master/keyboards/keychron)
are merged into the official repo already.

[When will the bluetooth_playground branch be merged into master and in the main QMK repo?](https://github.com/Keychron/qmk_firmware/issues/145)

# Building the firmware

The instructions are like *just call make*, and it didn't work for me in the first runs.
But I finally figured it out and here is how:

```bash
cd /tmp/
# I have used 613719b66db811d4795c87eb5efb99f4fe7eed97
git clone https://github.com/Keychron/qmk_firmware.git
cd qmk_firmware/
git checkout bluetooth_playground
git submodule init
git submodule update

# The exact version of the image I have used is:
# qmkfm/qmk_cli@sha256:d8ebfab96c46d3ab948dd4e87be8a976095bd31268700021a74716cbd6e5b4c1
docker run -it --rm -u $(id -u):$(id -g) --workdir /home/keychron -e HOME=/home/keychron --volume .:/home/keychron qmkfm/qmk_cli bash -c 'pip3 install -r requirements.txt && make keychron/k9_pro/ansi/rgb:default'
docker run -it --rm -u $(id -u):$(id -g) --workdir /home/keychron -e HOME=/home/keychron --volume .:/home/keychron qmkfm/qmk_cli bash -c 'pip3 install -r requirements.txt && make keychron/k9_pro/ansi/rgb:via'
```

This will build you two .bin files, which then can be flashed to your keyboard.

# Flashing the firmware

Be careful here, I haven't tried it yet.
Flashing is always risky, so be careful.

## using QMK Toolbox

I haven't done this yet, but here are some instructions:

> Factory Reset: Press fn1 + J + Z for 4 seconds until all the backlight flashes.
> 1. Download the K9 Pro firmware [below](https://cdn.shopify.com/s/files/1/0059/0630/1017/files/k9_pro_ansi_rgb_v1.00.bin?v=1682588151).
> 2. Download the QMK Toolbox [link](https://github.com/qmk/qmk_toolbox/releases)
> 3. Unplug the power cable from the keyboard.
> 4. Open the QMK Toolbox.
> 5. Remove the space bar keycap to find the reset button on the left side of the space bar switch on the PCB.
> 6. Slide the switch toggle on the side of the keyboard to "Off" and connect the USB cable. Hold down the "Reset" button under the space bar, and then slide the toggle to "Cable".
> 7. The keyboard will enter into DFU mode. Then, the QMK Toolbox will display in yellow words "***DFU device connected".
> 8. Click "Open" on the top right and choose the K9 Pro firmware. Then, click "Flash" to start flashing the firmware (Note: Do NOT unplug the power cable while flashing).
> 9. Wait a few seconds until you see the content below, it means the keyboard has flashed successfully. 
> 10. Factory reset the keyboard again by press fn1 + J + Z for 4 seconds until all the backlight flashes.
>
> If VIA can't pair with your K9 Pro after flashed the firmware, you may follow these steps:
> 1. Reconnect the power cable with your keyboard.
> 2. Download the Keychron K9 Pro keymap JSON file if you haven't.
> 3. Open online VIA and turn on "Show Design tab" on "Settings" tab.
> 4. Click on "Design" tab, then click on "Confirm".
> 5. Drag the JSON file into the “Design” tab on the VIA.
> 6. A window will pop out after you drag the JSON file, please click on "Keychron K9 Pro" and then click on "Connect".
> 7. You should see the keyboard's keymap on the Configure tab now. 
>
> -- [https://keychron.ca/pages/how-to-factory-reset-and-flash-firmware-for-your-k9-pro-keyboard](https://keychron.ca/pages/how-to-factory-reset-and-flash-firmware-for-your-k9-pro-keyboard)

They link to QMK Toolbox 0.2.2, but you might try a more recent version.

## using QMK CLI

```bash
qmk flash -kb <my_keyboard> -km <my_keymap>
```

[QMK: Flash your Keyboard from the Command Line](https://docs.qmk.fm/newbs_flashing#flash-your-keyboard-from-the-command-line)

## Some warning from reddit

> I've read countless threads on Reddit on using custom QMK builds with various K* Pro models. Pretty much every attempt seems to have ended in a compromise of some sort, e.g. VIA support breaking. This post outlines the most credible steps I've found so far: https://www.reddit.com/r/Keychron/comments/13a587z/comment/jybchiz/
> The key part missing from other reports is to use a VIA V3 compatible JSON config found on this open PR https://github.com/the-via/keyboards/pull/1885/files (or https://github.com/adophoxia/adophoxia-keyboards/tree/keychron-v3-update-k_pro-q_pro/v3/keychron)
> -- [https://www.reddit.com/r/Keychron/comments/17oea9c/flashing_qmk_firmware_to_k_line/](https://www.reddit.com/r/Keychron/comments/17oea9c/flashing_qmk_firmware_to_k_line/)

# What about Vial?

> Vial is an open-source cross-platform GUI and a QMK fork for configuring your keyboard in real time.
> -- [https://github.com/vial-kb](https://github.com/vial-kb)

I haven't tried it yet.
I might be a good alternative.

I've heard it is from a time when VIA wasn't open-sourced yet.
