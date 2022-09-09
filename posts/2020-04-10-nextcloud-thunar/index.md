---
title: Connect Thunar to Nextcloud
date: 2020-04-10T18:00:00+02:00
tags: ['nextcloud', 'thunar']
thumbnail: nextcloud-authentication.png
---

I was looking for a way to integrate the Nextcloud WebDAV interface into Thunar, a Linux file manager.

After some time I found you can just paste this link *davs://cloud.neonew.de/remote.php/dav/files/&lt;username&gt;*
into the address line. Then I've right clicked -> Store as bookmark.

However, only the first part of the link was stored: *davs://cloud.neonew.de/remote.php/dav*. :(

So next I tried to find out where Thunar stores it bookmarks. A lot of stuff I've found said *~~~/.gtk-bookmarks~~*.
This is outdated tho, and the file is now located at *~/.config/gtk-3.0/bookmarks*.

So add a new line to the file:

```{data-filename=~/.config/gtk-3.0/bookmarks}
davs://cloud.neonew.de/remote.php/dav/files/<username> Nextcloud
```

..and it should work as expected.

One thing about the authentication: You should setup a new app password in your user settings (in case you use 2FA you even have to):

{% image "nextcloud-authentication.png" %}
