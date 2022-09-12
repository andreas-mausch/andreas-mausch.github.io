---
title: Track your position with Nextcloud and PhoneTrack
date: 2020-10-16T17:00:00+02:00
tags: ['phonetrack', 'tracking', 'gps', 'nextcloud', 'osmand', 'gpxsee', 'filter-gpx']
thumbnail: nextcloud-phonetrack-export.png
---

# Tracking tools

I like to track my position via my phone and sync the data with my self-hosted Nextcloud server.

I use the [PhoneTrack app](https://apps.nextcloud.com/apps/phonetrack) for Nextcloud and the [PhoneTrack app](https://f-droid.org/en/packages/net.eneiluj.nextcloud.phonetrack/) for Android.

In addition, I use [OsmAnd~](https://f-droid.org/de/packages/net.osmand.plus/) with the [tracking plugin](https://osmand.net/features/trip-recording-plugin) to track planned excursions.

{% image "osmand.jpg" %}

# Exporting the data

You can export a .gpx file with all your data from PhoneTrack. To do so, follow these instructions:

{% image "nextcloud-phonetrack-export.png" %}

Now, you get a file with all your position data inside, which can be quite large.

# Filtering the data by date

In order to filter the position data by date, you can use the tool [gpsbabel](https://www.gpsbabel.org/).

I use this command to filter my input file `test.gpx` for the dates between 2020-10-10 and 2020-10-17:

```bash
gpsbabel -i gpx -f test.gpx -x track,start=20201010083000,stop=20201017153000 -o gpx -F filtered.gpx
```

# Display the GPX file

On Android I use also OsmAnd for this task. On a desktop system I can recommend [GPXSee](https://www.gpxsee.org/).
It is available for Windows, Linux and Mac.

{% image "gpxsee.png" %}
{% image "osmand-track.jpg" %}

# Filter by location

If you want to know how much time you've spent in a specific region, feel free to try out my little script `filter-gpx`:

[https://github.com/andreas-mausch/filter-gpx](https://github.com/andreas-mausch/filter-gpx)
