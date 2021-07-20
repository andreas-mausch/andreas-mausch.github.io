---
layout: post
title: "Binary diffs"
date: 2021-07-17 22:00:00 +02:00
tags:
---

When I searched the internet on how to diff two binary files,
the first results were not helpful to me.

Most of them only work well when the files are the same size and
only differ in some bytes.

When there are bytes inserted at some point of the file, the result
is not useful.

Let me show you.

# Files are the same size, and some bytes are changed

Let's assume we have these two files:

```bash
$ xxd testfile.bin
00000000: 0000 0000 0000 1111 1111 1111 2222 2222  ............""""
00000010: 2222 3333 3333 3333 4444 4444 4444 5555  ""333333DDDDDDUU
00000020: 5555 5555 6666 6666 6666 7777 7777 7777  UUUUffffffwwwwww
00000030: 8888 8888 8888 9999 9999 9999 aaaa aaaa  ................
00000040: aaaa bbbb bbbb bbbb cccc cccc cccc dddd  ................
00000050: dddd dddd eeee eeee eeee ffff ffff ffff  ................

$ xxd testfile_changed-bytes.bin
00000000: 0000 0000 0000 1111 1111 1111 2222 2222  ............""""
00000010: 2222 3333 3333 3333 4444 4444 ffff 5555  ""333333DDDD..UU
00000020: 5555 5555 6666 6666 6666 7777 7777 7777  UUUUffffffwwwwww
00000030: 8888 8888 8888 9999 9999 9999 aaaa aaaa  ................
00000040: ffff bbbb bbbb bbbb cccc cccc cccc dddd  ................
00000050: dddd dddd eeee eeee eeee ffff ffff ffff  ................
```

The second file differs at offsets 0x1c/0x1d and 0x40/0x41. The rest is identical.

## Just diff

If you do `diff`, it will tell you if the files are equal or not.

```bash
$ diff testfile.bin testfile_changed-bytes.bin
Binärdateien testfile.bin und testfile_inserted-bytes.bin sind verschieden.
```

(This is German and means the files are different)

## cmp

If you do `cmp`, it will tell you where the **first** difference in the files is.

```bash
$ cmp --print-bytes testfile.bin testfile_changed-bytes.bin
testfile.bin testfile_changed-bytes.bin sind verschieden: Zeichen 29, Zeile 1 ist 104 D 377 M-^?
```

## diff and xxd

The next suggestion is to use `diff <(xxd b1) <(xxd b2)`.

```bash
$ diff <(xxd testfile.bin) <(xxd testfile_changed-bytes.bin)
2c2
< 00000010: 2222 3333 3333 3333 4444 4444 4444 5555  ""333333DDDDDDUU
---
> 00000010: 2222 3333 3333 3333 4444 4444 ffff 5555  ""333333DDDD..UU
5c5
< 00000040: aaaa bbbb bbbb bbbb cccc cccc cccc dddd  ................
---
> 00000040: aaaa bbbb bbbb bbbb cccc cccc ffff dddd  ................
```

