---
layout: cheatsheet
tags: #record-screen #screencast
section:
  - name: Record screencasts (lossless)
    commands:
      4K: ffmpeg -video_size 3840x2160 -framerate 30 -f x11grab -i :0.0 -c:v libx264rgb -qp 0 -preset ultrafast capture.mp4
      Downscaled to 1920x1080: ffmpeg -video_size 3840x2160 -framerate 30 -f x11grab -i :0.0 -vf scale=1920:1080 -c:v libx264rgb -qp 0 -preset ultrafast capture.mp4
      With audio you hear, but without microphone (use 'pacmd list-sources'): ffmpeg -f pulse -i alsa_output.pci-0000_00_1f.3.analog-stereo.monitor -video_size 3840x2160 -framerate 30 -f x11grab -i :0.0 -c:v libx264rgb -qp 0 -preset ultrafast capture.mp4
      With both, speakers and microphone audio: ffmpeg -f pulse -ac 2 -i alsa_output.pci-0000_00_1f.3.analog-stereo.monitor -f pulse -ac 1 -i alsa_input.pci-0000_00_1f.3.analog-stereo -filter_complex amix=inputs=2 -video_size 3840x2160 -framerate 30 -f x11grab -i :0.0 -c:v libx264rgb -qp 0 -preset ultrafast capture.mp4
---
