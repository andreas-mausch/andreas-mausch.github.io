---
layout: page
title: WhatsApp Viewer
permalink: /whatsapp-viewer/
navigation_weight: 1
---

# WhatsApp Viewer

Small tool to display chats from the Android msgstore.db.  
Supported versions are crypt5, crypt7, crypt8 and crypt12.

[github.com](https://github.com/andreas-mausch/whatsapp-viewer)  
[XDA Thread](https://forum.xda-developers.com/showthread.php?t=2719741)

<div>
<script async src="//pagead2.googlesyndication.com/pagead/js/adsbygoogle.js"></script>
	<!-- WhatsApp Viewer Banner -->
	<ins class="adsbygoogle"
	     style="display:inline-block;width:728px;height:90px"
	     data-ad-client="ca-pub-7818432263376206"
	     data-ad-slot="8096682775"></ins>
	<script>
		(adsbygoogle = window.adsbygoogle || []).push({});
</script>
</div>

# Features

You are looking for a way to:

- View your WhatsApp chats on PC
- Have a backup on your computer in case your phone gets lost
- Conveniently read old conversations without pressing "load older messages"
- Search messages
- Export to .txt, .html, .json
- No need to install Python, SQLite or additional libraries (M2Crypto)
- All in a small application, no dependencies, no need to install

# Download

Download here: [github.com](https://github.com/andreas-mausch/whatsapp-viewer/releases/latest)

# Screenshot

![]({{ site.baseurl }}/images/whatsapp-viewer-screenshot.png)

# How to use

1. Get your key and database file from the phone. Easiest method I know: [forum.xda-developers.com](http://forum.xda-developers.com/showthread.php?t=2770982)
2. Open WhatsApp Viewer
3. File -> Open -> Select file
4. Select msgstore.db in the folder "extracted"
5. Leave account name empty, is was used for older versions of WhatsApp (crypt5)
6. Optional: If you want, you can import contact names from the wa.db file
7. Click on a chat to show the messages.

You cannot see bigger images because only thumbnails are stored in the database.  
You see cryptic phone numbers because account names or details are not stored in the database. However, you can import your wa.db file to resolve your contact names.

Do you have a good idea or new feature you would like to see in a future release? Please check whether it is already on the [TODO list](https://github.com/andreas-mausch/whatsapp-viewer/blob/master/TODO.md). If not, create a [Github Issue](https://github.com/andreas-mausch/whatsapp-viewer/issues) or write me an e-mail. Please keep in mind I develop WhatsApp Viewer in my spare time, I won't promise any features or release dates.

# Frequently Asked Questions

- **Can I decrypt the database without the key file?**

    WhatsApp is able to do that, but I am not. If you have lost your phone or the key file, the backup is worthless.  
    Please, do NOT write me e-mails because you cannot find the key but the messages are SOO important for you. I cannot help you.

- **What about iPhone / Blackberry?**

    Not supported.

- **Where can I get the msgstore.db database file?**

    [forum.xda-developers.com](http://forum.xda-developers.com/showthread.php?t=2770982)

- **How can I decrypt .crypt7 / .crypt8 /.crypt12?**

    First of all you either need root access to your device or get the key file using the backup method of Android (see link above).  
    When you got root access, you can download the file from the system memory at */data/data/com.whatsapp/files/key*. Personally, I use MyPhoneExplorer for this task and I can really recommend this tool.

    Once you got both, the .crypt7 and key file, use the menu File->Decrypt .crypt7 (or .crypt8), select your files and press OK.  
    The decrypted file should be in the same folder, you can now open it in WhatsApp Viewer.

- **How can I decrypt .crypt5?**

    .crypt5 files are, as the name implies, encrypted database backups. The key is combined of some numbers and your personal email address. Usually this is the first account on Settings->Accounts on your phone and is a Google-Mail account. Make sure you enter the whole email address as account name. If you have trouble, sometimes leaving the account name empty is known to work.

    So in order to decrypt the file, click File->Decrypt .crypt5, select your file and type the email address. Now you should see a confirmation and the decrypted database on your disk.

- **Error: could not load chat list sqlite error 11 database disk image is malformed**

    Sometimes WhatsApp creates a malformed backup and you need to repair it. Currently there is no automatic repair option in WhatsApp Viewer, so you need to do it manually.
    You need sqlite installed on your computer and run these two lines from command prompt:

    ```echo .dump | sqlite3 msgstore.db > temp.sql```

    ```echo .quit | sqlite3 -init temp.sql repaired.db```

    Now you can load repaired.db with WhatsApp Viewer.

- **I get error XYZ, the conversation is not displayed, the app crashes without any error message, ...**

    Please consider this app as beta, I can't test all variations of WhatsApp backups out there.

    However, if you don't mind and would like to improve the experience for all users you can send me the file you have problems with and I try my best to help you or fix errors. I understand a backup file contains a lot of personal information most users don't want to share, however debugging is much easier when you can reproduce the problem, so it would help me a lot. I am not interested in your personal data and will delete all the files you send me from my disks after the bugfix.

    If you think you found a bug or have suggestions for future versions please report it here: [Github Issue](https://github.com/andreas-mausch/whatsapp-viewer/issues)

# Credits

- TripCode for crypt12 support [github.com/EliteAndroidApps](https://github.com/EliteAndroidApps/WhatsApp-Crypt12-Decrypter)
- Whatsapp Xtract
- pwncrypt5.py [github.com/aramosf](https://github.com/aramosf/pwncrypt5/blob/master/pwncrypt5.py)
- SQLite
- MD5 [bobobobo.wordpress.com](http://bobobobo.wordpress.com/2010/10/17/md5-c-implementation/)
- UTF8 [utfcpp.sourceforge.net](http://utfcpp.sourceforge.net/)
- AES [polarssl.org](https://polarssl.org/aes-source-code)
- Base64 [adp-gmbh.ch](http://www.adp-gmbh.ch/cpp/common/base64.html)
- RapidJSON [rapidjson.org](http://rapidjson.org/)
- mbedtls [github.com/ARMmbed](https://github.com/ARMmbed/mbedtls)