In fish shell, use the following command (see [here](https://stackoverflow.com/questions/48855508/fish-error-while-trying-to-run-command-on-mac))

```bash
diff (xxd testfile.bin | psub) (xxd testfile_changed-bytes.bin | psub)
```

![]({{ site.baseurl }}/images/2021-07-17-binary-diffs/colordiff-xxd-changed-bytes.png)

This is an okayish result, because now we know at least in which lines the differences are.

You can also use `-y` or `--side-by-side`:

![]({{ site.baseurl }}/images/2021-07-17-binary-diffs/colordiff-xxd-sidebyside-changed-bytes.png)

## meld and xxd

```bash
meld <(xxd testfile.bin) <(xxd testfile_changed-bytes.bin)
```

![]({{ site.baseurl }}/images/2021-07-17-binary-diffs/meld-xxd-changed-bytes.png)

## dhex

We get an even better result if we use *dhex*, because it tells us exactly which bytes differ:

```bash
LINES=24 COLUMNS=80 dhex testfile.bin testfile_changed-bytes.bin
```

![]({{ site.baseurl }}/images/2021-07-17-binary-diffs/dhex-changed-bytes.png)

# Second file has bytes inserted

Now, let's come to the point of this article.
What happens when there are bytes inserted somewhere in the file?

```bash
$ xxd testfile_inserted-bytes.bin
00000000: 0000 0000 0000 1111 1111 1111 2222 2222  ............""""
00000010: 2222 ffff ffff ffff 3333 3333 3333 4444  ""......333333DD
00000020: 4444 4444 5555 5555 5555 6666 6666 6666  DDDDUUUUUUffffff
00000030: 7777 7777 7777 8888 8888 8888 9999 9999  wwwwww..........
00000040: 9999 aaaa aaaa aaaa bbbb bbbb bbbb cccc  ................
00000050: cccc cccc dddd dddd dddd eeee eeee eeee  ................
00000060: ffff ffff ffff                           ......
```

At offset 0x12, six bytes of 0xff have been inserted. The rest is identical.

## diff, cmp

diff and cmp still work the same.

## diff and xxd, meld and xxd, dhex

None of the tools provide a useable output.
They all claim that **all** bytes are changed after the first change.

```bash
$ diff <(xxd testfile.bin) <(xxd testfile_inserted-bytes.bin)
2,6c2,7
< 00000010: 2222 3333 3333 3333 4444 4444 4444 5555  ""333333DDDDDDUU
< 00000020: 5555 5555 6666 6666 6666 7777 7777 7777  UUUUffffffwwwwww
< 00000030: 8888 8888 8888 9999 9999 9999 aaaa aaaa  ................
< 00000040: aaaa bbbb bbbb bbbb cccc cccc cccc dddd  ................
< 00000050: dddd dddd eeee eeee eeee ffff ffff ffff  ................
---
> 00000010: 2222 ffff ffff ffff 3333 3333 3333 4444  ""......333333DD
> 00000020: 4444 4444 5555 5555 5555 6666 6666 6666  DDDDUUUUUUffffff
> 00000030: 7777 7777 7777 8888 8888 8888 9999 9999  wwwwww..........
> 00000040: 9999 aaaa aaaa aaaa bbbb bbbb bbbb cccc  ................
> 00000050: cccc cccc dddd dddd dddd eeee eeee eeee  ................
> 00000060: ffff ffff ffff                           ......
```

![]({{ site.baseurl }}/images/2021-07-17-binary-diffs/colordiff-xxd-inserted-bytes.png)

![]({{ site.baseurl }}/images/2021-07-17-binary-diffs/colordiff-xxd-sidebyside-inserted-bytes.png)

![]({{ site.baseurl }}/images/2021-07-17-binary-diffs/meld-xxd-inserted-bytes.png)

![]({{ site.baseurl }}/images/2021-07-17-binary-diffs/dhex-inserted-bytes.png)

## Solution

The best I came up with after some research was to output each file one byte a line
and diff that outcome.

It is far from perfect, but was good enough for my specific problem.

```bash
meld <(xxd -c 1 -ps testfile.bin) <(xxd -c 1 -ps testfile_inserted-bytes.bin)
diff <(xxd -c 1 -ps testfile.bin) <(xxd -c 1 -ps testfile_inserted-bytes.bin)
diff --unified <(xxd -c 1 -ps testfile.bin) <(xxd -c 1 -ps testfile_inserted-bytes.bin)

# Only shows offsets of changes.
# Example output: 00000012-00000012 (00000000) <-> 00000012-00000018 (00000006)
# Format:         from    -to [file 1]  (size) <-> from    -to [file 2]  (size)
# All numbers are hex values
diff --changed-group-format="%08xe-%08xl (%08xn) <-> %08xE-%08xL (%08xN) %c'\012'" --unchanged-group-format="" <(xxd -c 1 -ps testfile.bin) <(xxd -c 1 -ps testfile_inserted-bytes.bin)
```

![]({{ site.baseurl }}/images/2021-07-17-binary-diffs/colordiff-xxd-inserted-bytes-c1.png)

![]({{ site.baseurl }}/images/2021-07-17-binary-diffs/meld-xxd-inserted-bytes-c1.png)

![]({{ site.baseurl }}/images/2021-07-17-binary-diffs/diff-offsets-only.png)
