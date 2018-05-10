---
layout: post
title:  "Kotlin Native"
date:   2017-12-10 19:00:00 +01:00
tags:
---

# Double-click & run

I like to develop small native desktop apps like [WhatsApp Viewer](https://andreas-mausch.de/whatsapp-viewer/) or [CS:GO Demoviewer](https://github.com/andreas-mausch/csgo-demohighlights).

However, whenever I want to create an application like this, I struggle to decide on the technology to use.
Most of the time I (still) end up using C++, because I know it is able to produce a binary which runs on
any target machine without the need to install any additional libraries, dependencies or frameworks.
I don't want to explain to people how to install this or that. People don't want to do it, neither.

Extract the .exe -> run. Works.

## C++: Downsides

Now I'm not a particular fan of the language itself. It is very powerful, but it has aged.
For example I really dislike the way how to add third-party libraries. Sometimes you get a compiled
.lib which only works on the target architecture, sometimes you get source (which might be a pain to
successfully compile) and so on. It is nowhere near the "add three lines to your pom.xml" comfort.

Secondly, I dislike the separation of header and implementation, leading to duplication all over the place.

Thirdly, the development tools are just way better for the newer technologies out there. You are just way faster
developing in Java, JavaScript, Python, etc.
I always feel set back to the 90s when developing in C++.

## Alternatives?

That's the reason why I regulary look for alternatives. I took a look at Rust, which lacks a good GUI framwork
imo, and at Electron with vue.js for a [rewrite of WhatsApp Viewer](https://github.com/andreas-mausch/whatsapp-viewer/tree/electron).
It was great to use, but comes with a big downside: It ends up in a 150 MB binary which needs to be distributed to customers.

Another *big* downside: Memory usage. The Slack app, which is also written in Electron, takes ~700 MB on my machine with three workspaces opened. C'mon.

So bottom line: I still develop with C++ and all the downsides for Desktop applications to provide no-installation, double-click-and-run, 3 MB executables.

# Kotlin Native

Now a colleague of mine started to experiment with Kotlin, as I've written in a [previous post]({{ site.baseurl }}{% post_url blog/2017-05-14-compass-app-in-kotlin %}).
So for Kotlin, there is also *Kotlin Native*, which looks extremely interesting to me.
You can write code in a modern and great language, and it still compiles to small bytecode by using LLVM.

## How about the...runtime?

I'm a bit curious about how it does some things, for example I personally hate garbage collection.
It's a way to make things easy for developers, but imo it is the responsibility to the programmer to clean up correctly.
Now people still say that "uh, you might forget a free() or delete in C++, causing memory leaks".
Well, I think you don't need to call any delete manually nowadays.

Also, I don't see how the language/runtime should be responsible for managing memory for you, but not
all the other resources like open file handles, network streams and so on.
Yes, I know there are crutches like try-with-resources. try-catch was introduced for exception handling,
and is now sometimes used in some weird try-finally-constructs to somehow make resource management possible. Urgh!

In C++ they have a solution for it which I love: [RAII](https://en.wikipedia.org/wiki/Resource_acquisition_is_initialization) (especially in combination with smart pointers).  
You simply can't forget to close a file.
There is an owner for each object, and once you leave the scope, the destructor is called for you *automatically*.
Even if there's an exception.
I prefer this over garbage collection all day long.

## Hello World project

I used [this project](https://github.com/msink/hello-kotlin).
It was very easy to set up. When you call ./gradlew build for the first time, it downloads all dependencies for you. Convenient. :)

```
fun main(args: Array<String>) {
    println("Hello World!")
}
```
Hello.kt

```
$ pwd
./hello-kotlin/build/konan/bin/linux

$ ls -lh
-rwxr-xr-x 1 neonew neonew 404K Dez 10 17:40 Hello-linux.kexe*
-rw-r--r-- 1 neonew neonew 2,4K Dez 10 17:40 Hello-linux.kt.bc

$ ./Hello-linux.kexe
Hello World!

$ ldd Hello-linux.kexe
	linux-vdso.so.1 =>  (0x00007ffd6a705000)
	libdl.so.2 => /lib/x86_64-linux-gnu/libdl.so.2 (0x00007f262531f000)
	libm.so.6 => /lib/x86_64-linux-gnu/libm.so.6 (0x00007f2625016000)
	libpthread.so.0 => /lib/x86_64-linux-gnu/libpthread.so.0 (0x00007f2624df8000)
	libgcc_s.so.1 => /lib/x86_64-linux-gnu/libgcc_s.so.1 (0x00007f2624be2000)
	libc.so.6 => /lib/x86_64-linux-gnu/libc.so.6 (0x00007f2624818000)
	/lib64/ld-linux-x86-64.so.2 (0x000055d6b9e10000)
```

File size looks awesome already, the Hello World example is just 404 KB.

# Conclusion

So for Kotlin Native I will analyse how it handles garbage collection and how much stuff the Kotlin runtime in the binary does.
As a programmer, I like to be in control and prefer if not too much magic happens there.
I want to dig deep into how it works and debug resulting assembly in OllyDbg to get an idea about performance and size.

I have a very good feeling about Kotlin Native in that regard.  
It looks soo promising and I'm excited to try it on a real project.
