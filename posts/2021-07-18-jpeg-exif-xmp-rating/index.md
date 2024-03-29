---
title: "JPEG: Exif tags and XMP Rating"
date: 2021-07-18T21:00:00+02:00
tags: ['jpeg', 'file-format', 'exif', 'xmp', 'metadata', 'exiv2', 'exiftool', 'gthumb']
thumbnail: jpeg-hex-view.png
toc: true
---

I like to mark my best photos with a rating.
There are plenty of tools for the job.

Since Windows 7 (or Vista?) it was even integrated into the operating system.

However, I found there is more than one way to save the rating into the metadata
of the image, and different tools are not very compatible with each other.

Luckily, there is a defacto standard which most tools can work with: The *Rating*
tag in the XMP metadata. It was first defined by Adobe.

So I've decided to use this tag from now on. It does not depend on a platform
and can be used in almost all tools.
However..I noticed that some tools lose data when I saved a rated image file.
Not all previously existing meta tags were maintained.

That made me curious, and I now want to find a way to rate and tag my images
without losing any data.

# Analyze and display all metadata on a .jpg image

## Hex View

To get started, let's have a look at the JPEG file in a hex editor to get
a better impression of the file format.

{% image "jpeg-hex-view.png" %}

I tried to colorize some parts of the headers. Let's see what they mean..

- <span style="background-color: #7A1313; color: #FF8989; font-weight: bold">Marker SOI</span> (Start of Image)
- <span style="background-color: #337713; color: #A0ED7F; font-weight: bold">Marker APP1</span> (<span style="background-color: #16774B; color: #82EDBE; font-weight: bold">Size of marker: 62326 bytes</span>)
  - <span style="background-color: #164D77; color: #8CCCFA; font-weight: bold">Exif Magic Bytes</span>
  - <span style="background-color: #5C1377; color: #DE90FF; font-weight: bold">TIFF Header (Intel)</span>
    - <span style="background-color: #7A1369; color: #FF91F0; font-weight: bold">IFD0 Tag Count (0x0d = 13)</span>
      - <span style="background-color: #7A5945; color: #FFDEC8; font-weight: bold">Example IFD0 Exif Entry</span>  
        <span style="background-color: #7A5945; color: #FFDEC8; font-weight: bold">0x100: ImageWidth, 0xfc0 = 4032</span>
      - <span style="background-color: #595656; color: #C4C2C2; font-weight: bold">More IFD0 Exif Entries</span>
      - <span style="background-color: #7A6E45; color: #F2E9BD; font-weight: bold">Link to Exif-SubIFD</span>  
        <span style="background-color: #7A6E45; color: #F2E9BD; font-weight: bold">0x8769: ExifTag, Offset 0xee = 238</span>
    - <span style="background-color: #A5A3A3; color: #EFEFEF; font-weight: bold">Link to IFD1</span> (Thumbnail meta)  
      <span style="background-color: #A5A3A3; color: #EFEFEF; font-weight: bold">Offset 0x30a = 778</span>  
    - <span style="background-color: #7A3B13; color: #F7B68B; font-weight: bold">Referenced Strings from IFD0</span>
    - <span style="background-color: #4C2913; color: #D9B399; font-weight: bold">Referenced Rationals (X and YResolution 1/72) from IFD0</span>
    - <span style="background-color: #5D7713; color: #D2EF8B; font-weight: bold">SubIFD Tag Count (0x19 = 25)</span>

## JPEG Markers

A JPEG consists of a set of *Markers*.
I never heard of that concept before, but it feels the same as chunks.

