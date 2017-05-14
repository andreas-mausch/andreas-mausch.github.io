---
layout: post
title:  "Compass App in Kotlin"
date:   2017-05-14 02:00:00 +02:00
tags:
---

My colleague spent some time researching into [Kotlin](https://kotlinlang.org/). He was so impressed that it is now his favorite programming lanuage. So I decided to take a look at it and wrote a small compass app.

I've used IntelliJ with the Android and Kotlin plugins and it was very easy to [get started](https://kotlinlang.org/docs/tutorials/kotlin-android.html). One notable thing is the convenient copy&paste of Java code into the IDE, which then automatically asks if it should convert the code into Kotlin. It worked very well. The language itself looks interesting as well. Although this app doesn't really contain a lot of code, I will dig deeper into the language. In some aspects it reminds me of Scala.

One thing I disliked a lot: I had to convert the SVG image into Android's special VectorDrawable format. I don't understand why they come up with a completely new format when there already is a standardized one. Well. It cost me some time because the first images I've tried using the built-in svg->vector converter were stretched or missing half of the image. I've finally found this nice [SVG](http://all-free-download.com/free-vector/download/compass-vector_161297.html) though, which worked perfectly.

[https://github.com/andreas-mausch/compass](https://github.com/andreas-mausch/compass)  
[Download APK](https://github.com/andreas-mausch/compass/releases)

![Screenshot]({{ site.baseurl }}/images/2017-05-14-compass.jpg)
