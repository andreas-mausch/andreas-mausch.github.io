---
title: "Radxa Zero 3W"
date: 2024-09-08T14:00:00+02:00
tags: ['single board computer', 'radxa', 'armbian']
draft: true
---

I have found an alternative to the Raspberry Pi Zero and decided to try it.
It is available up to 8 GB of RAM, which is great.

It allows you to run a small, decent web app together with a RabbitMQ and a small PostgreSQL / MongoDB database.

I like the Zero the most of all Pis because of it's power efficiency and power draw on idle.

# Flashing the image (Armbian)

```bash
xzcat ./Armbian_24.8.1_Radxa-zero3_bookworm_vendor_6.1.75.img.xz | sudo dd of=/dev/mmcblk0 bs=8M oflag=sync status=progress
```

Follow the [post here]({% link-post "2024-08-31-single-board-computer-headless-setup" %})
to do a full headless setup.

# Insert the SD card into the Zero

Correct direction: Insert the card so it's text description shows to the **outside** (away from the board).

TODO Insert image

# WiFi speed

To me, it seemed a bit slow, about 1 MB/s.

I have not further tested it, so I am not sure if a missing antenna is the problem or
my internet connection. But for the latter I think it shouldn't be the problem here.

# Stop flashing LED

By default, the LED shows a `heartbeat` pattern if everything is ok.
For a first test it is useful, but despite that I find it distracting,
so here is how you can change it:

```bash
# Show all possible values
cat /sys/class/leds/board-led/trigger

# Examples how to change it
echo none | sudo tee /sys/class/leds/board-led/trigger
echo default-on | sudo tee /sys/class/leds/board-led/trigger
echo timer | sudo tee /sys/class/leds/board-led/trigger
echo heartbeat | sudo tee /sys/class/leds/board-led/trigger
```

I couldn't lower the (very high) brightness, though.
The only available values are 0 and 1.

```bash
cat /sys/class/leds/board-led/brightness
echo 0 | sudo tee /sys/class/leds/board-led/brightness
echo 1 | sudo tee /sys/class/leds/board-led/brightness
```

# Temperature

```bash
sudo apt install lm-sensors
sudo sensors
```

Temperature in idle was like 55ºC on a hot summer day, which was quite high in my opinion.

100% load on 1 core: 66ºC
100% load on all 4 cores: 85ºC (is this a limit configured somewhere?)

I guess the limit is configured here:

```shell-session
$ cat /sys/class/thermal/thermal_zone0/trip_point_1_temp
85000
```

https://chatgpt.com/c/66dc7283-2768-8004-8ee4-067cf4d970e1

Compare to Raspberry Pi:
https://picockpit.com/raspberry-pi/does-the-raspberry-pi-zero-2-require-a-heatsink/
https://andrejacobs.org/b24/electronics/raspberry-pi-zero-2-w-temperature-and-power-consumption/

# Install Docker

This link helped:
[https://gist.github.com/serafdev/2914392a6c0a3650cd4b047909544ce7](https://gist.github.com/serafdev/2914392a6c0a3650cd4b047909544ce7)

```bash
curl -fsSL https://download.docker.com/linux/debian/gpg | sudo gpg --dearmor -o /etc/apt/keyrings/docker.gpg
echo "deb [arch=$(dpkg --print-architecture) signed-by=/etc/apt/keyrings/docker.gpg] https://download.docker.com/linux/debian $(lsb_release -cs) stable" | sudo tee /etc/apt/sources.list.d/docker.list > /dev/null
sudo apt update
sudo apt install docker-ce docker-ce-cli containerd.io docker-compose-plugin
sudo usermod -aG docker $USER
```

```bash
docker run -it --rm -p 8080:80 nginx
```

Now you can hit [http://radxa:8080/](http://radxa:8080/) and a nginx page should show up.

# Benchmark

```bash
docker run -it --rm --network none e7db/geekbench:5
```

The first run (on the 1 GB model) crashed in *Multi-Core / Running Camera*, most likely due to out-of-memory.

So I tried to re-run it on the 8 GB model.
It went through, but I couldn't find a way to see the results without uploading them to the server.

I've tried this, but the CLI geekbench in this docker image doesn't have the options shown
[here](http://support.primatelabs.com/kb/geekbench/geekbench-5-pro-command-line-tool):

```bash
docker run -it --rm --network none -v .:/opt/my-geekbench e7db/geekbench:5 --no-upload --export-csv --save /opt/my-geekbench/result.csv
```

So I ended up enabling network, so it can upload the results to the geekbench server.

```bash
docker run -it --rm e7db/geekbench:5
```

Result: https://browser.geekbench.com/v5/cpu/22846472

Single-Core Score: 147
Multi-Core Score: 430

# eMMC

TODO
