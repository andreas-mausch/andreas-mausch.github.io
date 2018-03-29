---
layout: post
title:  "Migration to Visual Studio 2017"
date:   2018-03-29 7:00:00 +02:00
tags:
---

I've developed [WhatsApp Viewer](https://github.com/andreas-mausch/whatsapp-viewer) with the good old Visual Studio 2008.
It's a bit dated and doesn't support all of the new C++ [features](http://en.cppreference.com/w/cpp/language/history).

Since the new Visual Studio 2017 is free (no costs) for personal usage and open-source projects, I thought it might be worth a shot.

## Setup

My main development machine runs Linux Mint, and I prefer it over Windows **a lot**.
Even though I use dual-boot (for games), I develop WhatsApp Viewer on Linux using a virtual machine running Windows XP.

Visual Studio 2017 doesn't support XP anymore, so I had to set up a new virtual box and decided to go with Windows 7 then.

The VS2017 installer first complained about a missing update ([KB4019990](http://support.microsoft.com/kb/4019990)) and about the missing .NET 4.5 framework (I've installed 4.7.1 instead). This was easy to fix.
Next, I've selected all options I wanted to install and let the setup do it's job. This took some time, as it downloaded roughly 20 GB. The conversion of the old project files went well.

After the installation was successful, I've tried to build WhatsApp Viewer. I missed to install the "MFC and ATL Support" option, which led to [this](https://social.msdn.microsoft.com/Forums/de-DE/6b69607a-8a84-4e46-b3c8-5cd832bfb9c7/vs-2017-rc-file-error-rc1015-cannot-open-include-file-afxresh?forum=vcgeneral) error message, complaining about afxres.h not found.

Next, I was able to build the project, but encountered a runtime error "Windows Imaging Component couldn't be initialized". This could be fixed by changing the "Platform toolset" to "Visual Studio 2017 - Windows XP (v141_xp)". See [this link](https://social.msdn.microsoft.com/Forums/windowsdesktop/en-US/e542d34a-a04b-455e-bd5b-957f162bab94/clsidwicimagingfactory-breaking-change-since-vs11-beta-on-windows-7?forum=windowswic) for detailed information.

![]({{ site.baseurl }}/images/2018-03-29-migration-to-visual-studio-2017/platform-toolset.png)

Now the compiled program worked.
However, when I tried to debug it, some windows showed "The content requires a new version of Internet Explorer". After I've downloaded the newest IE 11 this was fixed.

![]({{ site.baseurl }}/images/2018-03-29-migration-to-visual-studio-2017/msvcie.png)

I've additionally added Clang and exported the virtual machine as an [.ova](https://en.wikipedia.org/wiki/Open_Virtualization_Format) image for future usage.
The only disadvantage is the size: The new image takes ~40 GB on my hard-drive, compared to the 12 GB of Visual Studio 2008 (compressed as .ova its 19 GB vs 6 GB).

## Analysis

Too see if something major changed, I did a quick analysis on the resulting .exe files.
Therefore I exported the file headers of both .exe using [pev](https://github.com/merces/pev).

```
$ readpe WhatsApp\ Viewer.vs2008.exe > WhatsApp\ Viewer.vs2008.exe.readpe.txt
$ readpe WhatsApp\ Viewer.vs2017.exe > WhatsApp\ Viewer.vs2017.exe.readpe.txt
$ readpe -f json WhatsApp\ Viewer.vs2008.exe > WhatsApp\ Viewer.vs2008.exe.readpe.json
$ readpe -f json WhatsApp\ Viewer.vs2017.exe > WhatsApp\ Viewer.vs2017.exe.readpe.json
$ jq ".[\"Imported functions\"][].Functions[].Name" < WhatsApp\ Viewer.vs2008.exe.readpe.json | sort > WhatsApp\ Viewer.vs2008.exe.imports.txt
$ jq ".[\"Imported functions\"][].Functions[].Name" < WhatsApp\ Viewer.vs2017.exe.readpe.json | sort > WhatsApp\ Viewer.vs2017.exe.imports.txt
```

![]({{ site.baseurl }}/images/2018-03-29-migration-to-visual-studio-2017/pe-diff.png)

No new runtime dependencies (.dll) are required. Some imports now use the Unicode version instead of Ansi.
Beside that, I couldn't find major differences.
I am quite happy with the result. I expect similar performance and can now use better tools and the new and improved C++ language features.
