---
title: "Single-Board Computers: Benchmarks"
date: 2024-09-08T14:00:00+02:00
tags: ['single board computer', 'raspberrypi', 'radxa', 'orangepi']
draft: true
---

Here are the results of my very non-scientific benchmarks for personal use.

https://chart-studio.plotly.com/~gerrit/522/#/

# General

Images used:

- Radxa Zero 3W: `Armbian_24.8.1_Radxa-zero3_bookworm_vendor_6.1.75.img.xz`
  uname -a: `Linux radxa-zero3 6.1.75-vendor-rk35xx #1 SMP Wed Aug 21 11:45:59 UTC 2024 aarch64 GNU/Linux`
  sysbench --version: `1.0.20`
- Orange Pi Zero 2W: `Armbian_community_24.11.0-trunk.25_Orangepizero2w_bookworm_current_6.6.44_minimal.img.xz`
  uname -a: `Linux orangepizero2w 6.6.44-current-sunxi64 #1 SMP Sat Aug  3 06:54:42 UTC 2024 aarch64 GNU/Linux`
  sysbench --version: `1.0.20`
- Raspberry Pi Zero 2W: `2024-07-04-raspios-bullseye-armhf-lite.img.xz`
  uname -a: `Linux mypi 6.6.47+rpt-rpi-v7 #1 SMP Raspbian 1:6.6.47-1+rpt1 (2024-09-02) armv7l GNU/Linux`
  sysbench --version: `1.0.20`

# 1-Core CPU

```bash
sysbench cpu --cpu-max-prime=10000 --events=50000 --time=0 --threads=1 run
```

i7-1185G7 @ 2GHz: 31.8s
Radxa Zero 3W: 51.3s
OrangePi Zero 2W: 67.0s
Raspberry Pi Zero 2W: 

# All-Cores CPU

```bash
sysbench cpu --cpu-max-prime=10000 --events=50000 --time=0 --threads=4 run
```

i7-1185G7 @ 2GHz: 8.0s
Radxa Zero 3W: 12.9s
OrangePi Zero 2W: 16.8s

# Power consumption and temperature

Room temperature: ~20 ºC

Radxa Zero 3W @ sysbench
    Idle: 1.2 W / 48 ºC
    After Poweroff: **1.0 W** (really bad)
    1-Core: 1.6 W / 54 ºC
    4-Core: 2.7 W / 69 ºC

Radxa Zero 3W @ stress
    1-Core: 1.9 W / 60 ºC
    4-Core: 2.7 W / 85 ºC

OrangePi Zero 2W @ sysbench
    Idle: 0.8 W / 49 ºC
    After Poweroff: 0.25 W
    1-Core: 1.1 W / 54 ºC
    4-Core: 1.5 W / 60 ºC

OrangePi Zero 2W @ stress
    1-Core: 1.2 W / 57 ºC
    4-Core: 1.5 W / 66 ºC

Raspberry Pi Zero 2W @ sysbench
    Idle: 0.6 W / 51 ºC
    After Poweroff: 0.27 W
    1-Core: 1.1 W / 59 ºC
    4-Core: 1.5 W / 60 ºC

Raspberry Pi Zero 2W @ stress
    1-Core: 1.2 W / 57 ºC
    4-Core: 1.5 W / 66 ºC

# Notes on Raspberry Pi performance

[Make sure](https://linuxconfig.org/how-to-check-raspberry-pi-model)
the `scaling_governor` is either set to `ondemand` or `performance`:

```bash
echo performance | sudo tee /sys/devices/system/cpu/cpu0/cpufreq/scaling_governor
```
