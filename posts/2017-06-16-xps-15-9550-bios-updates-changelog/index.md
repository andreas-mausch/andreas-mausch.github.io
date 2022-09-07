---
title: Dell XPS 15 (9550) BIOS updates changelog
date: 2017-06-16T03:00:00+02:00
tags: ['dell', 'xps', 'bios', 'changelog']
---

I tried to find a changelog of the BIOS updates for the XPS 15. I failed. So I've decided to create a list myself.

There is a well-hidden overview on the official Dell website. Click [here](http://downloads.dell.com/published/pages/xps-15-9550-laptop.html) for details. Note: There have been some updates released, which are not available for download anymore.

- **1.6.1**  
2017-12-23
  1. Updated to the latest INTEL CPU microcodes.
  2. Updated Intel ME Firmware to address security advisories INTEL-SA-00086 (CVE-2017-5705, CVE-2017-5708, CVE-2017-5711 & CVE-2017-5712) & INTEL-SA-00101(CVE-2017-13077, CVE-2017-13078 & CVE-2017-13080).
- **1.5.1**  
2017-11-14
  1. Enhance audio quality when the brightness is adjusted
  2. Extending battery support
  3. Allows Dell Command Configure to implement the required Thunderbolt Sec Level settings without the need to access the BIOS.
  4. Fixed a Bitlocker recovery issue when Dell Thunderbolt Dock is connected to the system, and PCR1 is selected in the Bitlocker Group Policy  
  Updated Dell Dock Port Type Classification in SMBIOS Table
  5. Fixed a Bitlocker recovery issue when Dell Type C Dock or Dongle is connected to the system, and PCR2 is selected in the Bitlocker Group Policy  
    Improved PCR2 measurement consistency when a Dell Type C Dock or Dongle is connected.
  6. Updated the handling of pre-boot authentication information by firmware.  
    Updated UEFI variable input validation.  
    Updated the handling of 3rd party Option ROM loading.  
    Updated SPI flash command configuration settings.
- **1.4.0**  
2017-09-15
  1. Fixes system defense with wireless parameter will cause ME failure
  2. System stability enhancements
  3. To prevent user update ME Firmware to blacklist 11.6 ME firmware
  4. Correct error message in Excalibur
  5. Fix Bitlocker issue on Win7 ultimate/enterprise
- **1.3.0**  
2017-08-28
  1. Enhance dock's audio performance
- **1.2.29**  
2017-08-01
  1. Fixed a potential security issue with Bootguard code integrity chaining enforcement"
  2. Fixed a potential security issue with the Support Assist PreBoot feature
  3. Updated processor microcode
  4. Update Computrace 957
  5. Support Win10 RS2 Enterprise
  6. Enchance NVME support and reduce noise
- **1.2.25**  
2017-05-12
  1. Updated Intel ME Firmware to address security advisory CVE-2017-5689 / INTEL-SA-00075
  2. Support TPM 2.0 on Win7
- **1.2.21**  
2017-03-31
  1. SUT will show incorrect massage after run DG_Readinesstool_v2.0.ps1 on Enterprise OS
  2. Clear TPM Option greyed out in BIOS
  3. Enable "Attempt Legacy Boot" cannot be enabled in BIOS
  4. USB LAN and Audio of IE dock still working after disable Dell Docks and Ext. USB
- **1.2.19**  
2017-01-23
  1. Fixed Pre-OS has no display on external monitor with Lid Close issue
- **1.2.18 (A16)**  
2016-12-19
  1. Fixed system may drop battery un-expected
  2. Improve PCIE NVMe Stability
  3. Fixed Panel flick issue
  4. Fixed Microsoft Bitlocker issue
  5. Improved the DELL ThunderBolt Dock Stability
  6. Fixed ST Microelectronics Motion Sensor Driver shows disabled while spindle HDD +mSATA installed
- **1.2.16**  
2016-12-01
  1. Fix Dell Thunderbolt Dock issue
- **1.2.14 (A13)**  
2016-09-09
  1. Fixed Battery may stop charge at 60% after updating BIOS
- **01.02.10 (A10)**  
2016-07-05
  1. Fixed Dell Thunderbolt Dock (TB15) device will lost after S3 resume
  2. Fixed LCD flickering when in lowest brightness
  3. Fixed After McAfee encrypted, the PCIE NVMe SSD \ SATA SSD can't boot to OS issue
  4. Fixed Wake on WLAN takes a long time with Intel 1830/1820A Wireless card
  5. Fixed USB audio/mouse may be lag while connected to Dell Thunderbolt Dock (TB15) and Dell Dock (WD15)
  6. Support for Windows 10 Enterprise features
  7. Fixed incorrect Thunderbolt security level reading from Driver
  8. Fixed Touchpad may be lost after Dell Thunderbolt Dock (TB15) device connected
  9. Add passthrough MAC address shows on BIOS Setup feature.
  10. Fixed System will become shut-down with connected to Dell Thunderbolt Dock (TB15) after S4 Resume.
- **01.02.00 (A06)**  
2016-04-12
  1. Improved the system stability
  2. Fixed system may not able to boot with external monitor with lid closed
  3. Fixed USB audio/mouse may be lag while connecting to Dell Thunderbolt Dock (TB15) and Dell Dock (WD15)
  4. Fixed Fan may be noisy while connecting to Dell Thunderbolt Dock (TB15) and Dell Dock (WD15)
  5. Fixed Bitlocker Malfunction or Keeps Prompting Recovery Key every time reboot
- **[01.01.19](https://www.reddit.com/r/Dell/comments/448zvg/new_bios_for_xps_15_9550_010119/)**  
2016-02-05
  1. Fix DELL BME Dock issues
  2. Fix ePSA Pre-boot system assessment error with NVMe device
  3. Update PXE ROM Version
- **01.01.15**  
2016-01-05
  1. Improve Audio performance
  2. Improve NVMe Battery Life
  3. Fix CPU i7 CPU performance became low after AC remove and insert.
  4. Enhance system Boot time
  5. Fix System may saw NO Boot Devie error message with NVMe storage.
  6. Enhance battery mode sleep resume time too long.
- **01.00.03**  
2015-10-15
- **01.00.00**  
2015-10-05
