---
title: Record Screencasts on Linux
date: 2016-11-13T00:00:00+07:00
tags: ['ffmpeg', 'screencast', 'recording']
---

# Useful FFMPEG commands for recording your screen

```bash
# Record screen without audio. Replace 3840x2160 with your resolution.
# The video is lossless, because of the -qp 0 flag.
ffmpeg -video_size 3840x2160 -framerate 30 -f x11grab -i :0.0 -c:v libx264rgb -qp 0 -preset ultrafast capture.mp4

# Record screen without audio, downscaled to 1920x1080
ffmpeg -video_size 3840x2160 -framerate 30 -f x11grab -i :0.0 -vf scale=1920:1080 -c:v libx264rgb -qp 0 -preset ultrafast capture.mp4

# Record screen with the audio you hear, but without microphone.
# Use "pacmd list-sources" to find your device name, see below.
ffmpeg -f pulse -i alsa_output.pci-0000_00_1f.3.analog-stereo.monitor -video_size 3840x2160 -framerate 30 -f x11grab -i :0.0 -c:v libx264rgb -qp 0 -preset ultrafast capture.mp4

# Record screen with both, speakers and microphone audio.
ffmpeg -f pulse -ac 2 -i alsa_output.pci-0000_00_1f.3.analog-stereo.monitor -f pulse -ac 1 -i alsa_input.pci-0000_00_1f.3.analog-stereo -filter_complex amix=inputs=2 -video_size 3840x2160 -framerate 30 -f x11grab -i :0.0 -c:v libx264rgb -qp 0 -preset ultrafast capture.mp4
```

# Description

Hi, I tried to record a screencast on Linux.

There are good working tools already out there, a very easy one to use is Kazam.

However, I was looking for a tool which can downscale the video, while still recording the speakers audio and my microphone.

So, Kazam is easy to use but you can't configure much. It has no option to downscale the video.

SimpleScreenRecorder offers way more options, especially for encoding, but it is not easy to record speakers and microphone.

I ended up using ffmpeg, a user-unfriendly command line tool. It worked, but audio was very low volume. Please see below for the audio fix.

# Fixing the colors

While SimpleScreenRecorder recorded the colors of the screen as they were, I had slightly shifted colors in ffmpeg and Kazam. I was able to fix it for ffmpeg by using libx264rgb instead of libx264. See the screenshot below, top is wrong colors, bottom is correct colors:

{% image "ffmpeg-wrong-colors.png", "FFmpeg wrong colors" %}

# Fixing the audio

I figured out the volume of my PulseAudio device was set to 20% for whatever reason.

So first, list all your PulseAudio devices:

```bash
pacmd list-sources
# To get a shorter list use this:
pacmd list-sources|awk '/index:/ {print $0}; /name:/ {print $0}; /device\.description/ {print $0}'
```

On my PC, the output looks like this:

```bash
index: 0
name: <alsa_output.pci-0000_00_1f.3.analog-stereo.monitor>
device.description = "Monitor of Internes Audio Analog Stereo"
* index: 1
name: <alsa_input.pci-0000_00_1f.3.analog-stereo>
device.description = "Internes Audio Analog Stereo"
```

The following command set the volume level to 100%, you can validate it by calling "pacmd list-sources" again.

```bash
pactl set-source-volume "alsa_output.pci-0000_00_1f.3.analog-stereo.monitor" 100%
```
