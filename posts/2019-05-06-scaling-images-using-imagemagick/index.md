---
title: Scaling images using imagemagick
date: 2019-05-02T17:00:00+02:00
tags: ['imagemagick', 'scaling', 'batch-processing', 'cli']
---

# Downscale images (batch)

Just a useful command I use to downscale my images, for example to share them on social media.

```bash
magick mogrify -auto-orient -strip -resize "1920x1920>" -quality 85 *.jpg
```

Some explaination:

- magick comes with two similar tools for image modification: convert and mogrify. mogrify should be used if you want to replace the original file, convert if you want to save the modified output to a different file.
- resize scales the image. the ">" at the end says it shouldn't upscale any images. Note that magick automatically keeps the original aspect ratio. See more [here](https://imagemagick.org/script/command-line-processing.php#geometry).
- quality sets the jpeg compression
- auto-orient will rotate the image accordingly to it's exif metadata
- strip will remove any exif metadata afterwards. I do this because I usually don't want to share private data like GPS locations, which is stored in exif.

# Convert images to webp

I like to archive thumbnails of images. This way, you can store tons of images in small disk space.

```bash
magick convert -auto-orient -strip -resize "600x600>" -quality 75 -define webp:method=6 -define webp:use-sharp-yuv=1 image.jpg image.webp
```

# Create animated webp

```bash
img2webp -d 300 -lossy -m 6 -min_size -o animated.webp *.jpg
```

# Batch processing

```bash
for i in *.jpg; do magick convert /* your options */ $i ${i/.jpg/.webp}; done
```
