---
title: My home server setup (Intel NUC)
date: 2022-06-12T18:00:00+02:00
tags: ['server', 'docker', 'nginx', 'caddy', 'gitlab', 'nextcloud', 'gitea', 'portainer', 'intel nuc', 'mini pc']
thumbnail: nuc-front.jpg
---

I have my setup for quite a while now, but since I need to make some changes to it, I thought it is a good time to share the process.

# Hardware

I use a Intel NUC for being my 24/7 server.

Previously I have used a DC53427HYE (8 GB RAM, 120 GB SSD), and I now upgrade it to an D54250WYK (still old), but with 16 GB RAM and 500 GB SSD.
I found two old cores are more than enough for my needs.

Geekbench 5: [672 / 1317](https://browser.geekbench.com/v5/cpu/21803927)

I've bought it on eBay for 127 EUR.

{{ "nuc-front.jpg nuc-back.jpg nuc-bottom.jpg" | split: " " | carousel }}

Update (2023-10): If I could choose today, I would buy either a Raspberry Pi 5 (let's see how well it runs with passive cooling, that would be great),
or a Firebat T8 from China (with an Intel N100, which has ~100% more CPU power than the 4250U at 6W TDP (vs. 15W)!).

# Reset the BIOS password

Unfortunately, it still had a BIOS password set, and the previous owner forgot it.

The official support [provides instructions](https://www.intel.com/content/www/us/en/support/articles/000007242/intel-nuc.html)
how to clear it.
It has to be done via hardware jumpers, something I haven't touched like 20 years ago to set the master/slave hard-drive.

{{ "jumper.jpg config-menu.jpg nuc-bios.jpg" | split: " " | carousel }}

# Services

I run [GitLab](https://about.gitlab.com/) and [Nextcloud](https://nextcloud.com/) on the server publicly available on the internet.
I use them to host some of my Git repos, sync my contacts and notes and store files on my private cloud drive.
I think privacy is important and I also think too many people share private data with too many companies.

I additionally have a [Gitea](https://gitea.io/) instance and [Portainer](https://www.portainer.io/) running,
accessible from my local network only.
Gitea is used for private Git repos and as a backup/mirror server for my GitHub and GitLab repos.
Portainer is used for managing docker instances.

# Router and DNS settings

I have requested an IPv4 address at my ISP, I have set up a [MyFritz! account](https://www.myfritz.net) to get a dynamic DNS name,
and I further have configured a CNAME DNS entry for my own personal domain.

Whenever I try to access my domain, I will be forwarded to my FritzBox router.

On the FritzBox, I have set up port forwardings for Port 22 (SSH) 80 (HTTP) and 443 (HTTPS), both for IPv4 and IPv6.

# Server OS

The Intel NUC runs a recent Debian (I've used [this image](https://cdimage.debian.org/debian-cd/current/amd64/iso-cd/debian-11.3.0-amd64-netinst.iso))
with basically just Docker installed.

I copied the .iso to an USB stick [via](https://linuxize.com/post/create-bootable-debian-10-usb-stick-on-linux/):

```bash
lsblk -f
# Make sure the drive is not mounted
sudo dd bs=4M if=/home/neonew/Downloads/debian-11.3.0-amd64-netinst.iso of=/dev/sdX status=progress oflag=sync
```

Alternatively, you can use [balenaEtcher](https://www.balena.io/etcher/).

After the installation, I've:

- Decrease Grub Timeout for faster startup time
- Enable ssh
- Install sudo
- Add my user to sudoers
- Enable sudo without password
- Install docker
- Setup docker for non-root access

I run a ~~nginx~~ caddy server to forward incoming connections to the right service,
and I have one Docker container for each GitLab, Nextcloud, Gitea and Portainer.

# Backup

First, I had to make a backup of the existing server.

Since some docker containers created files with a different user, I had to make the backup via sudo.

[This post](https://askubuntu.com/questions/719439/using-rsync-with-sudo-on-the-destination-machine)
helped to do it.

I ended up with these commands:

```bash
sudo rsync -avh0 --stats --numeric-ids --rsync-path="sudo rsync" nuc@nuc:/home/nuc home
sudo rsync -avh0 --stats --numeric-ids --rsync-path="sudo rsync" nuc@nuc:/etc/letsencrypt letsencrypt
```

# TLS (caddy settings and Let's encrypt)

I use certbot (run via docker) to update my Let's encrypt TLS certificates. I just need to stop caddy before and then run this command:

```bash
docker run -it --rm --name certbot -p 80:80 -p 443:443 -v "/etc/letsencrypt:/etc/letsencrypt" -v "/var/lib/letsencrypt:/var/lib/letsencrypt" certbot/certbot renew
```

(Use `certificates` instead of `renew` to just print your current certificates)

I've used to use nginx as my reverse proxy, but I switched to [Caddy](https://caddyserver.com/)
for the much easier to read configuration file.

In this config, I refer to the TLS certificate.

<details markdown="1">
<summary>Caddyfile</summary>

```
{
  admin off
}

(tls_settings) {
  protocols tls1.3
  # Ciphers are ignored for TLS 1.3:
  # https://caddy.community/t/customise-tls-1-3-cipher-suites/14015
  # https://github.com/golang/go/issues/29349
  ciphers TLS_ECDHE_ECDSA_WITH_AES_256_GCM_SHA384
}

https://cloud.neonew.de {
  tls /opt/cloud.neonew.de/fullchain.pem /opt/cloud.neonew.de/privkey.pem {
    import tls_settings
  }
  reverse_proxy http://nextcloud
}

https://git.neonew.de {
  tls /opt/git.neonew.de/fullchain.pem /opt/git.neonew.de/privkey.pem {
    import tls_settings
  }
  reverse_proxy http://gitlab
}
```

</details>

# Portainer

Usually I manage the containers via ssh and the Docker CLI.
I thought about having Portainer running to manage the containers via a web view, but this is not done yet.

Might be updated in future.

Update: Portainer is set up and running.
I still hop on to the server to execute docker commands directly via SSH,
because I find it easier to have my commands collected in a Git repo rather than clicking on a web frontend,
but Portainer is still neat to have.

# Performance, noise and power consumption

It is important to me the server is quiet and doesn't consume too much power.
Performance on the other side shouldn't be too poor, but is not that important to me.

For the noise: I can hear the server's fan in idle mode when I get close to it. As soon as I move away 2 meters I can barely hear anything.
This is ok for me.

The power consumption is really good for the Intel NUCs. I haven't tested it myself, but
[someone](https://www.legitreviews.com/intel-nuc-kit-d54250wyk-review-the-nuc-gets-haswell-power_124251/6)
measured around 5W in idle mode, which is 3.7 kWh per month or 44 kWh per year.

# Screenshots

Nextcloud app (files), Contact sync ([DAVx](https://www.davx5.com/)), Tasks sync (OpenTasks), Notes app

{{ "nextcloud.jpg davx.jpg opentasks.jpg notes.jpg" | split: " " | carousel }}

# Comparision vs. Cloud providers

The main reason I still suggest cloud providers to most people is either

1. missing skills
2. convenience  
   Everybody can use Google Drive or similar services. You just create an account and have access.
   Most people won't be willing to spend several hours a month just to keep their services running or do administration work.
   Even projects like the [NextBox](https://shop.nitrokey.com/de_DE/shop/product/nextbox-116), who claim *Unattended, long-term updates and no monthly costs* are gonna experience a problem/downtime at some point and then you are in charge to fix the problem.
3. costs  
   Running your own service costs money, at least for hardware and power. Most cloud services are free for basic usage.

Let's look at some more points closely:

## 👎 Availability

I only run a single server, which of course can have hardware failures.
So in the (at least unlikely) event the server dies, my services won't be available.
If this happens when I'm not at home (like a vacation), nobody will try to solve the issue for me.

Cloud providers have redundancy, multiple nodes, etc. so they are much more likely to be available.
If there still is a problem somewhere, a lot of people will try to fix it immediately without your assistence.

## 👎 Maintenance

Having an self-hosted server also means you have to maintain it yourself, and this can be quite some extra regular work.

I usually update the services and OS every few months, or on a major release for one of the services.
I also update the certificates manually.

For backups: I don't really care too much for this server, because most of the data is just needed for a few hours/days (like my notes) or is stored elsewhere (like contacts).
The configuration for Caddy and other docker containers is stored in a Git repo, which I also have on my laptop.
So in the unlikely event the server dies, I will just replace it and configure it from scratch again.

If you keep important data on your server, you are of course also responsible to properly backup it.

## 👎 Security

Of course, updates are very important for the server's security.
Since I only do updates every few months I might be a target to software vulnerabilities for a small period of time, but that's a risk I take.
If I randomly stumble across an exploit in the news, I will do an update asap.

A cloud provider will update more frequently and much faster than I can.

Also, I don't really check the logs. If there is anything suspicious in there, I probably won't notice it.
Cloud providers will detect suspicious behavior most certainly.

## 👍 Storage

Having your own server let's you usually have a lot more disk space for a lot less money.

## 👍 Privacy

That's my main reason I want to host a private server and this outweights all drawbacks, at least for me.
