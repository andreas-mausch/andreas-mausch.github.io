---
title: "Backup: 7z with error correction data using parchive"
date: 2025-03-25T15:00:00+07:00
tags: ['quickpar', 'data corruption', 'fix files']
thumbnail: broken-file.jpg
---

{% image "broken-file.jpg", "Broken file" %}

Every few years I make a backup of my most important data files
to a Blu-Ray M-disc.

I've heard M-disc is only a marketing gag nowadays and doesn't
really provide a better material for the data layer as it used to,
but well, it can't hurt to still use it. Maybe I'm overpaying a bit.

# archive tool

I have written a shell script to re-compress videos, audio and images
to reduce their size:

[archive scripts](https://github.com/andreas-mausch/archive/)

It will take hours to run, because especially video encoding takes a lot of time.
Your source files will remain untouched, all created files are stored in a new folder
provided by the user.

Please note the tool will skip any files it doesn't recognize, so
verify all your important data is still there after running it.

# 7z all files

Next, I proceed to make a huge .7z file out of the folder.

To do this, I run this:

```bash
7z a -m0=Copy -mhe=on -p output.7z *
```

- a: Add files
- m: Set Compression Method
- mhe: enables or disables archive header encryption (filenames)
- p: Set Password

I disable compression here, because most my files are already compressed.
But you might want to change that.

The password is not shown here, you will be asked to enter it on stdin.

# parchive (par2)

Now, 7z does not provide a mechanism for error correction.
Unlike rar, where the format directly supports it.

To achieve a similar result, I use a second tool to create recovery information.
So in case a bit flips, I can still recover the whole archive.

The package for Arch Linux (or Manjaro) is named `par2cmdline`.

```bash
sudo pacman -S par2cmdline
```

Now to create the recovery data, run this:

```bash
par2 create -m2048 -v -r5 -n1 output.par2 input.bin
```

-m: Maximum Memory usage in Megabytes
-v: Enable verbose mode
-r: Recovery data in percent
-n: Number of parity files to create

For me, 5% is a reasonable amount for recovery data. You might want to change that, though.
You can also create multiple partify files.
However, I don't need it and I think it is mostly useful for internet file sharing,
where bandwidth is limited and the user might not want to download the whole parity data,
but parts of it would be sufficient to fix his data.

The command will create two files: `output.par2` and `output.vol000+100.par2`,
even though we told it to only create one.
This is because `output.par2` is an index file which points to all following files.

You can now verify your data is correct by running:

```bash
par2 verify -m2048 -v input.par2
```

# Full example with test data

## Create test data files

```bash
for run in {1..6}; do dd if=/dev/urandom of=./test-data-${run}.bin bs=1M count=128; done
```

This will create six files of 128 MB size each.

## 7z the test data

```bash
7z a -m0=Copy -mhe=on -p output.7z *
```

The resulting `output.7z` will be 769 MB.

## Create par2 data

```bash
par2 create -m2048 -v -r5 -n1 output.par2 output.7z
```

This will create the small index file `output.par2` (40 KB) and the bigger
`output.vol000+100.par2` (39 MB).

```bash
par2 verify -m2048 -v output.par2
```

This should output `All files are correct, repair is not required.`

## Corrupt the data on purpose

We will now overwrite three bytes each at three positions in the 7z,
and see if par2 can fix that afterwards.

```bash
printf '\xaa\xab\xac' | dd of=output.7z bs=1 seek=100 count=3 conv=notrunc
printf '\xba\xbb\xbc' | dd of=output.7z bs=1 seek=98342 count=3 conv=notrunc
printf '\xca\xcb\xcc' | dd of=output.7z bs=1 seek=34490130 count=3 conv=notrunc
```

```shell-session
$ par2 verify -m2048 -v output.par2
Loading "output.par2".
Loaded 4 new packets
Loading "output.vol000+100.par2".
Loaded 100 new packets including 100 recovery blocks
Loading "output.par2".
No new packets found

There are 1 recoverable files and 0 other files.
The block size used was 402656 bytes.
There are a total of 2000 data blocks.
The total size of the data files is 805306754 bytes.

Verifying source files:

Opening: "output.7z"
No data found between offset 0 and 402656
Scanning: 4.3%
No data found between offset 34225760 and 34628416
Target: "output.7z" - damaged. Found 1998 of 2000 data blocks.

Scanning extra files:


Repair is required.
1 file(s) exist but are damaged.
You have 1998 out of 2000 data blocks available.
You have 100 recovery blocks available.
Repair is possible.
You have an excess of 98 recovery blocks.
2 recovery blocks will be used to repair.
```

## Fix the corruption

```shell-session
$ par2 repair output.par2
Loading "output.par2".
Loaded 4 new packets
Loading "output.vol000+100.par2".
Loaded 100 new packets including 100 recovery blocks
Loading "output.par2".
No new packets found

There are 1 recoverable files and 0 other files.
The block size used was 402656 bytes.
There are a total of 2000 data blocks.
The total size of the data files is 805306754 bytes.

Verifying source files:

Opening: "output.7z"
Target: "output.7z" - damaged. Found 1998 of 2000 data blocks.

Scanning extra files:


Repair is required.
1 file(s) exist but are damaged.
You have 1998 out of 2000 data blocks available.
You have 100 recovery blocks available.
Repair is possible.
You have an excess of 98 recovery blocks.
2 recovery blocks will be used to repair.

Computing Reed Solomon matrix.
Constructing: done.
Solving: done.

Wrote 805306754 bytes to disk

Verifying repaired files:

Opening: "output.7z"
Target: "output.7z" - found.

Repair complete.
```

Now you could run `par2 verify` again and it should tell you again
`All files are correct, repair is not required.`.
