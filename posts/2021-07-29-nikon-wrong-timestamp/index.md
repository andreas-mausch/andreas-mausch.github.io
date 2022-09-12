---
title: Nikon stores wrong timestamp
date: 2021-07-29T17:00:00+02:00
tags: ['nikon', 'jpeg', 'metadata', 'timestamp', 'timezones', 'atime', 'mtime', 'ctime']
---

I noticed the *File Modification Date/Time* timestamp is saved incorrectly
on my Nikon D5600.

This is annoying, because when I copy my files to my phone, some tools order the
photos by their mtime, and if it is set incorrectly, pictures won't be in order.

I shot a photo at 16:40:30 CEST (UTC+2).
Note: My camera settings are set to Berlin time (UTC+1) with summer time enabled.
Sync time via bluetooth is enabled.

# The problem

Note: The commands below were executed after the file has been moved from the SD card to my ext4 file system.
I've moved them with Thunar, which usually keeps the timestamps as they are.
I'm on the `5.10.49-1-MANJARO` kernel and Thunar `4.16.8`.

This is what exiftool's output looks like:

```bash
$ exiftool DSC_8783-shot-at-16-40-cest.JPG | grep -i time
File Modification Date/Time     : 2021:07:29 18:40:30+02:00
File Access Date/Time           : 2021:07:29 16:41:09+02:00
File Inode Change Date/Time     : 2021:07:29 16:41:38+02:00
Exposure Time                   : 1/60
Date/Time Original              : 2021:07:29 16:40:29
Time Zone                       : +01:00
Power Up Time                   : 0000:00:00 00:00:00
Sub Sec Time                    : 87
Sub Sec Time Original           : 87
Sub Sec Time Digitized          : 87
GPS Time Stamp                  : 14:40:28.31
Date/Time Original              : 2021:07:29 16:40:29.87
GPS Date/Time                   : 2021:07:29 14:40:28.31Z
```

So the *File Modification Date/Time* is just wrong.
It should be either *2021:07:29 16:40:30+02:00* or
*2021:07:29 18:40:30Z*.

See the mtime from stat:

```bash
$ stat DSC_8783-shot-at-16-40-cest.JPG 
 Datei: DSC_8783-shot-at-16-40-cest.JPG
 Größe: 7027908   	Blöcke: 13728      EA Block: 4096   reguläre Datei
 Gerät: 10302h/66306d	Inode: 2887230     Verknüpfungen: 1
Zugriff: (0644/-rw-r--r--)  Uid: ( 1000/  neonew)   Gid: ( 1000/  neonew)
Zugriff: 2021-07-29 16:41:09.435963000 +0200
Modifiziert: 2021-07-29 18:40:30.000000000 +0200
Geändert: 2021-07-29 16:41:38.542630557 +0200
Geburt: 2021-07-29 16:41:09.435963322 +0200

$ stat -c "Filename : %n
atime    : %x
mtime    : %y
ctime    : %z
" DSC_8783-shot-at-16-40-cest.JPG 
Filename : DSC_8783-shot-at-16-40-cest.JPG
atime    : 2021-07-29 16:41:09.435963000 +0200
mtime    : 2021-07-29 18:40:30.000000000 +0200
ctime    : 2021-07-29 16:51:29.019308742 +0200
```

On the SD card with a FAT32 file system the output looks like this:

```bash
stat DSC_8783.JPG 
 Datei: DSC_8783.JPG
 Größe: 7027908   	Blöcke: 13728      EA Block: 32768  reguläre Datei
 Gerät: b301h/45825d	Inode: 345         Verknüpfungen: 1
Zugriff: (0644/-rw-r--r--)  Uid: ( 1000/  neonew)   Gid: ( 1000/  neonew)
Zugriff: 2021-07-29 02:00:00.000000000 +0200
Modifiziert: 2021-07-29 18:46:10.000000000 +0200
Geändert: 2021-07-29 18:46:10.000000000 +0200
Geburt: -
```

# The fix: Set mtime to exif timestamp

I don't really know how to fix the timestamp on the file system,
e.g. by changing a setting in the camera or copying the file in a
different way.

That's why I use this command to set the ctime of the file to the
DateTimeOriginal from the exif data.
I do it right after I move the files from the SD card, so I know I have
not changed them before.

Note: This might lose information, so be careful applying this command.  

## First attempt

Second note: Your file must have exif information and a DateTimeOriginal field set.
If your file does not have the field, exiftool will output *No writable tags set*
and won't change the timestamp (which is great).

```bash
exiftool "-FileModifyDate<DateTimeOriginal" DSC_8783-shot-at-16-40-cest.JPG
```

If you want to change the dates by a fixed time interval, you can also use
[this alternative](https://photo.stackexchange.com/questions/7919/how-to-shift-exif-date-time-created-by-time-in-days-hours-minutes):

```bash
exiftool "-FileModifyDate+=1:12:28 14:54:32" -verbose DSC_8783-shot-at-16-40-cest.JPG
```

This will add 1 year, 12 month, 28 days, 14 hours, 54 minutes, 32 seconds.

## Second attempt

The command above has a problem though: It also updates the atime.
If you don't want that, use this command:

```bash
touch -m -t `exiftool -s3 -d "%Y%m%d%H%M.%S" -DateTimeOriginal DSC_7947.JPG` DSC_7947.JPG
# # for all files in directory
for f in DSC_*.JPG ; do touch -m -t `exiftool -s3 -d "%Y%m%d%H%M.%S" -DateTimeOriginal "$f"` "$f" ; done
# recursively
find . -iname "DSC_*.jpg" -type f -exec sh -c 'touch -m -t $(exiftool -s3 -d "%Y%m%d%H%M.%S" -DateTimeOriginal "$1") "$1"' sh {} \;
```

# Manually update mtime 

The ctime is controlled by Linux so you cannot easily change it.
And you don't really need to.

What you can change is the mtime (last modification date):

```bash
touch -m -d "5 hours ago" image.jpg
touch -m -d "2007-01-31T08:46:26+02:00" image.jpg
```

# Timezone issues

On the second command, touch saves the time as `2007-01-31 07:46:26 +0100`,
so it still converts the timezone to +01:00.
That's because in January 2007 there was CET in Berlin, not CEST (summer time).
touch should respect the *TZ* environment variable, and it does, but it
still converts the timezone. :(

I could not find a fix for this. It does not hurt that much, because the time
is still correct for sorting etc.

Btw: Here is how you can check your current timezone:

```bash
date +"%Z %z"
# Outputs 'CEST +0200' on my system
```

# The other way round: Set exif timestamp to mtime

If you want to set the DateTimeOriginal exif field on a file without exif data,
and you want to use the mtime as source, you can run this:

```bash
exiftool "-DateTimeOriginal<FileModifyDate" "-FileModifyDate<FileModifyDate" no-exif.jpg
```

Note: This will also update the atime.
