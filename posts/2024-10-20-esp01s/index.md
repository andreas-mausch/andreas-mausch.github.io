---
title: "ESP-01S programming in Rust"
date: 2024-10-20T15:00:00+01:00
tags: ['arduino', 'embedded', 'rust', 'gcc', 'esp8266']
toc: true
thumbnail: esp-01s.jpg
---

{% image "esp-01s.jpg" %}

Today I've spent some hours trying to figure out if I could
write programs for the ESP-01S SoC with the ESP8266 microcontroller
using my favorite programming language Rust.

Long story short: I finally got it working, but the API is limited under Rust.

As always, all my example CLI commands are executed on Manjaro Linux.

# Tools and requirements

## Add udev rule to grant access to the USB serial device

I use the *Wishiot ESP-01S*, which has a nice switch to flip
between PROG (flash mode) and UART (run the program mode).

By default, only root can access the serial port of the device.
To change that, I did this:

```{data=filename=/etc/udev/rules.d/60-esp01.rules}
SUBSYSTEMS=="usb", ATTRS{idVendor}=="1a86", ATTRS{idProduct}=="7523", GROUP="plugdev", MODE="0666"
```

```bash
sudo udevadm control --reload-rules
sudo udevadm trigger
```

Verify access:

```bash
ls -lah /dev/ttyUSB1
cat /dev/ttyUSB1
```

## Install C toolchain.

> The ESP8266 is a custom architecture known as Xtensa that was created
> for the ESP line of chips. There is no current upstream support in LLVM
> for this architecture and as such no upstream rust support.
> -- https://www.reddit.com/r/rust/comments/tfpjgm/i_have_an_esp8266_and_i_want_to_learn_how_to/

