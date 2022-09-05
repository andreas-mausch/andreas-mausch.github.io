---
title: "Security: Playing around with NSA exploit EternalBlue (MS17-010)"
date: 2017-05-14T03:00:00+02:00
tags: ['security', 'exploit', 'eternalblue', 'windows', 'metasploit']
thumbnail: win7-hacked.png
---

In April, [TheShadowBrokers](https://en.wikipedia.org/wiki/The_Shadow_Brokers) have released numerous exploits written by the [Equation Group](https://en.wikipedia.org/wiki/Equation_Group), which are "suspected of being tied to the United States National Security Agency (NSA)".

You can find the all the files here: [https://github.com/adamcaudill/EquationGroupLeak](https://github.com/adamcaudill/EquationGroupLeak)

Among the files, there is the [EternalBlue exploit](https://en.wikipedia.org/wiki/EternalBlue). For me, it seems to be the biggest exploit since the RPC DCOM exploit used by [Blaster](https://en.wikipedia.org/wiki/Blaster_(computer_worm)) in 2003 (see [MS03-26](https://technet.microsoft.com/en-us/library/security/ms03-026.aspx)). It allows remote execution on any Windows machine from XP up to Windows 8.1. The only requirement: You need to be in the same network as the victim.

I'm always interested in computer security and especially how these exploits work, and I've found very good websites explaining it in detail:

- [zerosum0x0.blogspot.de](https://zerosum0x0.blogspot.de/2017/04/doublepulsar-initial-smb-backdoor-ring.html)  
DoublePulsar Initial SMB Backdoor Ring 0 Shellcode Analysis
- [countercept.com](https://countercept.com/our-thinking/analyzing-the-doublepulsar-kernel-dll-injection-technique/)  
Analyzing the DoublePulsar kernel DLL injection technique
- [www.smittix.co.uk](https://www.smittix.co.uk/exploiting-ms17-010-using-eternalblue-and-doublepulsar-to-gain-a-remote-meterpreter-shell/)  
Exploiting MS17-010 – Using EternalBlue and DoublePulsar to gain a remote meterpreter shell

I'm not a big fan of theory though and wanted to see it myself. I've set up two virtual boxes (XP 32-bit and Windows 7 64-bit), which don't have the latest Microsoft patch [MS17-010](https://technet.microsoft.com/en-us/library/security/ms17-010.aspx) installed.
I've put them in the same network as my attacker machine, a Kali Linux with Metasploit.
Next I've followed the good tutorial by Una Piba Geek on [YouTube](https://www.youtube.com/watch?v=vmWeJJ0TLi0).

See below the results of my test. I was able to create a meterpreter shell in Windows 7 64-bit, however EternalBlue failed on the XP 32-bit box.

I've found it amazingly easy to set everything up and it will take only a couple of minutes to infect a vulnerable machine. Compared to 2003 and the RPC DCOM exploit it also amazes me how much more resources are available on blogs, GitHub, YouTube, etc. I remember I put hours in gathering information about it back then and the outcome was very little, but maybe it was just me not knowing what to look for.

{% image "scan.png", "" %}  
Scan of the victim machines

{% image "win7-options.png", "" %}  
{% image "win7-hacked.png", "" %}  
Windows 7 64-bit hacked

{% image "win7-eternalblue-success.png", "" %}  
Windows 7 64-bit: EternalBlue-2.2.0.exe output

{% image "winxp-eternalblue-fail.png", "" %}  
Windows XP 32-bit: EternalBlue-2.2.0.exe failed :(