See the list below for the most common types of markers.
(The list is from https://docs.fileformat.com/image/jpeg/).

{% image "jpeg-markers.png" %}

I found [this pdf](https://www.google.com/url?sa=t&rct=j&q=&esrc=s&source=web&cd=&ved=2ahUKEwiJtb7H0fHxAhWkJcUKHSYAAZwQFjAAegQIBxAD&url=https%3A%2F%2Fwww.waimea.de%2Fdownloads%2Fexif%2FEXIF-Datenformat.pdf&usg=AOvVaw3Cdkkfq33EEQ-8SSnPU_Wr) (german) helpful to understand the file format.

List the markers of an image:

```shell-session
$ exiv2 -pS 20210716_185532.jpg 
STRUCTURE OF JPEG FILE: 20210716_185532.jpg
 address | marker       |  length | data
       0 | 0xffd8 SOI  
       2 | 0xffe1 APP1  |   62326 | Exif..II*......................
   62330 | 0xffe4 APP4  |   17389 | ...............................
   79721 | 0xffc0 SOF0  |      17 
   79740 | 0xffdb DQT   |     132 
   79874 | 0xffc4 DHT   |     418 
   80294 | 0xffdd DRI   |       4 
   80300 | 0xffda SOS  
```

## Build exiv2 to display recursive information

You can run exiv2 with the *-pS* parameter for the structure view, but there is also
the *-pR* parameter for the recursive structure view.

However, *-pR* has been disabled [for security reasons](https://nvd.nist.gov/vuln/detail/CVE-2019-9144).
I don't really understand why the feature is completely disabled in release builds and you have no option to enable it,
but I've decided to compile exiv2 myself to enable the feature again.

```bash
git clone https://github.com/Exiv2/exiv2.git
cd exiv2/
mkdir build
cd build
cmake .. -DCMAKE_BUILD_TYPE=Debug
./bin/exiv2
```

## The APP1 Exif Marker in detail

The Exif Marker is in TIFF file format.
After the header, it contains two *Image File Directories* (IFD), IFD0 and IFD1.
IFD0 is for image tags and IFD1 for thumbnail information.

```shell-session
$ ./exiv2/build/bin/exiv2 -pR 20210716_185532.jpg 
STRUCTURE OF JPEG FILE: 20210716_185532.jpg
 address | marker       |  length | data
       0 | 0xffd8 SOI  
       2 | 0xffe1 APP1  |   62326 | Exif..II*......................
  STRUCTURE OF TIFF FILE (II): MemIo
   address |    tag                           |      type |    count |    offset | value
        10 | 0x0100 ImageWidth                |      LONG |        1 |      4032 | 4032
        22 | 0x0101 ImageLength               |      LONG |        1 |      2268 | 2268
        34 | 0x010f Make                      |     ASCII |        8 |       170 | samsung
        46 | 0x0110 Model                     |     ASCII |        9 |       178 | SM-G973F
        58 | 0x0112 Orientation               |     SHORT |        1 |         1 | 1
        70 | 0x011a XResolution               |  RATIONAL |        1 |       222 | 72/1
        82 | 0x011b YResolution               |  RATIONAL |        1 |       230 | 72/1
        94 | 0x0128 ResolutionUnit            |     SHORT |        1 |         2 | 2
       106 | 0x0131 Software                  |     ASCII |       14 |       188 | G973FXXSBFUE6
       118 | 0x0132 DateTime                  |     ASCII |       20 |       202 | 2021:07:16 18:55:32
       130 | 0x0213 YCbCrPositioning          |     SHORT |        1 |         1 | 1
       142 | 0x8769 ExifTag                   |      LONG |        1 |       238 | 238
    STRUCTURE OF TIFF FILE (II): MemIo
     address |    tag                           |      type |    count |    offset | value
         240 | 0x829a ExposureTime              |  RATIONAL |        1 |       608 | 1/362
         252 | 0x829d FNumber                   |  RATIONAL |        1 |       600 | 240/100
         264 | 0x8822 ExposureProgram           |     SHORT |        1 |         2 | 2
         276 | 0x8827 ISOSpeedRatings           |     SHORT |        1 |        50 | 50
         288 | 0x9000 ExifVersion               | UNDEFINED |        4 | 808596016 | 0220
         300 | 0x9003 DateTimeOriginal          |     ASCII |       20 |       544 | 2021:07:16 18:55:32
         312 | 0x9004 DateTimeDigitized         |     ASCII |       20 |       564 | 2021:07:16 18:55:32
         324 | 0x9010                           |     ASCII |        7 |       584 | +02:00
         336 | 0x9011                           |     ASCII |        7 |       592 | +02:00
         348 | 0x9201 ShutterSpeedValue         |  RATIONAL |        1 |       616 | 1/362
         360 | 0x9202 ApertureValue             |  RATIONAL |        1 |       624 | 252/100
         372 | 0x9203 BrightnessValue           | SRATIONAL |        1 |       632 | 1665/100
         384 | 0x9205 MaxApertureValue          |  RATIONAL |        1 |       640 | 252/100
         396 | 0x9207 MeteringMode              |     SHORT |        1 |         3 | 3
         408 | 0x9209 Flash                     |     SHORT |        1 |         0 | 0
         420 | 0x920a FocalLength               |  RATIONAL |        1 |       656 | 600/100
         432 | 0xa001 ColorSpace                |     SHORT |        1 |         1 | 1
         444 | 0xa002 PixelXDimension           |      LONG |        1 |      4032 | 4032
         456 | 0xa003 PixelYDimension           |      LONG |        1 |      2268 | 2268
         468 | 0xa402 ExposureMode              |     SHORT |        1 |         0 | 0
         480 | 0xa403 WhiteBalance              |     SHORT |        1 |         0 | 0
         492 | 0xa404 DigitalZoomRatio          |  RATIONAL |        1 |       648 | 200/100
         504 | 0xa405 FocalLengthIn35mmFilm     |     SHORT |        1 |        52 | 52
         516 | 0xa406 SceneCaptureType          |     SHORT |        1 |         0 | 0
         528 | 0xa420 ImageUniqueID             |     ASCII |       12 |       664 | L13XLLD01VM
    END MemIo
       154 | 0x8825 GPSTag                    |      LONG |        1 |       676 | 676
       780 | 0x0100 ImageWidth                |      LONG |        1 |       512 | 512
       792 | 0x0101 ImageLength               |      LONG |        1 |       288 | 288
       804 | 0x0103 Compression               |     SHORT |        1 |         6 | 6
       816 | 0x011a XResolution               |  RATIONAL |        1 |       880 | 72/1
       828 | 0x011b YResolution               |  RATIONAL |        1 |       888 | 72/1
       840 | 0x0128 ResolutionUnit            |     SHORT |        1 |         2 | 2
       852 | 0x0201 JPEGInterchangeFormat     |      LONG |        1 |       896 | 896
       864 | 0x0202 JPEGInterchangeFormatLeng |      LONG |        1 |     61422 | 61422
  END MemIo
   62330 | 0xffe4 APP4  |   17389 | ...............................
   79721 | 0xffc0 SOF0  |      17 
   79740 | 0xffdb DQT   |     132 
   79874 | 0xffc4 DHT   |     418 
   80294 | 0xffdd DRI   |       4 
   80300 | 0xffda SOS  
```

The output is a bit confusing: The addresses of the markers are file offsets (in decimal).  
The addresses of the Exif tags are relative to the Tiff header though, so you need to add

```
2 (address of APP1) + 2 (APP1 marker) + 2 (APP1 size) + 6 (TIFF Header) = 12 bytes
```

to get the file offset.  
So the Orientation for example is at offset `58 + 12 = 70 (0x46)`, it's value `1` means
*0 degrees: the correct orientation, no adjustment is required*
(Btw: This blog post: [EXIF Orientation Handling Is a Ghetto](https://www.daveperrett.com/articles/2012/07/28/exif-orientation-handling-is-a-ghetto/) is a bit dated,
but shows the meaning and compatibility in 2012).

## XMP Marker

XMP is now a completely different thing than Exif.
Both contain meta information, but they have a completely different file format and
are stored in a different way.
But.. the same image file can contain both, Exif and XMP.
Both are stored as APP1 markers, and an image can contain two (or more) APP1 markers,
one for Exif and one for XMP.
A tool can determine the type of the APP1 marker by looking for the Exif Magic bytes
(then it's a Exif header), or if the data is XML and the namespace matches XMP. Uff.

XMP was developed by Adobe and since 2012 it is standardized as ISO 16684-1:2012 (and later ISO 16684-1:2019).
The ISO download costs money, but I found [this pdf](https://wwwimages2.adobe.com/content/dam/acom/en/devnet/xmp/pdfs/XMP%20SDK%20Release%20cc-2016-08/XMPSpecificationPart1.pdf) from Adobe which describes the format.

The precessor was the [IPTC Information Interchange Model](https://en.wikipedia.org/wiki/IPTC_Information_Interchange_Model).

To display the XMP XML of a jpeg file, run one of these commands:

```bash
exiftool -xmp -b image.jpg
exiv2 -pX image.jpg
```

In my example file, there is no XMP header (yet), so there is no output.

# Rating

## exif:Rating vs. xmp:rating

See [this post](https://exiftool.org/forum/index.php?topic=3567.0).

It's a bit old (2011) and I'm not sure if the information is (still) correct, but I prefer xmp:rating as my rating tag.

I will drop all occurences of exif:Rating and exif:RatingPercent.

> Phil would know more about usage of Rating in Exif. But from my experience, "everybody" (Adobe, Canon,..) uses Xmp:Rating. That is, I never noticed there's Rating in Exif.

> Neither of the EXIF Rating tags are standard EXIF

## exiftool 12.26

Run this to rate the image.
The `-preserve` flag preserves the file modification date/time.

```bash
exiftool -preserve -rating=3 20210716_185532_exiftool-rating.jpg
```

```shell-session
$ exiftool -rating -short -groupNames 20210716_185532_exiftool-rating.jpg
[XMP]           Rating                          : 3
```

### Filesize

```shell-session
$ ls -l ../20210716_185532.jpg
-rw-r----- 1 neonew neonew 3409348 16. Jul 18:55 ../20210716_185532.jpg
$ ls -l ./20210716_185532_exiftool-rating.jpg
-rw-r----- 1 neonew neonew 3412162 16. Jul 18:55 ./20210716_185532_exiftool-rating.jpg
```

Filesize increased by 2814 bytes.

### New XMP Marker

If you compare the structure after the change, there is an addtional APP1 marker for XMP.

```shell-session
$ exiv2 -pS 20210716_185532_exiftool-rating.jpg
STRUCTURE OF JPEG FILE: 20210716_185532_exiftool-rating.jpg
 address | marker       |  length | data
       0 | 0xffd8 SOI
       2 | 0xffe1 APP1  |   62326 | Exif..II*......................
   62330 | 0xffe1 APP1  |    2812 | http://ns.adobe.com/xap/1.0/.<?x
   65144 | 0xffe4 APP4  |   17389 | ...............................
   82535 | 0xffc0 SOF0  |      17
   82554 | 0xffdb DQT   |     132
   82688 | 0xffc4 DHT   |     418
   83108 | 0xffdd DRI   |       4
   83114 | 0xffda SOS
```

### Raw XML

```shell-session
$ exiv2 -pX 20210716_185532_exiftool-rating.jpg | xmllint --format -
<?xml version="1.0"?>
<?xpacket begin='﻿' id='W5M0MpCehiHzreSzNTczkc9d'?>
<x:xmpmeta xmlns:x="adobe:ns:meta/" x:xmptk="Image::ExifTool 12.26">
  <rdf:RDF xmlns:rdf="http://www.w3.org/1999/02/22-rdf-syntax-ns#">
    <rdf:Description xmlns:xmp="http://ns.adobe.com/xap/1.0/" rdf:about="">
      <xmp:Rating>3</xmp:Rating>
    </rdf:Description>
  </rdf:RDF>
</x:xmpmeta>
<?xpacket end='w'?>
```

### Binary diff offsets

See [here]({% link-post "2021-07-17-binary-diffs" %}).

```shell-session
$ diff --changed-group-format="%08xe-%08xl (%08xn) <-> %08xE-%08xL (%08xN) %c'\012'" --unchanged-group-format="" (xxd -c 1 -ps ../20210716_185532.jpg | psub) (xxd -c 1 -ps 20210716_185532_exiftool-rating.jpg | psub)
0000005a-0000005b (00000001) <-> 0000005a-0000005b (00000001)
00000066-00000067 (00000001) <-> 00000066-00000067 (00000001)
0000007e-0000007f (00000001) <-> 0000007e-0000007f (00000001)
0000008a-0000008b (00000001) <-> 0000008a-0000008b (00000001)
000000c8-000000c8 (00000000) <-> 000000c8-000000d8 (00000010)
000000ea-000000fa (00000010) <-> 000000fa-000000fa (00000000)
00000104-00000105 (00000001) <-> 00000104-00000105 (00000001)
00000110-00000111 (00000001) <-> 00000110-00000111 (00000001)
00000140-00000141 (00000001) <-> 00000140-00000141 (00000001)
0000014c-0000014d (00000001) <-> 0000014c-0000014d (00000001)
00000158-00000159 (00000001) <-> 00000158-00000159 (00000001)
00000164-00000165 (00000001) <-> 00000164-00000165 (00000001)
000001b8-000001b9 (00000001) <-> 000001b8-000001b9 (00000001)
00000200-00000201 (00000001) <-> 00000200-00000201 (00000001)
0000022c-0000022c (00000000) <-> 0000022c-0000023c (00000010)
00000264-00000274 (00000010) <-> 00000274-00000274 (00000000)
00000294-00000296 (00000002) <-> 00000294-00000296 (00000002)
0000029c-0000029e (00000002) <-> 0000029c-0000029e (00000002)
0000f37a-0000f37a (00000000) <-> 0000f37a-0000fe78 (00000afe)
```

There seems to be some re-ordering of existing tags, but the main change is at 0xf37a (= 62330),
where the new XMP marker has been inserted.

The main goal has been achieved: No data was lost, and the new rating has been set. Great.

## exiv2 0.27.4

```bash
exiv2 --keep --Modify "set Xmp.xmp.Rating 3" 20210716_185532_exiv2-rating.jpg
```

### Filesize

```shell-session
$ ls -l ../20210716_185532.jpg
-rw-r----- 1 neonew neonew 3409348 16. Jul 18:55 ../20210716_185532.jpg
$ ls -l ./20210716_185532_exiv2-rating.jpg
-rw-r----- 1 neonew neonew 3411748 16. Jul 18:55 20210716_185532_exiv2-rating.jpg
```

Filesize increased by 2400 bytes.

### New XMP Marker

```shell-session
$ exiv2 -pS 20210716_185532_exiv2-rating.jpg
STRUCTURE OF JPEG FILE: 20210716_185532_exiv2-rating.jpg
 address | marker       |  length | data
       0 | 0xffd8 SOI
       2 | 0xffe1 APP1  |   62326 | Exif..II*......................
   62330 | 0xffe1 APP1  |    2398 | http://ns.adobe.com/xap/1.0/.<?x
   64730 | 0xffe4 APP4  |   17389 | ...............................
   82121 | 0xffc0 SOF0  |      17
   82140 | 0xffdb DQT   |     132
   82274 | 0xffc4 DHT   |     418
   82694 | 0xffdd DRI   |       4
   82700 | 0xffda SOS
```

### Raw XML

```shell-session
$ exiv2 -pX 20210716_185532_exiv2-rating.jpg | xmllint --format -
<?xml version="1.0"?>
<?xpacket begin="﻿" id="W5M0MpCehiHzreSzNTczkc9d"?>
<x:xmpmeta xmlns:x="adobe:ns:meta/" x:xmptk="XMP Core 4.4.0-Exiv2">
  <rdf:RDF xmlns:rdf="http://www.w3.org/1999/02/22-rdf-syntax-ns#">
    <rdf:Description xmlns:xmp="http://ns.adobe.com/xap/1.0/" rdf:about="" xmp:Rating="3"/>
  </rdf:RDF>
</x:xmpmeta>
<?xpacket end="w"?>
```

The XMP looks a bit different (the Rating is now an attribute on the Description tag),
but it looks fine.

### Binary diff offsets

```shell-session
$ diff --changed-group-format="%08xe-%08xl (%08xn) <-> %08xE-%08xL (%08xN) %c'\012'" --unchanged-group-format="" (xxd -c 1 -ps ../20210716_185532.jpg | psub) (xxd -c 1 -ps 20210716_185532_exiv2-rating.jpg | psub)
0000f37b-0000f37b (00000000) <-> 0000f37b-0000fcdb (00000960)
```

The **only** change is the new XMP header, which is great.
No other tags have been re-ordered or modified in any way.

This is the perfect result: No data was lost, and the new rating has been set.

## gthumb 3.10.3

### Filesize

```shell-session
$ ls -l ../20210716_185532.jpg
-rw-r----- 1 neonew neonew 3409348 16. Jul 18:55 ../20210716_185532.jpg
$ ls -l ./20210716_185532_gthumb-rating.jpg
-rw-r----- 1 neonew neonew 3350361 16. Jul 18:55 20210716_185532_gthumb-rating.jpg
```

Wait a second..the filesize **decreased** by 58987 bytes. That's not good..
I planned on adding information to the file, not removing some.

### New XMP Marker

```shell-session
$ exiv2 -pS 20210716_185532_gthumb-rating.jpg
STRUCTURE OF JPEG FILE: 20210716_185532_gthumb-rating.jpg
 address | marker       |  length | data
       0 | 0xffd8 SOI
       2 | 0xffe1 APP1  |     810 | Exif..II*......................
     814 | 0xffe1 APP1  |    2491 | http://ns.adobe.com/xap/1.0/.<?x
    3307 | 0xffed APP13 |      34 | Photoshop 3.0.8BIM.............0
    3343 | 0xffe4 APP4  |   17389 | ...............................
   20734 | 0xffc0 SOF0  |      17
   20753 | 0xffdb DQT   |     132
   20887 | 0xffc4 DHT   |     418
   21307 | 0xffdd DRI   |       4
   21313 | 0xffda SOS
```

Let's see..the original Exif marker decreased by 61516 bytes!
And now we have the XMP marker but also an additional APP13 marker.

### Raw XML

```shell-session
$ exiv2 -pX 20210716_185532_gthumb-rating.jpg | xmllint --format -
<?xml version="1.0"?>
<?xpacket begin="﻿" id="W5M0MpCehiHzreSzNTczkc9d"?>
<x:xmpmeta xmlns:x="adobe:ns:meta/" x:xmptk="XMP Core 4.4.0-Exiv2">
  <rdf:RDF xmlns:rdf="http://www.w3.org/1999/02/22-rdf-syntax-ns#">
    <rdf:Description xmlns:exif="http://ns.adobe.com/exif/1.0/" xmlns:xmp="http://ns.adobe.com/xap/1.0/" rdf:about="" exif:DateTimeOriginal="2021-07-16T18:55:32+02:00" xmp:Rating="3"/>
  </rdf:RDF>
</x:xmpmeta>
<?xpacket end="w"?>
```

This looks fine. The DateTimeOriginal was also written to the XMP, but the Rating is also there.

### Binary diff offsets

<details markdown="1">
<summary>Too many changes..</summary>

```shell-session
$ diff --changed-group-format="%08xe-%08xl (%08xn) <-> %08xE-%08xL (%08xN) %c'\012'" --unchanged-group-format="" (xxd -c 1 -ps ../20210716_185532.jpg | psub) (xxd -c 1 -ps 20210716_185532_gthumb-rating.jpg | psub)
00000004-00000006 (00000002) <-> 00000004-00000006 (00000002)
0000005a-0000005b (00000001) <-> 0000005a-0000005b (00000001)
00000066-00000067 (00000001) <-> 00000066-00000067 (00000001)
0000007e-0000007f (00000001) <-> 0000007e-0000007f (00000001)
0000008a-0000008b (00000001) <-> 0000008a-0000008b (00000001)
000000ae-000000af (00000001) <-> 000000ae-000000af (00000001)
000000b2-000000b4 (00000002) <-> 000000b2-000000b4 (00000002)
000000c8-000000c8 (00000000) <-> 000000c8-000000d8 (00000010)
000000ea-000000fb (00000011) <-> 000000fa-000000fb (00000001)
00000104-00000105 (00000001) <-> 00000104-00000105 (00000001)
00000110-00000111 (00000001) <-> 00000110-00000111 (00000001)
00000140-00000141 (00000001) <-> 00000140-00000141 (00000001)
0000014c-0000014d (00000001) <-> 0000014c-0000014d (00000001)
00000158-00000159 (00000001) <-> 00000158-00000159 (00000001)
00000164-00000165 (00000001) <-> 00000164-00000165 (00000001)
00000169-00000169 (00000000) <-> 00000169-00000175 (0000000c)
00000170-00000171 (00000001) <-> 0000017c-0000017d (00000001)
0000017c-0000017d (00000001) <-> 00000188-00000189 (00000001)
00000188-00000189 (00000001) <-> 00000194-00000195 (00000001)
00000194-00000195 (00000001) <-> 000001a0-000001a1 (00000001)
000001b8-000001b9 (00000001) <-> 000001c4-000001c5 (00000001)
000001bc-000001bc (00000000) <-> 000001c8-000001d4 (0000000c)
00000200-00000201 (00000001) <-> 00000218-00000219 (00000001)
00000224-00000225 (00000001) <-> 0000023c-0000023d (00000001)
0000022c-0000022c (00000000) <-> 00000244-00000254 (00000010)
00000264-00000274 (00000010) <-> 0000028c-0000028c (00000000)
00000294-00000296 (00000002) <-> 000002ac-000002ae (00000002)
0000029c-0000029e (00000002) <-> 000002b4-000002b6 (00000002)
000002c6-000002c7 (00000001) <-> 000002de-000002df (00000001)
000002de-000002e0 (00000002) <-> 000002f6-000002f8 (00000002)
00000316-00000344 (0000002e) <-> 0000032e-00000335 (00000007)
00000345-00000350 (0000000b) <-> 00000336-00000346 (00000010)
00000351-00000390 (0000003f) <-> 00000347-0000034e (00000007)
00000391-00000394 (00000003) <-> 0000034f-00000358 (00000009)
00000395-00000399 (00000004) <-> 00000359-00000363 (0000000a)
0000039a-0000040a (00000070) <-> 00000364-00000364 (00000000)
0000040b-00000469 (0000005e) <-> 00000365-00000368 (00000003)
0000046a-0000048c (00000022) <-> 00000369-0000036a (00000001)
0000048d-00000492 (00000005) <-> 0000036b-0000036f (00000004)
00000493-000004a4 (00000011) <-> 00000370-00000370 (00000000)
000004a5-000004a7 (00000002) <-> 00000371-00000371 (00000000)
000004a9-000004b1 (00000008) <-> 00000373-00000374 (00000001)
000004b2-0000054b (00000099) <-> 00000375-00000375 (00000000)
0000054c-0000056b (0000001f) <-> 00000376-00000377 (00000001)
0000056c-0000056c (00000000) <-> 00000378-0000037a (00000002)
0000056d-00000573 (00000006) <-> 0000037b-0000037b (00000000)
00000574-00000582 (0000000e) <-> 0000037c-0000037c (00000000)
00000583-000005dd (0000005a) <-> 0000037d-00000382 (00000005)
000005de-000005e3 (00000005) <-> 00000383-00000383 (00000000)
000005e4-000005f7 (00000013) <-> 00000384-00000384 (00000000)
000005f8-00000612 (0000001a) <-> 00000385-00000386 (00000001)
00000613-0000062f (0000001c) <-> 00000387-0000038a (00000003)
00000630-00000639 (00000009) <-> 0000038b-0000038c (00000001)
0000063a-00000643 (00000009) <-> 0000038d-0000038e (00000001)
00000644-00000649 (00000005) <-> 0000038f-00000390 (00000001)
0000064a-00000758 (0000010e) <-> 00000391-00000391 (00000000)
00000759-000007a2 (00000049) <-> 00000392-00000392 (00000000)
000007a3-000007b7 (00000014) <-> 00000393-00000393 (00000000)
000007b8-000007c4 (0000000c) <-> 00000394-00000396 (00000002)
000007c5-000007df (0000001a) <-> 00000397-00000397 (00000000)
000007e0-000007e6 (00000006) <-> 00000398-0000039a (00000002)
000007e7-000007f4 (0000000d) <-> 0000039b-0000039f (00000004)
000007f5-00000808 (00000013) <-> 000003a0-000003a5 (00000005)
00000809-0000081b (00000012) <-> 000003a6-000003aa (00000004)
0000081c-0000081e (00000002) <-> 000003ab-000003b0 (00000005)
0000081f-00000828 (00000009) <-> 000003b1-000003b1 (00000000)
00000829-0000082b (00000002) <-> 000003b2-000003b4 (00000002)
0000082c-00000832 (00000006) <-> 000003b5-000003b5 (00000000)
00000833-00000892 (0000005f) <-> 000003b6-000003b7 (00000001)
00000893-000008a0 (0000000d) <-> 000003b8-000003b8 (00000000)
000008a1-000008c5 (00000024) <-> 000003b9-000003bb (00000002)
000008c6-0000090f (00000049) <-> 000003bc-000003bc (00000000)
00000910-00000931 (00000021) <-> 000003bd-000003be (00000001)
00000932-00000970 (0000003e) <-> 000003bf-000003c0 (00000001)
00000971-0000098e (0000001d) <-> 000003c1-000003c1 (00000000)
0000098f-00000990 (00000001) <-> 000003c2-000003c3 (00000001)
00000991-00000994 (00000003) <-> 000003c4-000003c8 (00000004)
00000995-000009a2 (0000000d) <-> 000003c9-000003ca (00000001)
000009a3-000009b3 (00000010) <-> 000003cb-000003cb (00000000)
000009b4-000009d6 (00000022) <-> 000003cc-000003d0 (00000004)
000009d7-000009e0 (00000009) <-> 000003d1-000003d5 (00000004)
000009e1-000009f2 (00000011) <-> 000003d6-000003d6 (00000000)
000009f3-000009f7 (00000004) <-> 000003d7-000003d9 (00000002)
000009f8-00000a2e (00000036) <-> 000003da-000003da (00000000)
00000a2f-00000a32 (00000003) <-> 000003db-000003e0 (00000005)
00000a33-00000a56 (00000023) <-> 000003e1-000003e9 (00000008)
00000a57-00000a59 (00000002) <-> 000003ea-000003eb (00000001)
00000a5a-00000ad6 (0000007c) <-> 000003ec-000003ec (00000000)
00000ad7-00000af1 (0000001a) <-> 000003ed-000003ee (00000001)
00000af2-00000af5 (00000003) <-> 000003ef-000003ef (00000000)
00000af6-00000b02 (0000000c) <-> 000003f0-000003f4 (00000004)
00000b03-00000b0b (00000008) <-> 000003f5-000003f5 (00000000)
00000b0c-00000bc5 (000000b9) <-> 000003f6-000003f9 (00000003)
00000bc6-00000be6 (00000020) <-> 000003fa-000003fa (00000000)
00000be7-00000c12 (0000002b) <-> 000003fb-000003fb (00000000)
00000c13-00000c15 (00000002) <-> 000003fc-000003fd (00000001)
00000c16-00000c2f (00000019) <-> 000003fe-000003ff (00000001)
00000c30-00000c65 (00000035) <-> 00000400-00000400 (00000000)
00000c66-00000ca7 (00000041) <-> 00000401-00000404 (00000003)
00000ca8-00000cc9 (00000021) <-> 00000405-00000406 (00000001)
00000cca-00000cce (00000004) <-> 00000407-00000407 (00000000)
00000ccf-00000d0e (0000003f) <-> 00000408-00000408 (00000000)
00000d0f-00000d2b (0000001c) <-> 00000409-00000409 (00000000)
00000d2c-00000d6f (00000043) <-> 0000040a-0000040b (00000001)
00000d70-00000d85 (00000015) <-> 0000040c-0000040c (00000000)
00000d86-00000d97 (00000011) <-> 0000040d-00000412 (00000005)
00000d98-00000da9 (00000011) <-> 00000413-00000413 (00000000)
00000daa-00000dbe (00000014) <-> 00000414-00000415 (00000001)
00000dbf-00000df4 (00000035) <-> 00000416-00000418 (00000002)
00000df5-00000e3f (0000004a) <-> 00000419-00000419 (00000000)
00000e40-00000e8d (0000004d) <-> 0000041a-0000041b (00000001)
00000e8e-00000e8e (00000000) <-> 0000041c-0000041e (00000002)
00000e8f-00000edd (0000004e) <-> 0000041f-00000423 (00000004)
00000ede-00000ef9 (0000001b) <-> 00000424-00000424 (00000000)
00000efa-00000f00 (00000006) <-> 00000425-00000426 (00000001)
00000f01-00000f0b (0000000a) <-> 00000427-0000042a (00000003)
00000f0c-00000f0c (00000000) <-> 0000042b-0000042c (00000001)
00000f0d-00000f17 (0000000a) <-> 0000042d-0000042d (00000000)
00000f18-00000f40 (00000028) <-> 0000042e-0000042e (00000000)
00000f41-00000f80 (0000003f) <-> 0000042f-0000042f (00000000)
00000f81-00000f87 (00000006) <-> 00000430-00000430 (00000000)
00000f88-00000fb1 (00000029) <-> 00000431-00000432 (00000001)
00000fb2-00000fbf (0000000d) <-> 00000433-00000435 (00000002)
00000fc0-00000fcf (0000000f) <-> 00000436-00000438 (00000002)
00000fd0-00000fe9 (00000019) <-> 00000439-0000043a (00000001)
00000fea-00001003 (00000019) <-> 0000043b-0000043d (00000002)
00001004-00001031 (0000002d) <-> 0000043e-0000043f (00000001)
00001032-00001058 (00000026) <-> 00000440-0000044a (0000000a)
00001059-00001065 (0000000c) <-> 0000044b-0000044b (00000000)
00001066-00001075 (0000000f) <-> 0000044c-0000044f (00000003)
00001076-00001077 (00000001) <-> 00000450-00000450 (00000000)
00001078-00001093 (0000001b) <-> 00000451-00000451 (00000000)
00001094-0000109b (00000007) <-> 00000452-00000452 (00000000)
0000109c-000010b4 (00000018) <-> 00000453-00000454 (00000001)
000010b5-000010bb (00000006) <-> 00000455-00000456 (00000001)
000010bc-000010c1 (00000005) <-> 00000457-00000457 (00000000)
000010c2-000010df (0000001d) <-> 00000458-00000458 (00000000)
000010e0-000010e3 (00000003) <-> 00000459-00000459 (00000000)
000010e4-000010f9 (00000015) <-> 0000045a-00000463 (00000009)
000010fa-0000111c (00000022) <-> 00000464-00000464 (00000000)
0000111d-00001138 (0000001b) <-> 00000465-00000467 (00000002)
00001139-00001147 (0000000e) <-> 00000468-00000468 (00000000)
00001148-00001155 (0000000d) <-> 00000469-00000469 (00000000)
00001156-00001183 (0000002d) <-> 0000046a-0000046b (00000001)
00001184-000011a4 (00000020) <-> 0000046c-0000046d (00000001)
000011a5-000011d5 (00000030) <-> 0000046e-00000470 (00000002)
000011d6-00001206 (00000030) <-> 00000471-00000473 (00000002)
00001207-0000125f (00000058) <-> 00000474-00000474 (00000000)
00001260-00001293 (00000033) <-> 00000475-00000475 (00000000)
00001294-000012aa (00000016) <-> 00000476-00000479 (00000003)
000012ab-000012ab (00000000) <-> 0000047a-0000047c (00000002)
000012ac-000012b5 (00000009) <-> 0000047d-0000047d (00000000)
000012b6-000012be (00000008) <-> 0000047e-00000481 (00000003)
000012bf-000012e1 (00000022) <-> 00000482-00000483 (00000001)
000012e2-0000131a (00000038) <-> 00000484-00000485 (00000001)
0000131b-0000134b (00000030) <-> 00000486-00000488 (00000002)
0000134c-0000135f (00000013) <-> 00000489-0000048a (00000001)
00001360-00001368 (00000008) <-> 0000048b-0000048c (00000001)
00001369-000013bb (00000052) <-> 0000048d-00000491 (00000004)
000013bc-000013d4 (00000018) <-> 00000492-00000494 (00000002)
000013d5-0000142a (00000055) <-> 00000495-00000496 (00000001)
0000142b-00001441 (00000016) <-> 00000497-00000497 (00000000)
00001442-00001446 (00000004) <-> 00000498-00000499 (00000001)
00001447-000014b5 (0000006e) <-> 0000049a-0000049a (00000000)
000014b6-00001510 (0000005a) <-> 0000049b-0000049b (00000000)
00001511-0000151b (0000000a) <-> 0000049c-0000049c (00000000)
0000151c-00001530 (00000014) <-> 0000049d-0000049e (00000001)
00001531-00001535 (00000004) <-> 0000049f-0000049f (00000000)
00001536-0000158e (00000058) <-> 000004a0-000004a0 (00000000)
0000158f-000015aa (0000001b) <-> 000004a1-000004a1 (00000000)
000015ab-000015f8 (0000004d) <-> 000004a2-000004a2 (00000000)
000015f9-0000163b (00000042) <-> 000004a3-000004a5 (00000002)
0000163c-0000174a (0000010e) <-> 000004a6-000004a7 (00000001)
0000174b-0000174c (00000001) <-> 000004a8-000004a9 (00000001)
0000174d-00001757 (0000000a) <-> 000004aa-000004ab (00000001)
00001758-00001789 (00000031) <-> 000004ac-000004ac (00000000)
0000178a-00001792 (00000008) <-> 000004ad-000004ae (00000001)
00001793-000017de (0000004b) <-> 000004af-000004b0 (00000001)
000017df-00001863 (00000084) <-> 000004b1-000004b1 (00000000)
00001864-000018b4 (00000050) <-> 000004b2-000004b2 (00000000)
000018b5-00001913 (0000005e) <-> 000004b3-000004b3 (00000000)
00001914-000019b7 (000000a3) <-> 000004b4-000004b4 (00000000)
000019b8-000019ea (00000032) <-> 000004b5-000004b5 (00000000)
000019eb-00001a6f (00000084) <-> 000004b6-000004b7 (00000001)
00001a70-00001a99 (00000029) <-> 000004b8-000004bb (00000003)
00001a9a-00001ab7 (0000001d) <-> 000004bc-000004bc (00000000)
00001ab8-00001abc (00000004) <-> 000004bd-000004bd (00000000)
00001abd-00001b29 (0000006c) <-> 000004be-000004c0 (00000002)
00001b2a-00001b38 (0000000e) <-> 000004c1-000004c2 (00000001)
00001b39-00001ba1 (00000068) <-> 000004c3-000004c4 (00000001)
00001ba2-00001c19 (00000077) <-> 000004c5-000004c5 (00000000)
00001c1a-00001c54 (0000003a) <-> 000004c6-000004c7 (00000001)
00001c55-00001c82 (0000002d) <-> 000004c8-000004ca (00000002)
00001c83-00001c89 (00000006) <-> 000004cb-000004cc (00000001)
00001c8a-00001c94 (0000000a) <-> 000004cd-000004cd (00000000)
00001c95-00001cc4 (0000002f) <-> 000004ce-000004ce (00000000)
00001cc5-00001d46 (00000081) <-> 000004cf-000004d0 (00000001)
00001d47-00001d5b (00000014) <-> 000004d1-000004d1 (00000000)
00001d5c-00001d8f (00000033) <-> 000004d2-000004d2 (00000000)
00001d90-00001d97 (00000007) <-> 000004d3-000004d3 (00000000)
00001d98-00001e0c (00000074) <-> 000004d4-000004d4 (00000000)
00001e0d-00001e1d (00000010) <-> 000004d5-000004d6 (00000001)
00001e1e-00001e74 (00000056) <-> 000004d7-000004d7 (00000000)
00001e75-00001f5e (000000e9) <-> 000004d8-000004d8 (00000000)
00001f5f-00002046 (000000e7) <-> 000004d9-000004d9 (00000000)
00002047-00002178 (00000131) <-> 000004da-000004da (00000000)
00002179-000022a7 (0000012e) <-> 000004db-000004db (00000000)
000022a8-000023a2 (000000fa) <-> 000004dc-000004dc (00000000)
000023a3-000023de (0000003b) <-> 000004dd-000004dd (00000000)
000023df-00002499 (000000ba) <-> 000004de-000004de (00000000)
0000249a-00002645 (000001ab) <-> 000004df-000004df (00000000)
00002646-000029fb (000003b5) <-> 000004e0-000004e0 (00000000)
000029fc-00002a30 (00000034) <-> 000004e1-000004e1 (00000000)
00002a31-00002bd3 (000001a2) <-> 000004e2-000004e2 (00000000)
00002bd4-00002c4b (00000077) <-> 000004e3-000004e3 (00000000)
00002c4c-00002cf8 (000000ac) <-> 000004e4-000004e4 (00000000)
00002cf9-00002d92 (00000099) <-> 000004e5-000004e5 (00000000)
00002d93-00002e62 (000000cf) <-> 000004e6-000004e6 (00000000)
00002e63-00002e90 (0000002d) <-> 000004e7-000004e7 (00000000)
00002e91-0000327c (000003eb) <-> 000004e8-000004e8 (00000000)
0000327d-0000329d (00000020) <-> 000004e9-000004e9 (00000000)
0000329e-00003458 (000001ba) <-> 000004ea-000004ea (00000000)
00003459-0000347b (00000022) <-> 000004eb-000004eb (00000000)
0000347c-00003588 (0000010c) <-> 000004ec-000004ec (00000000)
00003589-00003a8c (00000503) <-> 000004ed-000004ed (00000000)
00003a8d-00003ca9 (0000021c) <-> 000004ee-000004ee (00000000)
00003caa-00003d0a (00000060) <-> 000004ef-000004ef (00000000)
00003d0b-00003e20 (00000115) <-> 000004f0-000004f0 (00000000)
00003e21-00003e51 (00000030) <-> 000004f1-000004f1 (00000000)
00003e52-000040ba (00000268) <-> 000004f2-000004f2 (00000000)
000040bb-000042a3 (000001e8) <-> 000004f3-000004f3 (00000000)
000042a4-000042ef (0000004b) <-> 000004f4-000004f4 (00000000)
000042f0-00004314 (00000024) <-> 000004f5-000004f5 (00000000)
00004315-000043c8 (000000b3) <-> 000004f6-000004f6 (00000000)
000043c9-000045c1 (000001f8) <-> 000004f7-000004f7 (00000000)
000045c2-00004669 (000000a7) <-> 000004f8-000004f8 (00000000)
0000466a-0000478c (00000122) <-> 000004f9-000004f9 (00000000)
0000478d-00004855 (000000c8) <-> 000004fa-000004fa (00000000)
00004856-00004885 (0000002f) <-> 000004fb-000004fb (00000000)
00004886-000048bf (00000039) <-> 000004fc-000004fc (00000000)
000048c0-000048ec (0000002c) <-> 000004fd-000004fd (00000000)
000048ed-000048f8 (0000000b) <-> 000004fe-000004fe (00000000)
000048f9-000049a8 (000000af) <-> 000004ff-000004ff (00000000)
000049a9-000049be (00000015) <-> 00000500-00000500 (00000000)
000049bf-00004b3a (0000017b) <-> 00000501-00000501 (00000000)
00004b3b-00004b68 (0000002d) <-> 00000502-00000502 (00000000)
00004b69-00004cc1 (00000158) <-> 00000503-00000503 (00000000)
00004cc2-00004d55 (00000093) <-> 00000504-00000504 (00000000)
00004d56-00004e4c (000000f6) <-> 00000505-00000505 (00000000)
00004e4d-0000504e (00000201) <-> 00000506-00000506 (00000000)
0000504f-00005176 (00000127) <-> 00000507-00000507 (00000000)
00005177-000051b1 (0000003a) <-> 00000508-00000508 (00000000)
000051b2-000051c1 (0000000f) <-> 00000509-00000509 (00000000)
000051c2-000051d6 (00000014) <-> 0000050a-0000050a (00000000)
000051d7-0000522d (00000056) <-> 0000050b-0000050b (00000000)
0000522e-00005327 (000000f9) <-> 0000050c-0000050c (00000000)
00005328-000053cd (000000a5) <-> 0000050d-0000050d (00000000)
000053ce-000053e3 (00000015) <-> 0000050e-0000050e (00000000)
000053e4-00005446 (00000062) <-> 0000050f-0000050f (00000000)
00005447-000054ac (00000065) <-> 00000510-00000510 (00000000)
000054ad-0000555f (000000b2) <-> 00000511-00000511 (00000000)
00005560-000055a4 (00000044) <-> 00000512-00000512 (00000000)
000055a5-000055d5 (00000030) <-> 00000513-00000513 (00000000)
000055d6-0000566b (00000095) <-> 00000514-00000514 (00000000)
0000566c-000057e0 (00000174) <-> 00000515-00000515 (00000000)
000057e1-00005aab (000002ca) <-> 00000516-00000516 (00000000)
00005aac-00005b68 (000000bc) <-> 00000517-00000517 (00000000)
00005b69-00005d36 (000001cd) <-> 00000518-00000518 (00000000)
00005d37-00005ec5 (0000018e) <-> 00000519-00000519 (00000000)
00005ec6-00005fca (00000104) <-> 0000051a-0000051a (00000000)
00005fcb-00006059 (0000008e) <-> 0000051b-0000051b (00000000)
0000605a-00006078 (0000001e) <-> 0000051c-0000051c (00000000)
00006079-0000612d (000000b4) <-> 0000051d-0000051d (00000000)
0000612e-000061bb (0000008d) <-> 0000051e-0000051e (00000000)
000061bc-0000627c (000000c0) <-> 0000051f-0000051f (00000000)
0000627d-0000628e (00000011) <-> 00000520-00000520 (00000000)
0000628f-0000629d (0000000e) <-> 00000521-00000521 (00000000)
0000629e-000062f0 (00000052) <-> 00000522-00000522 (00000000)
000062f1-000063c8 (000000d7) <-> 00000523-00000523 (00000000)
000063c9-0000641c (00000053) <-> 00000524-00000524 (00000000)
0000641d-00006477 (0000005a) <-> 00000525-00000525 (00000000)
00006478-0000649c (00000024) <-> 00000526-00000526 (00000000)
0000649d-000064df (00000042) <-> 00000527-00000527 (00000000)
000064e0-000066f7 (00000217) <-> 00000528-00000528 (00000000)
000066f8-000067a1 (000000a9) <-> 00000529-00000529 (00000000)
000067a2-000067bf (0000001d) <-> 0000052a-0000052a (00000000)
000067c0-000067cc (0000000c) <-> 0000052b-0000052b (00000000)
000067cd-00006806 (00000039) <-> 0000052c-0000052c (00000000)
00006807-0000687f (00000078) <-> 0000052d-0000052d (00000000)
00006880-000069a4 (00000124) <-> 0000052e-0000052e (00000000)
000069a5-00006a32 (0000008d) <-> 0000052f-0000052f (00000000)
00006a33-00006ab8 (00000085) <-> 00000530-00000530 (00000000)
00006ab9-00006b53 (0000009a) <-> 00000531-00000531 (00000000)
00006b54-00006c93 (0000013f) <-> 00000532-00000532 (00000000)
00006c94-00006ca3 (0000000f) <-> 00000533-00000533 (00000000)
00006ca4-00006cd1 (0000002d) <-> 00000534-00000534 (00000000)
00006cd2-00006df2 (00000120) <-> 00000535-00000535 (00000000)
00006df3-00006e71 (0000007e) <-> 00000536-00000536 (00000000)
00006e72-00006fba (00000148) <-> 00000537-00000537 (00000000)
00006fbb-00007034 (00000079) <-> 00000538-00000538 (00000000)
00007035-0000707c (00000047) <-> 00000539-00000539 (00000000)
0000707d-00007094 (00000017) <-> 0000053a-0000053a (00000000)
00007095-00007098 (00000003) <-> 0000053b-0000053b (00000000)
00007099-0000710a (00000071) <-> 0000053c-0000053c (00000000)
0000710b-0000713c (00000031) <-> 0000053d-0000053d (00000000)
0000713d-0000719e (00000061) <-> 0000053e-0000053e (00000000)
0000719f-00007491 (000002f2) <-> 0000053f-0000053f (00000000)
00007492-000074f9 (00000067) <-> 00000540-00000540 (00000000)
000074fa-0000764b (00000151) <-> 00000541-00000541 (00000000)
0000764c-0000770d (000000c1) <-> 00000542-00000542 (00000000)
0000770e-000077d6 (000000c8) <-> 00000543-00000543 (00000000)
000077d7-0000780d (00000036) <-> 00000544-00000544 (00000000)
0000780e-00007853 (00000045) <-> 00000545-00000545 (00000000)
00007854-00007af1 (0000029d) <-> 00000546-00000546 (00000000)
00007af2-00007b57 (00000065) <-> 00000547-00000547 (00000000)
00007b58-00007c0d (000000b5) <-> 00000548-00000548 (00000000)
00007c0e-00007d37 (00000129) <-> 00000549-00000549 (00000000)
00007d38-00007e98 (00000160) <-> 0000054a-0000054a (00000000)
00007e99-00007f6f (000000d6) <-> 0000054b-0000054b (00000000)
00007f70-0000814f (000001df) <-> 0000054c-0000054c (00000000)
00008150-00008278 (00000128) <-> 0000054d-0000054d (00000000)
00008279-00008296 (0000001d) <-> 0000054e-0000054e (00000000)
00008297-00008365 (000000ce) <-> 0000054f-0000054f (00000000)
00008366-000083e3 (0000007d) <-> 00000550-00000550 (00000000)
000083e4-000084d5 (000000f1) <-> 00000551-00000551 (00000000)
000084d6-00008732 (0000025c) <-> 00000552-00000552 (00000000)
00008733-00008838 (00000105) <-> 00000553-00000553 (00000000)
00008839-00008a31 (000001f8) <-> 00000554-00000554 (00000000)
00008a32-00008aa9 (00000077) <-> 00000555-00000555 (00000000)
00008aaa-00008af3 (00000049) <-> 00000556-00000556 (00000000)
00008af4-00008bb5 (000000c1) <-> 00000557-00000557 (00000000)
00008bb6-00008be4 (0000002e) <-> 00000558-00000558 (00000000)
00008be5-00008cd9 (000000f4) <-> 00000559-00000559 (00000000)
00008cda-00008d22 (00000048) <-> 0000055a-0000055a (00000000)
00008d23-00008dd4 (000000b1) <-> 0000055b-0000055b (00000000)
00008dd5-00008ea6 (000000d1) <-> 0000055c-0000055c (00000000)
00008ea7-00008f54 (000000ad) <-> 0000055d-0000055d (00000000)
00008f55-00008f8b (00000036) <-> 0000055e-0000055e (00000000)
00008f8c-00008fba (0000002e) <-> 0000055f-0000055f (00000000)
00008fbb-00008fd5 (0000001a) <-> 00000560-00000560 (00000000)
00008fd6-000091ed (00000217) <-> 00000561-00000561 (00000000)
000091ee-000091fe (00000010) <-> 00000562-00000562 (00000000)
000091ff-0000925c (0000005d) <-> 00000563-00000563 (00000000)
0000925d-00009278 (0000001b) <-> 00000564-00000564 (00000000)
00009279-00009476 (000001fd) <-> 00000565-00000565 (00000000)
00009477-00009494 (0000001d) <-> 00000566-00000566 (00000000)
00009495-00009637 (000001a2) <-> 00000567-00000567 (00000000)
00009638-000096bf (00000087) <-> 00000568-00000568 (00000000)
000096c0-0000973a (0000007a) <-> 00000569-00000569 (00000000)
0000973b-00009830 (000000f5) <-> 0000056a-0000056a (00000000)
00009831-0000990e (000000dd) <-> 0000056b-0000056b (00000000)
0000990f-00009be0 (000002d1) <-> 0000056c-0000056c (00000000)
00009be1-00009c9b (000000ba) <-> 0000056d-0000056d (00000000)
00009c9c-00009cce (00000032) <-> 0000056e-0000056e (00000000)
00009ccf-00009d29 (0000005a) <-> 0000056f-0000056f (00000000)
00009d2a-00009d7d (00000053) <-> 00000570-00000570 (00000000)
00009d7e-00009dd5 (00000057) <-> 00000571-00000571 (00000000)
00009dd6-00009dd9 (00000003) <-> 00000572-00000572 (00000000)
00009dda-00009ddb (00000001) <-> 00000573-00000573 (00000000)
00009ddc-00009fc5 (000001e9) <-> 00000574-00000574 (00000000)
00009fc6-00009feb (00000025) <-> 00000575-00000575 (00000000)
00009fec-0000a017 (0000002b) <-> 00000576-00000576 (00000000)
0000a018-0000a047 (0000002f) <-> 00000577-00000577 (00000000)
0000a048-0000a112 (000000ca) <-> 00000578-00000578 (00000000)
0000a113-0000a215 (00000102) <-> 00000579-00000579 (00000000)
0000a216-0000a2a3 (0000008d) <-> 0000057a-0000057a (00000000)
0000a2a4-0000a36b (000000c7) <-> 0000057b-0000057b (00000000)
0000a36c-0000a400 (00000094) <-> 0000057c-0000057c (00000000)
0000a401-0000a4cb (000000ca) <-> 0000057d-0000057d (00000000)
0000a4cc-0000a592 (000000c6) <-> 0000057e-0000057e (00000000)
0000a593-0000a5e6 (00000053) <-> 0000057f-0000057f (00000000)
0000a5e7-0000a704 (0000011d) <-> 00000580-00000580 (00000000)
0000a705-0000a70b (00000006) <-> 00000581-00000581 (00000000)
0000a70c-0000a752 (00000046) <-> 00000582-00000582 (00000000)
0000a753-0000a781 (0000002e) <-> 00000583-00000583 (00000000)
0000a782-0000a878 (000000f6) <-> 00000584-00000584 (00000000)
0000a879-0000a8c3 (0000004a) <-> 00000585-00000585 (00000000)
0000a8c4-0000aadb (00000217) <-> 00000586-00000586 (00000000)
0000aadc-0000ac84 (000001a8) <-> 00000587-00000587 (00000000)
0000ac85-0000acb7 (00000032) <-> 00000588-00000588 (00000000)
0000acb8-0000ad29 (00000071) <-> 00000589-00000589 (00000000)
0000ad2a-0000ad8d (00000063) <-> 0000058a-0000058a (00000000)
0000ad8e-0000ad97 (00000009) <-> 0000058b-0000058b (00000000)
0000ad98-0000ae71 (000000d9) <-> 0000058c-0000058c (00000000)
0000ae72-0000b0fa (00000288) <-> 0000058d-0000058d (00000000)
0000b0fb-0000b447 (0000034c) <-> 0000058e-0000058e (00000000)
0000b448-0000b606 (000001be) <-> 0000058f-0000058f (00000000)
0000b607-0000b644 (0000003d) <-> 00000590-00000590 (00000000)
0000b645-0000b8e8 (000002a3) <-> 00000591-00000591 (00000000)
0000b8e9-0000b947 (0000005e) <-> 00000592-00000592 (00000000)
0000b948-0000ba25 (000000dd) <-> 00000593-00000593 (00000000)
0000ba26-0000baf1 (000000cb) <-> 00000594-00000594 (00000000)
0000baf2-0000bb3b (00000049) <-> 00000595-00000595 (00000000)
0000bb3c-0000be2b (000002ef) <-> 00000596-00000596 (00000000)
0000be2c-0000be95 (00000069) <-> 00000597-00000597 (00000000)
0000be96-0000be9e (00000008) <-> 00000598-00000598 (00000000)
0000be9f-0000c066 (000001c7) <-> 00000599-00000599 (00000000)
0000c067-0000c0f5 (0000008e) <-> 0000059a-0000059a (00000000)
0000c0f6-0000c321 (0000022b) <-> 0000059b-0000059b (00000000)
0000c322-0000c40b (000000e9) <-> 0000059c-0000059c (00000000)
0000c40c-0000c4dd (000000d1) <-> 0000059d-0000059d (00000000)
0000c4de-0000c4f8 (0000001a) <-> 0000059e-0000059e (00000000)
0000c4f9-0000c537 (0000003e) <-> 0000059f-0000059f (00000000)
0000c538-0000c75a (00000222) <-> 000005a0-000005a0 (00000000)
0000c75b-0000c75c (00000001) <-> 000005a1-000005a1 (00000000)
0000c75d-0000c8b0 (00000153) <-> 000005a2-000005a2 (00000000)
0000c8b1-0000c8d0 (0000001f) <-> 000005a3-000005a3 (00000000)
0000c8d1-0000c934 (00000063) <-> 000005a4-000005a4 (00000000)
0000c935-0000c9a9 (00000074) <-> 000005a5-000005a5 (00000000)
0000c9aa-0000cad0 (00000126) <-> 000005a6-000005a6 (00000000)
0000cad1-0000cae9 (00000018) <-> 000005a7-000005a7 (00000000)
0000caea-0000cb95 (000000ab) <-> 000005a8-000005a8 (00000000)
0000cb96-0000ccdf (00000149) <-> 000005a9-000005a9 (00000000)
0000cce0-0000ccfe (0000001e) <-> 000005aa-000005aa (00000000)
0000ccff-0000cd5e (0000005f) <-> 000005ab-000005ab (00000000)
0000cd5f-0000ce24 (000000c5) <-> 000005ac-000005ac (00000000)
0000ce25-0000ce27 (00000002) <-> 000005ad-000005ad (00000000)
0000ce28-0000ce47 (0000001f) <-> 000005ae-000005ae (00000000)
0000ce48-0000ce4a (00000002) <-> 000005af-000005af (00000000)
0000ce4b-0000ce64 (00000019) <-> 000005b0-000005b0 (00000000)
0000ce65-0000cedc (00000077) <-> 000005b1-000005b1 (00000000)
0000cedd-0000cf50 (00000073) <-> 000005b2-000005b2 (00000000)
0000cf51-0000d036 (000000e5) <-> 000005b3-000005b3 (00000000)
0000d037-0000d053 (0000001c) <-> 000005b4-000005b4 (00000000)
0000d054-0000d1dc (00000188) <-> 000005b5-000005b5 (00000000)
0000d1dd-0000d28f (000000b2) <-> 000005b6-000005b6 (00000000)
0000d290-0000d2de (0000004e) <-> 000005b7-000005b7 (00000000)
0000d2df-0000d3c7 (000000e8) <-> 000005b8-000005b8 (00000000)
0000d3c8-0000d409 (00000041) <-> 000005b9-000005b9 (00000000)
0000d40a-0000d4f4 (000000ea) <-> 000005ba-000005ba (00000000)
0000d4f5-0000d5d0 (000000db) <-> 000005bb-000005bb (00000000)
0000d5d1-0000d66b (0000009a) <-> 000005bc-000005bc (00000000)
0000d66c-0000d6f8 (0000008c) <-> 000005bd-000005bd (00000000)
0000d6f9-0000d724 (0000002b) <-> 000005be-000005be (00000000)
0000d725-0000d760 (0000003b) <-> 000005bf-000005bf (00000000)
0000d761-0000d7d2 (00000071) <-> 000005c0-000005c0 (00000000)
0000d7d3-0000d944 (00000171) <-> 000005c1-000005c1 (00000000)
0000d945-0000d958 (00000013) <-> 000005c2-000005c2 (00000000)
0000d959-0000d9d7 (0000007e) <-> 000005c3-000005c3 (00000000)
0000d9d8-0000da71 (00000099) <-> 000005c4-000005c4 (00000000)
0000da72-0000da9a (00000028) <-> 000005c5-000005c5 (00000000)
0000da9b-0000dd1d (00000282) <-> 000005c6-000005c6 (00000000)
0000dd1e-0000ddb6 (00000098) <-> 000005c7-000005c7 (00000000)
0000ddb7-0000de60 (000000a9) <-> 000005c8-000005c8 (00000000)
0000de61-0000de6b (0000000a) <-> 000005c9-000005c9 (00000000)
0000de6c-0000df66 (000000fa) <-> 000005ca-000005ca (00000000)
0000df67-0000dff9 (00000092) <-> 000005cb-000005cb (00000000)
0000dffa-0000e16e (00000174) <-> 000005cc-000005cc (00000000)
0000e16f-0000e338 (000001c9) <-> 000005cd-000005cd (00000000)
0000e339-0000e437 (000000fe) <-> 000005ce-000005ce (00000000)
0000e438-0000e4ff (000000c7) <-> 000005cf-000005cf (00000000)
0000e500-0000e6b2 (000001b2) <-> 000005d0-000005d0 (00000000)
0000e6b3-0000e73d (0000008a) <-> 000005d1-000005d1 (00000000)
0000e73e-0000e7d0 (00000092) <-> 000005d2-000005d2 (00000000)
0000e7d1-0000e859 (00000088) <-> 000005d3-000005d3 (00000000)
0000e85a-0000ea76 (0000021c) <-> 000005d4-000005d4 (00000000)
0000ea77-0000ea81 (0000000a) <-> 000005d5-000005d5 (00000000)
0000ea82-0000ead8 (00000056) <-> 000005d6-000005d6 (00000000)
0000ead9-0000eaee (00000015) <-> 000005d7-000005d7 (00000000)
0000eaef-0000eb32 (00000043) <-> 000005d8-000005d8 (00000000)
0000eb33-0000ec44 (00000111) <-> 000005d9-000005d9 (00000000)
0000ec45-0000ec60 (0000001b) <-> 000005da-00000cda (00000700)
0000ec61-0000ecbc (0000005b) <-> 00000cdb-00000cdb (00000000)
0000ecbd-0000ecd6 (00000019) <-> 00000cdc-00000cdc (00000000)
0000ecd7-0000ecdc (00000005) <-> 00000cdd-00000cdd (00000000)
0000ecdd-0000ed07 (0000002a) <-> 00000cde-00000cde (00000000)
0000ed08-0000ed71 (00000069) <-> 00000cdf-00000cdf (00000000)
0000ed72-0000ee40 (000000ce) <-> 00000ce0-00000ce1 (00000001)
0000ee41-0000ee95 (00000054) <-> 00000ce2-00000ce2 (00000000)
0000ee96-0000eec9 (00000033) <-> 00000ce3-00000ce3 (00000000)
0000eeca-0000eedb (00000011) <-> 00000ce4-00000ce4 (00000000)
0000eedc-0000eeec (00000010) <-> 00000ce5-00000ce5 (00000000)
0000eeed-0000ef02 (00000015) <-> 00000ce6-00000ce7 (00000001)
0000ef03-0000ef0e (0000000b) <-> 00000ce8-00000cea (00000002)
0000ef0f-0000ef0f (00000000) <-> 00000ceb-00000cec (00000001)
0000ef10-0000ef14 (00000004) <-> 00000ced-00000ced (00000000)
0000ef15-0000ef2b (00000016) <-> 00000cee-00000cee (00000000)
0000ef2c-0000ef83 (00000057) <-> 00000cef-00000cef (00000000)
0000ef84-0000efbc (00000038) <-> 00000cf0-00000cf2 (00000002)
0000efbd-0000efdb (0000001e) <-> 00000cf3-00000cf5 (00000002)
0000efdc-0000f0c9 (000000ed) <-> 00000cf6-00000cf7 (00000001)
0000f0ca-0000f0ec (00000022) <-> 00000cf8-00000cf8 (00000000)
0000f0ed-0000f180 (00000093) <-> 00000cf9-00000cf9 (00000000)
0000f181-0000f19a (00000019) <-> 00000cfa-00000cfb (00000001)
0000f19b-0000f216 (0000007b) <-> 00000cfc-00000cfc (00000000)
0000f217-0000f23c (00000025) <-> 00000cfd-00000cfd (00000000)
0000f23d-0000f248 (0000000b) <-> 00000cfe-00000cff (00000001)
0000f249-0000f2e3 (0000009a) <-> 00000d00-00000d00 (00000000)
0000f2e4-0000f2fc (00000018) <-> 00000d01-00000d01 (00000000)
0000f2fd-0000f331 (00000034) <-> 00000d02-00000d08 (00000006)
0000f332-0000f338 (00000006) <-> 00000d09-00000d0b (00000002)
0000f339-0000f35a (00000021) <-> 00000d0c-00000d0c (00000000)
0000f35b-0000f35d (00000002) <-> 00000d0d-00000d0e (00000001)
0000f35e-0000f37a (0000001c) <-> 00000d0f-00000d0f (00000000)
```

</details>

Wait, what? This is way too much.

If you look at the changed exif data, the diff looks like this:

```shell-session
$ diff (exiv2 -pa ../20210716_185532.jpg | psub) (exiv2 -pa 20210716_185532_gthumb-rating.jpg | psub)
21a22
> Exif.Photo.ComponentsConfiguration           Undefined   4  YCbCr
28a30
> Exif.Photo.FlashpixVersion                   Undefined   4  1.00
38c40
< Exif.Image.GPSTag                            Long        1  676
---
> Exif.Image.GPSTag                            Long        1  700
43,50c45,47
< Exif.Thumbnail.ImageWidth                    Long        1  512
< Exif.Thumbnail.ImageLength                   Long        1  288
< Exif.Thumbnail.Compression                   Short       1  JPEG (alter Stil)
< Exif.Thumbnail.XResolution                   Rational    1  72
< Exif.Thumbnail.YResolution                   Rational    1  72
< Exif.Thumbnail.ResolutionUnit                Short       1  Zoll
< Exif.Thumbnail.JPEGInterchangeFormat         Long        1  896
< Exif.Thumbnail.JPEGInterchangeFormatLength   Long        1  61422
---
> Iptc.Application2.Urgency                    String      1  0
> Xmp.exif.DateTimeOriginal                    XmpText    25  2021-07-16T18:55:32+02:00
> Xmp.xmp.Rating                               XmpText     1  3
```

Luckily, not too much information was lost.
In fact, it just looks like the **integrated thumbnail was deleted**.

I didn't request it, so I very much dislike it.
I makes me feel I cannot trust this tool to do the changes I want to.
What information is deleted the next time?

If the thumbnail has been purposely deleted, I should have at least seen a warning about it.

## Nikon

## Windows 7/10

## Samsung Galaxy S10

You can mark your favorite images by selecting the *heart* button, but
that doesn't seem to modify the image file at all.
I guess Samsung Gallery rather saves all favorites in an internal database, unfortunately.

# Image signature

In order to validate the image itself did not change, you can also check the ImageMagick's signature.
It is a generated hash based on the pixel data of the image.
That way you can find out if an image has been re-encoded, for example.

```bash
magick identify -format "%#" image.jpg
```

# Keywords

You can also store keywords (a.k.a hashtags) on your files in the XMP data block.

# Test image files

You can see my test image and all modified images in this dropbox folder:

[Dropbox Folder](https://www.dropbox.com/sh/btt68sxqt8pnx5z/AADd92q0hD_VWQ4wVyUT1oD7a?dl=0)

# Summary

JPEG tags are complicated.
EXIF, SubIFD, IPTC, XMP..uff!

So many mixed variants for the same idea..
you can smell how the metadata format has evolved over the years.

No wonder many tools behave differently and compatibility is not always given.

Here is a final overview of the tools I've tested:

| Tool           | Filesize  | All data retained  | No more changes than necessary | Notes             |
|----------------|-----------|--------------------|--------------------------------|-------------------|
| exiftool 12.26 | +2.814    | ✅                  | ❌                             |                   |
| exiv2 0.27.4   | +2.400    | ✅                  | ✅                             |                   |
| gThumb 3.10.3  | -58.987   | ❌                  | ❌                             | Thumbnail deleted |