[Standard Setup of Toolchain for Linux](https://docs.espressif.com/projects/esp8266-rtos-sdk/en/latest/get-started/linux-setup.html)

You can install this package:

```bash
paru -S xtensa-lx106-elf-gcc-bin
```

It will install `gcc`, `gdb`, `ld` and so on inside `/opt/xtensa-lx106-elf-gcc/bin`.

## Install Rust toolchain using espup

We will also need to have the Rust tools like `rustc`, `cargo`, etc. in a version which supports the ESP-01S.

Now this was tricky, mainly due to a bug(?) that caused the Rust target not being included in the toolchain:

[Support for xtensa-esp8266-none-elf removed in 1.81](https://github.com/esp-rs/rust/issues/237)

It took me hours to figure that out, also because Rust cross-compiling is something new to me.
I've tried a lot of different approaches and none of them worked, until I found the issue above.

They even state in [this issue](https://github.com/esp-rs/espup/issues/191#issuecomment-1443322779) that:

> Support for Rust in ESP8266 is limited, and I don't think
> we should add support for it in espup.
> I would recommend you to switch to any of the ESP32s.
> -- https://github.com/esp-rs/espup/issues/191

It still works however, but you need to select a version which brings
support for the `xtensa-esp8266-none-elf` target.

```bash
sudo pacman -S espup
espup install --toolchain-version 1.80.0.0
source ~/export-esp.sh
```

## esptool

After compilation, the final program is flashed to the chip over the serial port.
For that, we need a program.

The official tool from the vendor to flash the chip is `esptool`:
[https://github.com/espressif/esptool](https://github.com/espressif/esptool)

```bash
sudo pacman -S esptool
```

## cargo-espflash

An alternative to `esptool` is the nice cargo extension here:
[cargo-espflash](https://github.com/esp-rs/espflash)

The recent version doesn't [support the ESP8266 any more](https://github.com/esp-rs/espflash/issues/519),
which is a bit sad.

So make sure to install the latest 2.x version like this:

```bash
cargo install cargo-espflash@2.1.0 --locked
```

For me, this failed due to an unmaintained third-party crate named `minimal-lexical`,
which is not compatible with the latest version of Rust:
[Error when installing 2.1.0 for ESP8266 support](https://github.com/esp-rs/espflash/issues/690)

So I used the binary pre-compiled version of it:

```bash
sudo pacman -S cargo-binstall
cargo binstall cargo-espflash@2.1.0
```

# Flashing the original AT firmware

In case something went wrong you might want to
return to the original state of the chip.

To do that, you can flash the official firmware back to it.

It was tricky to do that, because there is no easy download.
The memory on the SoC is limited to firmwares with a maximum size of 1 MB,
and the latest official firmware is bigger than that.

> AT 1.7.5 (SDK 3.0.5) has a 512 kB version (requires a 1 MB flash). esp-01S have 1 MB flash a.f.a.i.k.
> AT 2 1MB version is not published. I have a build. but AT 1.7.5 is a better option.
> -- [https://www.esp8266.com/viewtopic.php?p=93214](https://www.esp8266.com/viewtopic.php?p=93214)

According to this official page, the 2.2.0.0 firmware has a 1 MB version:

> release/v2.2.0.0_esp8266 branch and download esp8285-1MB-at under the Artifacts
> https://docs.espressif.com/projects/esp-at/en/release-v2.2.0.0_esp8266/AT_Binary_Lists/ESP8266_AT_binaries.html

The action I found [here](https://github.com/espressif/esp-at/actions/runs/9807419826) indeed has a
`esp8285-1MB-at` artifact, however, it is expired.

Here is an extensive article about it, which also contains a link
to a pre-built binary, which we will also use:

[https://www.sigmdel.ca/michel/ha/esp8266/ESP01_AT_Firmware_en.html](https://www.sigmdel.ca/michel/ha/esp8266/ESP01_AT_Firmware_en.html)

[Direct link to the firmware binary](https://github.com/sigmdel/other_releases/raw/refs/heads/main/espat_esp01.zip)

He names the risks of using it like this:

> Not everyone has a GitHub account, and without it, it will be difficult
> to get the latest esp8285-1MB-at.zip. Consequently, I have made the modified
> binary espat_esp01.bin available from my account in the other_releases repository.
> Understand that this is really only for those that want to try ESP8266-AT on an ESP-01S.
> The file, created on September 5, 2023, will not be updated as new versions of ESP-AT
> are made available, so that it will soon be necessary to use the procedure described
> above to get an up-to-date version of the firmware.
> -- [https://www.sigmdel.ca/michel/ha/esp8266/ESP01_AT_Firmware_en.html](https://www.sigmdel.ca/michel/ha/esp8266/ESP01_AT_Firmware_en.html)

For me that version is enough for testing around, and it worked perfectly. Thank you, Michel.

Here is the command I used for flashing:

```bash
esptool.py -p /dev/ttyUSB1 -b 115200 write_flash -e -fm qio -ff 40m -fs 1MB 0 espat_esp01.bin
```

There is more detail about the memory addresses, and which parts belong where.
I don't know anything about it yet, but I also found this command, but haven't used it:

```bash
esptool.py write_flash 0x00000 boot_v1.2.bin 0x01000 at/512+512/user1.1024.new.2.bin 0xfc000 esp_init_data_default_v08.bin 0x7e000 blank.bin 0xfe000 blank.bin
```

We will later see cargo also flashes the `0x01000` area.

# Testing the serial connection with AT-commands

You can execute commands on the AT-firmware to see if your connection is set up properly.
This is not completely new to me, I've seen this kind of commands on modems before.

```bash
sudo pacman -S screen picocom
picocom /dev/ttyUSB1 --baud 115200 --omap crcrlf
```

This will open a pipe and you can type in commands.

Here are some commands:

| Command    | Description                                                  |
|------------|--------------------------------------------------------------|
| AT         | Test AT startup (just returns OK)                            |
| AT+CMD     | List all AT commands and types supported in current firmware |
| AT+RST     | Restart module                                               |
| AT+GMR     | View version info                                            |
| AT+RESTORE | Factory Reset                                                |

And here is the full list:
[https://www.espressif.com/sites/default/files/4a-esp8266_at_instruction_set_en_v1.5.4_0.pdf](https://www.espressif.com/sites/default/files/4a-esp8266_at_instruction_set_en_v1.5.4_0.pdf)

Press CTRL+A followed by CTRL+X to exit picocom.

# A hello-world in Rust

I found a project which does exactly what I am trying to achieve:
[coenraadhuman/blinky-esp8266-rust](https://github.com/coenraadhuman/blinky-esp8266-rust/)

However, it is a bit dated and uses a `esprs/espflash` docker image,
which is also dated.
I prefer to run the compilation without docker on my machine.

So here is my version of it:

[andreas-mausch/blinky-esp8266-rust](https://github.com/andreas-mausch/blinky-esp8266-rust)

You can find instructions how to build it in the README.

## Make sure you use the right Rust toolchain

You need to use the `esp` toolchain, otherwise it won't compile.

Check with `rustup toolchain list`.

This file will set the right toolchain for your project:

```{data=filename=./rust-toolchain.toml}
[toolchain]
channel = "esp"
```
