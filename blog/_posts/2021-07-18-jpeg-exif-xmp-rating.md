---
layout: post
title: "JPEG: Exif XMP Rating"
date: 2021-07-18 21:00:00 +02:00
tags:
---

I like to mark my best photos with a rating.
There are plenty of tools for the job.

Since Windows 7 (or Vista?) it was even integrated into the operating system.

However, I found there is more than one way to save the rating into the metadata
of the image, and different tools are not very compatible with each other.

Luckily, there is a defacto standard which most tools can work with: The *Rating*
tag in the XMP metadata. It was first defined by Adobe (source!!).

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

![]({{ site.baseurl }}/images/2021-07-18-jpeg-exif-xmp-rating/jpeg-hex-view.png)

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

![]({{ site.baseurl }}/images/2021-07-18-jpeg-exif-xmp-rating/jpeg-markers.png)

I found [this pdf](https://www.google.com/url?sa=t&rct=j&q=&esrc=s&source=web&cd=&ved=2ahUKEwiJtb7H0fHxAhWkJcUKHSYAAZwQFjAAegQIBxAD&url=https%3A%2F%2Fwww.waimea.de%2Fdownloads%2Fexif%2FEXIF-Datenformat.pdf&usg=AOvVaw3Cdkkfq33EEQ-8SSnPU_Wr) (german) helpful to understand the file format.

List the markers of an image:

```bash
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

```bash
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

### New XMP Marker

If you compare the structure after the change, there is an addtional APP1 marker for XMP.

```bash
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

```bash
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

See [here]({{ site.baseurl }}{% post_url blog/2021-07-17-binary-diffs %}).

```bash
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

The main goal has been achieved: No data was lost. Great.

## exiv2

## gthumb

### Filesize decreased! (data lost?)

## Nikon

## Windows 7/10

## Samsung Galaxy S10
