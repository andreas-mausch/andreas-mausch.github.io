---
title: "Philips OLED hidden Service Menu"
date: 2023-04-17T22:00:00+02:00
tags: ['philips', 'oled', 'tv', 'menu', 'pixel shifting']
thumbnail: test-card.jpg
---

I have bought a **Philips 48OLED707/12** for my homeoffice setup.

It is a great TV / monitor, but you might not like it's OLED protection settings.
The screen saver comes on automatically and there is no way to disable it,
you are forced to power it off for ~10min minimum after a long session..

..but the worst for me was the pixel shifting.
Even in Gaming / PC mode I noticed the screen is not fully displayed.
This is especially noticable when you look at the corners of the menu bars.

# Disable Pixel Shifting

I've searched the internet for a solution and indeed there is a (temporary) one.
But wow, it is hidden:

You need to press **Home -> 1999 -> Back Button** and you are presented with this service menu:

{% image "service-menu.jpg" %}

I have no idea what all of these settings mean, but one menu item is called *OLED IMAGESHIFT*.

{% image "oled-imageshift-disabled.jpg" %}

You can change its value by pressing *Right*.
The changed value (= FALSE) wasn't immediately visible in the menu (only after re-opening the menu),
but the value itself changed.
I immediately noticed that the screen corrected itself and pixel shifting was indeed disabled. Hooray.

{% image "test-card.jpg" %}

{% image "corner-view.jpg" %}

This setting is not permanent though, so you might need to repeat the steps above from time to time.

# Another secret service menu?

There is also a second menu. It wasn't very helpful to me, but for the sake of completeness:
You can press **0,6,2,5,9,6 OK** when connected to another display via HDMI.
It will bring up this screen:

{% image "second-secret-menu-warning.jpg" %}

{% image "second-secret-menu.jpg" %}

{% image "second-secret-menu-events-log.jpg" %}
