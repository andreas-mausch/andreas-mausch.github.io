---
layout: cheatsheet
tags: image-processing
section:
  - name: Image modification
    commands:
      Downscale: "magick mogrify -auto-orient -strip -resize \"1920x1920>\" -quality 85 *.jpg"
      Convert to webp: "magick convert -auto-orient -strip -resize \"600x600>\" -quality 75 -define webp:method=6 -define webp:use-sharp-yuv=1 image.jpg image.webp"
      Batch processing: "for i in *.jpg; do magick convert /* your options */ $i ${i/.jpg/.webp}; done"
---
