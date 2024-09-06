#!/bin/bash

set +e

source firstrun.env

CURRENT_HOSTNAME=`cat /etc/hostname | tr -d " \t\n\r"`
if [ -f /usr/lib/raspberrypi-sys-mods/imager_custom ]; then
   /usr/lib/raspberrypi-sys-mods/imager_custom set_hostname "${MY_HOSTNAME}"
else
   echo "${MY_HOSTNAME}" >/etc/hostname
   sed -i "s/127.0.1.1.*$CURRENT_HOSTNAME/127.0.1.1\t${MY_HOSTNAME}/g" /etc/hosts
fi
FIRSTUSER=`getent passwd 1000 | cut -d: -f1`
FIRSTUSERHOME=`getent passwd 1000 | cut -d: -f6`
if [ -f /usr/lib/raspberrypi-sys-mods/imager_custom ]; then
   if [ -n "${MY_SSH_KEY}" ]; then
      /usr/lib/raspberrypi-sys-mods/imager_custom enable_ssh -k "${MY_SSH_KEY}"
   else
      /usr/lib/raspberrypi-sys-mods/imager_custom enable_ssh
   fi
else
   if [ -n "${MY_SSH_KEY}" ]; then
      install -o "$FIRSTUSER" -m 700 -d "$FIRSTUSERHOME/.ssh"
      install -o "$FIRSTUSER" -m 600 <(printf "${MY_SSH_KEY}") "$FIRSTUSERHOME/.ssh/authorized_keys"
      echo 'PasswordAuthentication no' >>/etc/ssh/sshd_config
   fi
   systemctl enable ssh
fi
if [ -f /usr/lib/userconf-pi/userconf ]; then
   if [ -n "${MY_USER_PASSWORD}" ]; then
      /usr/lib/userconf-pi/userconf "${MY_USER_NAME}" "${MY_USER_PASSWORD}"
   else
      /usr/lib/userconf-pi/userconf "${MY_USER_NAME}"
   fi
else
   if [ -n "${MY_USER_PASSWORD}" ]; then
      echo "$FIRSTUSER:${MY_USER_PASSWORD}" | chpasswd -e
   fi
   if [ "$FIRSTUSER" != "${MY_USER_NAME}" ]; then
      usermod -l "${MY_USER_NAME}" "$FIRSTUSER"
      usermod -m -d "/home/${MY_USER_NAME}" "${MY_USER_NAME}"
      groupmod -n "${MY_USER_NAME}" "$FIRSTUSER"
      if grep -q "^autologin-user=" /etc/lightdm/lightdm.conf ; then
         sed /etc/lightdm/lightdm.conf -i -e "s/^autologin-user=.*/autologin-user=${MY_USER_NAME}/"
      fi
      if [ -f /etc/systemd/system/getty@tty1.service.d/autologin.conf ]; then
         sed /etc/systemd/system/getty@tty1.service.d/autologin.conf -i -e "s/$FIRSTUSER/${MY_USER_NAME}/"
      fi
      if [ -f /etc/sudoers.d/010_pi-nopasswd ]; then
         sed -i "s/^$FIRSTUSER /${MY_USER_NAME} /" /etc/sudoers.d/010_pi-nopasswd
      fi
   fi
fi
if [ -f /usr/lib/raspberrypi-sys-mods/imager_custom ]; then
   /usr/lib/raspberrypi-sys-mods/imager_custom set_wlan "${MY_WIFI_SSID}" "${MY_WIFI_PASSWORD}" "${MY_WIFI_COUNTRY}"
else
envsubst >/etc/wpa_supplicant/wpa_supplicant.conf <<'WPAEOF'
country=${MY_WIFI_COUNTRY}
ctrl_interface=DIR=/var/run/wpa_supplicant GROUP=netdev
ap_scan=1

update_config=1
network={
	ssid="${MY_WIFI_SSID}"
	psk=${MY_WIFI_PASSWORD}
}

WPAEOF
   chmod 600 /etc/wpa_supplicant/wpa_supplicant.conf
   rfkill unblock wifi
   for filename in /var/lib/systemd/rfkill/*:wlan ; do
       echo 0 > $filename
   done
fi
if [ -f /usr/lib/raspberrypi-sys-mods/imager_custom ]; then
   /usr/lib/raspberrypi-sys-mods/imager_custom set_keymap "${MY_KEYBOARD_LAYOUT}"
   /usr/lib/raspberrypi-sys-mods/imager_custom set_timezone "${MY_TIMEZONE}"
else
   rm -f /etc/localtime
   echo "${MY_TIMEZONE}" >/etc/timezone
   dpkg-reconfigure -f noninteractive tzdata
envsubst >/etc/default/keyboard <<'KBEOF'
XKBMODEL="pc105"
XKBLAYOUT="${MY_KEYBOARD_LAYOUT}"
XKBVARIANT=""
XKBOPTIONS=""

KBEOF
   dpkg-reconfigure -f noninteractive keyboard-configuration
fi
rm -f /boot/firstrun.sh
sed -i 's| systemd.run.*||g' /boot/cmdline.txt
exit 0
