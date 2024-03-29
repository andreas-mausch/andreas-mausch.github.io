---
title: "Native Desktop GUI apps: wxWidgets with conan and premake"
date: 2020-09-29T18:00:00+02:00
tags: ['native', 'c++', 'gui', 'conan', 'premake']
thumbnail: win.png
---

I'm always looking for better ways to create desktop applications.

See [here]({% link-post "2017-12-10-kotlin-native" %}).
And [here]({% link-post "2020-02-20-tauri" %}).

Today: **wxWidgets**

{% image "linux.png" %}
{% image "win.png" %}
{% image "mac.png" %}

The repo for my experiment is here: [https://github.com/andreas-mausch/wxwidgets-conan-premake](https://github.com/andreas-mausch/wxwidgets-conan-premake)

# Stats

Binary sizes on Linux are 7 MB and 11 MB (with XRC).

# Conan and Premake

[Conan](https://conan.io) is a C/C++ Package Manager.  
[Premake](https://premake.github.io) is a build configuration tool.

They work very well together.

## Conan

As someone who never used a dependency manager for C++, I was positively surprised by the ease to add third-party code.

It's feels like adding a maven dependency to a Java project.
I might take a bit longer the first time you install it (because you might need to compile it first),
but then it's just nice to have the include and library directories set up automatically.

As you can see in the whatsapp-viewer repo, I still copy/pasted the dependencies into my own repo,
something which is a very bad practice and something I've [criticized myself]({% link-post "2020-02-12-element-ui" %}) for good reasons.

It's a joy to quickly add a new dependency, even if you might have to build it first.

The only thing which was tricky and not so easy was the 'imports' section.  
I had to execute the wxrc binary (which comes with wxwidgets). So I have to use the binary from the dependency. Unfortunately, the executable name on Windows and Linux/Mac is different (of course!).  
The solution was to write two lines into the conanfile: One for the `wxrc-3.1` for Linux and Mac, and another for the `wxrc.exe` on Windows.

Update 2020-10-05: Okay, dependencies or their receipes must be maintained by somebody, and apparently this isn't the case for [SqLiteCpp](https://github.com/SRombauts/SQLiteCpp) which is available in version 3.0 since nine months now. The newest version in conan is 2.5, even though it is part of the offical *conan-center-index*. Someone reported an [issue](https://github.com/conan-io/conan-center-index/issues/2217), but there is no reaction yet..

## Premake

Premake can generate either makefiles, visual studio projects or xcode projects, all with a single description file.
Very useful for cross-platform development.

I've decided to try it out instead of CMake, because while CMake is widely used, it's syntax is ugly and harder to understand than Premake's.
The main reason I found on the internet to use CMake was "because others use it", which by itself is not a very strong argument..

Premake was ok to set up, but I didn't manage to properly clear the *generated* folder if you call *make clean*.

There is something like [cleancommands](https://github.com/premake/premake-core/wiki/cleancommands), but they are not intended to be used in a *WindowedApp*. Well.

Also, I've started by using `os.mkdir()` to create the directory, however I've discovered later the much better way is to use `{MKDIR}` inside the *prebuildcommands*.
The downside of `os.mkdir()` is: The directory is created at the time you excecute `premake5`, rather than in front of every single build. The directory might have been deleted in between.

# Critism on wxWidgets

I always thought wxWidgets is some very old technology and pretty much deprecated.
It is old, but actively maintained and not deprecated at all.

I really really dislike some things though, like:

- It is not a pure GUI library (although they don't aim to be one)
- Feels bloated (see below)
- Macros :cold_sweat:  
  ~~The `wxBEGIN_EVENT_TABLE` declaration for example.~~ can be avoided by using [dynamic events](https://docs.wxwidgets.org/3.1/overview_events.html#overview_events_bind)  
  Some macros are even poorly documented, like `XRCSIZERITEM`: It is only mentioned on the *XML Based Resource System (XRC)* page. There is no overview page of all macros available.
- Reinvent the wheel: Classes like wxString, wxInputStream?? Use std::string, std::istream please!  
  They state:
  > wxWidgets has its own set of stream classes, as an alternative to often buggy standard stream libraries, and to provide enhanced functionality.

  I believe there was a time when their statement was true, but I also believe a lot has changed since then, and the standard implementations are good now.
  
  The list for their self-written alternatives is long.
- Magic: You create a frame by calling `new MyFrame()`, but you never `delete` it yourself.  
  This is [automagically handled by wxWidgets](https://docs.wxwidgets.org/3.1/overview_windowdeletion.html).  
  While it not only looks confusing in the code, it also means that you **cannot use smart pointers** like unique_ptr for the wxWidgets classes. :(
- No [RAII](https://en.wikipedia.org/wiki/Resource_acquisition_is_initialization): I see a lot of Init()/Destroy() methods, examples where Destroy() is called [manually](https://wiki.wxwidgets.org/Writing_Your_First_Application-Common_Dialogs) (although it can be avoided for the wxFileDialog) and so on. Doesn't really feel C++ish.
- Complex controls: wxWidgets offers the basic controls like a Win32 API.  
  However, once you want to have just a little more sophisticated controls, like a [custom list](https://forums.wxwidgets.org/viewtopic.php?t=40950)
  which you will see in almost every program, you have to do a lot of programming yourself.
  On other systems (like Android) developers usually get these provided.
- No overlapping/z-order for child windows: That was a surprise to me! I'm curious how to do overlays (wxOverlay, wxBusyInfo or wxProgressDialog maybe?) like loading spinners.
- Some system settings are not used: You need to set the scrolling rate for a `wxScrolledWindow`. It is specified in pixels, and therefore ignores any system setting. I know at least KDE and Windows have an option to set the number of lines scrolled by mouse wheel.
- HiDPI support: Displays with high DPI are out for so long now, but either the programmers who use wxWidgets are all bad or wxWidgets support for HiDPI is not very great. I will soon find out.
  I gave codelite a try as my next C++ IDE, but just installing it and looking at tiny fonts made me a bit mad.
  Some research showed I was [not](https://github.com/eranif/codelite/issues/629) [alone](https://github.com/eranif/codelite/issues/1347).
  These issues are quite dated though, and I have DPI problems with a lot of other programs (IntelliJ for example).
  So I still have hope my worries are baseless and let's see, maybe my experience with wxWidgets and HiDPI will be good.
- In a perfect world, I'd like to replace the GUI library without touching the business logic at all.
  However, with wxWidgets I have to implement a wxApp class and it even asks me to use their main() function.
  If I would use all of their eco-system like streams, threads etc. then it would become a lot of work to replace wxWidgets in my app.

The 'Hello World' wxWidgets on Linux results in a 7 MB executable. Imo that's bloated, and imo wxWidgets carries
a lot of stuff which might be convenient, but doesn't belong in a pure GUI lib (implementations of jpeg, png, zlib, html, webview (a complete browser!), ..).
I'm not quite sure why the linker doesn't discard the unused bits. I can't believe there is 7 MB code needed to render an empty window.

If you add support for XRC, my binary increases to 11mb. :(

In my opinion they should decide to be either a pure GUI library or a full-blown "app-environment", which features almost everything an OS offers, but in an OS-independet way. They are neither fish nor fowl.

# Alternatives?

Most of my critism also applies to Qt, which I dislike a lot more for their bloatiness.

Unfortunately, [libui](https://github.com/andlabs/libui) doesn't seem to be moving. :(

However, if you look for a GUI library which renders native controls and can be linked statically on all platforms, you don't have much of a choice but to use wxWidgets.
That's why I have to say it is my preferred library to build native desktop apps today.

If you know any other/better library, please let me know.
