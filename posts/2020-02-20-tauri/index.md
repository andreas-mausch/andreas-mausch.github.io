---
title: Desktop apps with Tauri
date: 2020-02-20T14:00:00+01:00
tags: ['software-development', 'desktop', 'gui', 'tauri']
thumbnail: tauri-error-win7.png
---

I'm always looking for better ways to create desktop applications.
See [here]({% link-post "2017-12-10-kotlin-native" %}).

Now, the easiest way to compose UIs is HTML and CSS, because it is used everywhere.
And it would be great if it could be used to create desktop apps, right?

"Ah, there's Electron!" you might say. And yes, you are right. Electron exists.

However, I'm not exactly a fan of it, mainly because of the resulting executable file size (>100mb),
but also of security things..I'm sure the browser of most electron apps are never updated and
are target to hackers (see: [WhatsApp Desktop patches major security vulnerability](https://www.techradar.com/news/whatsapp-desktop-has-a-worrying-security-flaw)).
People call it the "flash for desktop" for a reason.

Now there's [Tauri](https://github.com/tauri-apps/tauri): It just uses the operating system's browser and a webview to display content.
Looks like a good option to me. Okay, you are limited to IE 10 (worst case) on Windows.
But beside that it looks super-promising imo:

> The user interface in Tauri apps currently leverages Cocoa/WebKit on macOS, gtk-webkit2 on Linux and MSHTML (IE10/11) or Webkit via Edge on Windows.
> -- [github.com/tauri](https://github.com/tauri-apps/tauri)

# Build

One (small) downside: You need to install a lot of dependencies. It's documented quite well, but you need to do it for each operating system of course.

## Linux

I've written a small docker image for builds on linux (see below), because I don't like to pollute my system with thousands of dependencies,
and the resulting binary is executable without the dev-dependencies.

I've ran `tauri init` once in the app directory, and now I can use this:

```bash
docker run -it --rm -v $(pwd):/root/app tauri tauri build
```

## Windows

Aha! Windows. You have to install the world. Prepare to spend some time on installing the prerequisites.

I've started on a clean Win7 box and had to install this:

- Windows Management Framework 5.1
- .NET Framework 4.8
- Powershell (optional)
- Chocolatey (optional)
- choco install git
- choco install nodejs-lts
- Visual Studio Build Tools (Note: Installing `visualstudio2019buildtools` was not sufficient, you need to install C++ support as well)  
  Use the following Shell for all further commands: `x64 Native Tools Command Prompt for VS 2019`
- rustup
- cargo install tauri-bundler --force
- cargo install tauri-cli --force
- npm install -g tauri

Now, in the project directory, run the normal build

- npm run build
- tauri build

And boom, you get a .exe file in the src-tauri/target/release folder.  
Unfortunately I had an issue to execute the file, see [this issue](https://github.com/tauri-apps/tauri/issues/440).

{% image "tauri-error-win7.png" %}

# Result

My test app loaded quickly and behaved just as the browser version.

<details markdown="1">
<summary>ldd src-tauri/target/release/app</summary>
```
$ ldd src-tauri/target/release/app
	linux-vdso.so.1 (0x00007fff7cac0000)
	libwebkit2gtk-4.0.so.37 => /usr/lib/libwebkit2gtk-4.0.so.37 (0x00007f1444a74000)
	libgtk-3.so.0 => /usr/lib/libgtk-3.so.0 (0x00007f1444392000)
	libgdk-3.so.0 => /usr/lib/libgdk-3.so.0 (0x00007f1444299000)
	libjavascriptcoregtk-4.0.so.18 => /usr/lib/libjavascriptcoregtk-4.0.so.18 (0x00007f1442c77000)
	libgobject-2.0.so.0 => /usr/lib/libgobject-2.0.so.0 (0x00007f1442c1b000)
	libglib-2.0.so.0 => /usr/lib/libglib-2.0.so.0 (0x00007f1442af6000)
	libdl.so.2 => /usr/lib/libdl.so.2 (0x00007f1442aef000)
	libpthread.so.0 => /usr/lib/libpthread.so.0 (0x00007f1442acd000)
	libgcc_s.so.1 => /usr/lib/libgcc_s.so.1 (0x00007f1442ab3000)
	libc.so.6 => /usr/lib/libc.so.6 (0x00007f14428ec000)
	/lib64/ld-linux-x86-64.so.2 => /usr/lib64/ld-linux-x86-64.so.2 (0x00007f1447fd2000)
	libm.so.6 => /usr/lib/libm.so.6 (0x00007f14427a6000)
	libGL.so.1 => /usr/lib/libGL.so.1 (0x00007f1442720000)
	libEGL.so.1 => /usr/lib/libEGL.so.1 (0x00007f144270d000)
	librt.so.1 => /usr/lib/librt.so.1 (0x00007f1442702000)
	libz.so.1 => /usr/lib/libz.so.1 (0x00007f14426e8000)
	libpango-1.0.so.0 => /usr/lib/libpango-1.0.so.0 (0x00007f144269a000)
	libharfbuzz.so.0 => /usr/lib/libharfbuzz.so.0 (0x00007f1442596000)
	libatk-1.0.so.0 => /usr/lib/libatk-1.0.so.0 (0x00007f144256d000)
	libcairo.so.2 => /usr/lib/libcairo.so.2 (0x00007f1442447000)
	libgdk_pixbuf-2.0.so.0 => /usr/lib/libgdk_pixbuf-2.0.so.0 (0x00007f1442421000)
	libgio-2.0.so.0 => /usr/lib/libgio-2.0.so.0 (0x00007f1442271000)
	libwpe-1.0.so.1 => /usr/lib/libwpe-1.0.so.1 (0x00007f1442267000)
	libWPEBackend-fdo-1.0.so.1 => /usr/lib/libWPEBackend-fdo-1.0.so.1 (0x00007f1442258000)
	libnotify.so.4 => /usr/lib/libnotify.so.4 (0x00007f144224e000)
	libxml2.so.2 => /usr/lib/libxml2.so.2 (0x00007f14420e6000)
	libxslt.so.1 => /usr/lib/libxslt.so.1 (0x00007f14420a5000)
	libsqlite3.so.0 => /usr/lib/libsqlite3.so.0 (0x00007f1441f74000)
	libicui18n.so.65 => /usr/lib/libicui18n.so.65 (0x00007f1441c80000)
	libicuuc.so.65 => /usr/lib/libicuuc.so.65 (0x00007f1441a9e000)
	libwoff2dec.so.1.0.2 => /usr/lib/libwoff2dec.so.1.0.2 (0x00007f1441893000)
	libfontconfig.so.1 => /usr/lib/libfontconfig.so.1 (0x00007f144184a000)
	libfreetype.so.6 => /usr/lib/libfreetype.so.6 (0x00007f144177c000)
	libharfbuzz-icu.so.0 => /usr/lib/libharfbuzz-icu.so.0 (0x00007f1441777000)
	libgcrypt.so.20 => /usr/lib/libgcrypt.so.20 (0x00007f1441659000)
	libgstapp-1.0.so.0 => /usr/lib/libgstapp-1.0.so.0 (0x00007f1441649000)
	libgstbase-1.0.so.0 => /usr/lib/libgstbase-1.0.so.0 (0x00007f14415d9000)
	libgstreamer-1.0.so.0 => /usr/lib/libgstreamer-1.0.so.0 (0x00007f14414c9000)
	libgstpbutils-1.0.so.0 => /usr/lib/libgstpbutils-1.0.so.0 (0x00007f1441493000)
	libgstaudio-1.0.so.0 => /usr/lib/libgstaudio-1.0.so.0 (0x00007f1441421000)
	libgsttag-1.0.so.0 => /usr/lib/libgsttag-1.0.so.0 (0x00007f14413e7000)
	libgstvideo-1.0.so.0 => /usr/lib/libgstvideo-1.0.so.0 (0x00007f1441346000)
	libgstgl-1.0.so.0 => /usr/lib/libgstgl-1.0.so.0 (0x00007f14412da000)
	libgstfft-1.0.so.0 => /usr/lib/libgstfft-1.0.so.0 (0x00007f14412ce000)
	libjpeg.so.8 => /usr/lib/libjpeg.so.8 (0x00007f1441237000)
	libpng16.so.16 => /usr/lib/libpng16.so.16 (0x00007f14411ff000)
	libopenjp2.so.7 => /usr/lib/libopenjp2.so.7 (0x00007f14411a2000)
	libwebp.so.7 => /usr/lib/libwebp.so.7 (0x00007f1441132000)
	libwebpdemux.so.2 => /usr/lib/libwebpdemux.so.2 (0x00007f144112c000)
	libsoup-2.4.so.1 => /usr/lib/libsoup-2.4.so.1 (0x00007f1441091000)
	libenchant-2.so.2 => /usr/lib/libenchant-2.so.2 (0x00007f1441084000)
	libgmodule-2.0.so.0 => /usr/lib/libgmodule-2.0.so.0 (0x00007f144107f000)
	libseccomp.so.2 => /usr/lib/libseccomp.so.2 (0x00007f1441036000)
	libsecret-1.so.0 => /usr/lib/libsecret-1.so.0 (0x00007f1440fd4000)
	libtasn1.so.6 => /usr/lib/libtasn1.so.6 (0x00007f1440fbe000)
	libhyphen.so.0 => /usr/lib/libhyphen.so.0 (0x00007f1440db6000)
	libX11.so.6 => /usr/lib/libX11.so.6 (0x00007f1440c76000)
	libXcomposite.so.1 => /usr/lib/libXcomposite.so.1 (0x00007f1440c71000)
	libXdamage.so.1 => /usr/lib/libXdamage.so.1 (0x00007f1440c6c000)
	libwayland-server.so.0 => /usr/lib/libwayland-server.so.0 (0x00007f1440c56000)
	libwayland-egl.so.1 => /usr/lib/libwayland-egl.so.1 (0x00007f1440c51000)
	libwayland-client.so.0 => /usr/lib/libwayland-client.so.0 (0x00007f1440c3f000)
	libstdc++.so.6 => /usr/lib/libstdc++.so.6 (0x00007f1440a55000)
	libpangocairo-1.0.so.0 => /usr/lib/libpangocairo-1.0.so.0 (0x00007f1440a45000)
	libpangoft2-1.0.so.0 => /usr/lib/libpangoft2-1.0.so.0 (0x00007f1440a2e000)
	libfribidi.so.0 => /usr/lib/libfribidi.so.0 (0x00007f1440a10000)
	libcairo-gobject.so.2 => /usr/lib/libcairo-gobject.so.2 (0x00007f1440a02000)
	libepoxy.so.0 => /usr/lib/libepoxy.so.0 (0x00007f14408d7000)
	libXi.so.6 => /usr/lib/libXi.so.6 (0x00007f14408c4000)
	libatk-bridge-2.0.so.0 => /usr/lib/libatk-bridge-2.0.so.0 (0x00007f1440890000)
	libXfixes.so.3 => /usr/lib/libXfixes.so.3 (0x00007f1440887000)
	libxkbcommon.so.0 => /usr/lib/libxkbcommon.so.0 (0x00007f1440846000)
	libwayland-cursor.so.0 => /usr/lib/libwayland-cursor.so.0 (0x00007f144083b000)
	libXext.so.6 => /usr/lib/libXext.so.6 (0x00007f1440826000)
	libXcursor.so.1 => /usr/lib/libXcursor.so.1 (0x00007f144081a000)
	libXrandr.so.2 => /usr/lib/libXrandr.so.2 (0x00007f144080d000)
	libXinerama.so.1 => /usr/lib/libXinerama.so.1 (0x00007f1440808000)
	libffi.so.6 => /usr/lib/libffi.so.6 (0x00007f14407fb000)
	libpcre.so.1 => /usr/lib/libpcre.so.1 (0x00007f1440788000)
	libGLdispatch.so.0 => /usr/lib/libGLdispatch.so.0 (0x00007f14406d1000)
	libGLX.so.0 => /usr/lib/libGLX.so.0 (0x00007f144069e000)
	libthai.so.0 => /usr/lib/libthai.so.0 (0x00007f1440693000)
	libgraphite2.so.3 => /usr/lib/libgraphite2.so.3 (0x00007f144066c000)
	libpixman-1.so.0 => /usr/lib/libpixman-1.so.0 (0x00007f14405c2000)
	libxcb-shm.so.0 => /usr/lib/libxcb-shm.so.0 (0x00007f14405bd000)
	libxcb.so.1 => /usr/lib/libxcb.so.1 (0x00007f1440593000)
	libxcb-render.so.0 => /usr/lib/libxcb-render.so.0 (0x00007f1440583000)
	libXrender.so.1 => /usr/lib/libXrender.so.1 (0x00007f1440576000)
	libmount.so.1 => /usr/lib/libmount.so.1 (0x00007f1440517000)
	libresolv.so.2 => /usr/lib/libresolv.so.2 (0x00007f14404fe000)
	liblzma.so.5 => /usr/lib/liblzma.so.5 (0x00007f14404d6000)
	libicudata.so.65 => /usr/lib/libicudata.so.65 (0x00007f143ea25000)
	libwoff2common.so.1.0.2 => /usr/lib/libwoff2common.so.1.0.2 (0x00007f143e822000)
	libbrotlidec.so.1 => /usr/lib/libbrotlidec.so.1 (0x00007f143e812000)
	libexpat.so.1 => /usr/lib/libexpat.so.1 (0x00007f143e7e2000)
	libuuid.so.1 => /usr/lib/libuuid.so.1 (0x00007f143e7d9000)
	libbz2.so.1.0 => /usr/lib/libbz2.so.1.0 (0x00007f143e7c6000)
	libgpg-error.so.0 => /usr/lib/libgpg-error.so.0 (0x00007f143e7a3000)
	libunwind.so.8 => /usr/lib/libunwind.so.8 (0x00007f143e787000)
	libdw.so.1 => /usr/lib/libdw.so.1 (0x00007f143e733000)
	liborc-0.4.so.0 => /usr/lib/liborc-0.4.so.0 (0x00007f143e6b1000)
	libgstallocators-1.0.so.0 => /usr/lib/libgstallocators-1.0.so.0 (0x00007f143e6ab000)
	libX11-xcb.so.1 => /usr/lib/libX11-xcb.so.1 (0x00007f143e6a6000)
	libgudev-1.0.so.0 => /usr/lib/libgudev-1.0.so.0 (0x00007f143e697000)
	libdrm.so.2 => /usr/lib/libdrm.so.2 (0x00007f143e682000)
	libgbm.so.1 => /usr/lib/libgbm.so.1 (0x00007f143e671000)
	libgssapi_krb5.so.2 => /usr/lib/libgssapi_krb5.so.2 (0x00007f143e621000)
	libpsl.so.5 => /usr/lib/libpsl.so.5 (0x00007f143e60e000)
	libdbus-1.so.3 => /usr/lib/libdbus-1.so.3 (0x00007f143e5c2000)
	libatspi.so.0 => /usr/lib/libatspi.so.0 (0x00007f143e58b000)
	libdatrie.so.1 => /usr/lib/libdatrie.so.1 (0x00007f143e384000)
	libXau.so.6 => /usr/lib/libXau.so.6 (0x00007f143e37f000)
	libXdmcp.so.6 => /usr/lib/libXdmcp.so.6 (0x00007f143e377000)
	libblkid.so.1 => /usr/lib/libblkid.so.1 (0x00007f143e324000)
	libbrotlicommon.so.1 => /usr/lib/libbrotlicommon.so.1 (0x00007f143e301000)
	libelf.so.1 => /usr/lib/libelf.so.1 (0x00007f143e2e7000)
	libudev.so.1 => /usr/lib/libudev.so.1 (0x00007f143e2bd000)
	libkrb5.so.3 => /usr/lib/libkrb5.so.3 (0x00007f143e1d0000)
	libk5crypto.so.3 => /usr/lib/libk5crypto.so.3 (0x00007f143e19a000)
	libcom_err.so.2 => /usr/lib/libcom_err.so.2 (0x00007f143e194000)
	libkrb5support.so.0 => /usr/lib/libkrb5support.so.0 (0x00007f143e185000)
	libkeyutils.so.1 => /usr/lib/libkeyutils.so.1 (0x00007f143e17e000)
	libunistring.so.2 => /usr/lib/libunistring.so.2 (0x00007f143dffc000)
	libidn2.so.0 => /usr/lib/libidn2.so.0 (0x00007f143dfdb000)
	libsystemd.so.0 => /usr/lib/libsystemd.so.0 (0x00007f143df32000)
	liblz4.so.1 => /usr/lib/liblz4.so.1 (0x00007f143df10000)
```
</details>

File size is 6.6 MB.

{% image "tauri.png" %}

# Dockerfile

```docker
FROM ubuntu:19.10

ENV DEBIAN_FRONTEND=noninteractive
ENV TZ=Europe/Berlin

# Dev tools
RUN apt-get update && apt-get install -y libwebkit2gtk-4.0-dev build-essential curl libssl-dev gnupg

# Node
RUN curl -sL https://deb.nodesource.com/setup_12.x | bash -
RUN apt-get -y install nodejs

# Rust
RUN curl --proto '=https' --tlsv1.2 -sSf https://sh.rustup.rs | sh -s -- -y
ENV PATH="/root/.cargo/bin:${PATH}"

# Tauri
RUN cargo install tauri-bundler --force
RUN cargo install tauri-cli --force

RUN npm install --unsafe-perm -g tauri

WORKDIR /root/app
```

```bash
docker build -t tauri .
```

Note on the Dockerfile: I *hate* the way you have to install node and rust. Running scripts from the web. :/
This should be discouraged.

Tauri at least warns about it in their documentation:

> We have audited this bash script, and it does what it says it is supposed to do. Nevertheless, before blindly curl-bashing a script, it is always wise to look at it first.  
  [github.com/tauri](https://github.com/tauri-apps/tauri/wiki/02.-Linux-Setup)

Their reasoning is pretty...naive at least. They've audited the script *once*? And now they believe it never changes / cannot be changed afterwards?! ... :(
