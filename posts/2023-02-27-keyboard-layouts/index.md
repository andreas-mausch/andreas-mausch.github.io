---
title: "Keyboard layouts, laptops and programming"
date: 2023-02-27T20:00:00+01:00
tags: ['eurkey', 'mechanical keyboard', 'fn+left']
thumbnail: eurkey-layout.svg
---

# US keyboard layout, umlauts and EurKEY

When you start programming on a German (DE) keyboard layout, you will
quickly notice that some keys, like curly brackets, are hard to type.

`AltGr + 7` requires some mad skills for your right hand.
If you decide to use both hands instead, you need to align your left hand again afterwards.

When you discover the US layout, it seems to be so much better for programming:
Lots of keys are accessible even without Shift, brackets are easy to access,
and all keys for using a shell are placed more conventient to reach.

However, when I decided to make the full switch, I realized German umlauts
are now...nowhere.

There are two good solutions for that: Use an US Intl layout, which maps
Ä to `AltGr + Q`, Ü to `AltGr + Y`, Ö to `AltGr + P` and ß to `AltGr + S`.

The second option, which I prefer and now use, is [EurKEY](https://eurkey.steffen.bruentjen.eu/),
the **European Keyboard Layout for Europeans, Coders and Translators**.
It comes preinstalled with Manjaro and after some readjusting is a joy to use.
ä, ö, ü are now placed on AlgGr + a, o and u, which is easy to remember.

I do own ISO and ANSI keyboards, and I am comfortable using EurKEY on both.

{% image "eurkey-layout.svg", "EurKEY Keyboard Layout" %}

# Keyboard shortcomings

Some keyboard manufacturers don't seem to be programmers.

Dell for example: My XPS 15 7950 has a great keyboard and also a great mapping.
`Fn+Left` maps to Home, `Fn+Right` to End.
This is crucial for me, because I use these keys frequently
and it disrupts me if I'd have to move my right hand in the upper right area to press a key
which is on a different position on every keyboard. Too many misses, I need to find these keys blind.

So the same manufacturer, Dell, decided that `Fn+Left` does **not** map to Home
on the XPS 13 9370. In fact, it doesn't map to anything.
I love that laptop, but every time I use it, this bothers me.
And since the Fn-key mappings do not emit any scancode, the shortcuts cannot be defined on software level either.
This would be easily fixable by Dell, but they just don't care.

And it is [not](https://www.dell.com/community/XPS/Control-Home-Control-End-Keys/td-p/6212592)
[only](https://www.dell.com/community/XPS/Please-re-map-Fn-Left-and-Fn-Right-to-Home-and-End-on-the-new/td-p/7649522)
[me](https://www.dell.com/community/XPS/XPS-13-9300-Map-fn-left-and-fn-right-to-Home-and-End/td-p/7529433).

Or the XPS 13 9315 for example, which would make a good replacement for my old XPS 13,
has Home on `Fn+F11`. I can't even..
F11 is *of course* used for fullscreen-toggle in a number of apps, and pressing
a key on the *upper right area* together with Fn? You must be kidding..

Same goes for some sweet 65% keyboards, which have ugly mappings as well.

On a laptop I need:

- a dedicated F1-F12 function key row
- an AltGr key for umlauts and special characters
- `Fn+Left` maps to Home, `Fn+Right` maps to End
- `Fn+Up` maps to PageUp, `Fn+Down` maps to PageDown
- `Fn+Backspace` maps to Delete

Please.

# My personal favorite keyboard

My favorite keyboard right now is the
[Keychron K8 Non-Backlight Wireless Mechanical Keyboard](https://www.keychron.com/products/keychron-k8-non-backlight-wireless-mechanical-keyboard).

{% image "keychron-k8-tkl.jpg" %}

It is a Tenkeyless layout, it works on either USB or Bluetooth (up to three devices),
it has great mechanical switches and the best: it has retro colors and looks almost identical to my 386 keyboard.

{% image "highscreen-386-keyboard.jpg" %}
