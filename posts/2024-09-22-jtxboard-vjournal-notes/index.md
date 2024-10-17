---
title: "jtxBoard: Notes and Journals on Nextcloud"
date: 2024-09-22T18:00:00+02:00
tags: ['selfhosted', 'nextcloud', 'caldav']
toc: true
thumbnail: jtxBoard-collections.jpg
---

# Intro

On my self-hosted Nextcloud instance I used to use [Nextcloud Notes](https://apps.nextcloud.com/apps/notes)
and the [Android app](https://f-droid.org/de/packages/it.niedermann.owncloud.notes/) to sync my notes.

But since I discovered [jtxBoard](https://jtx.techbee.at/), I always wanted to make the switch:
jtxBoard uses the VJOURNAL entry in CalDAV calendars to sync journals and notes.

This is great, because it follows a standard protocol (iCalendar / RFC-5545), which could be used by a lot of programs,
and is independent from what the Nextcloud devs will do in future.

However, there are not a lot of clients which support VJOURNAL unfortunately, but more on that later.

When I tried jtxBoard on my phone for the first time, I discovered my existing calendars couldn't be used
immediately.
That's because calendars in iCalendar can be set up for different purposes:

- Calendar
- Tasks
- Journal

By default, Nextcloud only enables the Calendar and optionally the Tasks feature for it's calendars.
To make it work with journals, you need to create a new iCalendar in DAVx5, enable all features and then sync it to Nextcloud.

{% image "DAVx5.jpg" %}

Since it is not possible to add a feature after creation (at least I don't know a way), there are some extra
steps in order to keep all your existing entries.

# Difference between Journal and Note entry

Both are stored as VJOURNAL entry in your iCalendar, with their only difference is
journal entries do have a date entry, while notes do not.

# Convert calendar

1. Backup your existing calendar

Follow this guide:

https://makesmart.net/blog/read/nextcloud-backup-kontakte-und-kalender-sichern

Edit calendar, then you can select *Export* to download the .ics file.
This already includes the tasks!

2. Delete your calendar in nextcloud

Be careful here and make sure you have a complete backup.
This step also deletes the related tasks list, even though that's not clear from the web interface.

3. Create a new calendar

Important: Do it on the phone in DAVx5.
This way, you can select to create Calendar/Tasks and also Journal.
Which is important to make it work with jtxBoard.

4. Import .ics file

In Nextcloud, under *Calendar -> Settings* there is an import button.
After selecting the .ics file, you can choose the calendar to import to.

For me, I have seen a lot of failed requests (HTTP 500) in the network tab.
I had to re-import the .ics several times until all entries have been imported correctly.
Not sure what the issue was, maybe some kind of rate-limiting.

5. Change the default..

.. calendar and todo list in Nextcloud to create new entries there.

{% image "jtxBoard-collections.jpg" %}
{% image "jtxBoard-notes.jpg" %}

# Desktop client

While syncing calendar entries and todos works with most clients,
unfortunately, there seems to be no good gui client for Linux out there yet which supports journals. :(

But I do have hope it will find some adoption soon.

See here:
[jtxBoard GitHub Issue: What is the best desktop client?](https://github.com/TechbeeAT/jtxBoard/discussions/542)

and Thunderbird integration request here:
[Support VJOURNAL in Thunderbird](https://connect.mozilla.org/t5/ideas/support-vjournal-in-thunderbird/idi-p/46295)

Joplin will not support VJOURNAL:
[To-Dos - sync with CalDAV-Server](https://discourse.joplinapp.org/t/to-dos-sync-with-caldav-server/3677)

KOrganizer and Evolution support journals I think, but I haven't tried them.

# Deleting old calendar entries

To cleanup the calendar to not keep data of all times in the cloud, I will try this tool:
[github.com/flozz/calcleaner](https://github.com/flozz/calcleaner)
