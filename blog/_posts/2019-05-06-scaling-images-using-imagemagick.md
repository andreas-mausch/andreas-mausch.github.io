---
layout: post
title:  "Scaling images using imagemagick"
date:   2019-05-06 22:00:00 +02:00
tags:
---

Just a useful command I use to downscale my images, for example to share them on social media.

```
magick mogrify -resize 1920x1080\> -quality 85 -auto-orient -strip *.jpg
```

Some explaination:

- magick comes with two similar tools for image modification: convert and mogrify. mogrify should be used if you want to replace the original file, convert if you want to save the modified output to a different file.
- resize scales the image. the ">" at the end says it shouldn't upscale any images. Note that magick automatically keeps the original aspect ratio. See more [here](https://imagemagick.org/script/command-line-processing.php#geometry).
- quality sets the jpeg compression
- auto-orient will rotate the image accordingly to it's exif metadata
- strip will remove any exif metadata afterwards. I do this because I usually don't want to share private data like GPS locations, which is stored in exif.
