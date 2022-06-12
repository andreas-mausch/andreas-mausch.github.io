---
layout: post
title: "My home server setup (Intel NUC)"
date: 2022-06-12 18:00:00 +02:00
tags: server docker nginx gitlab nextcloud
---

I have my setup for quite a while now, but since I need to make some changes to it, I thought it is a good time to share the process.

# Hardware

I use a Intel NUC for being my 24/7 server.

Previously I have used a DC53427HYE (8 GB RAM, 120 GB SSD), and I now upgrade it to an D54250WYK (still old), but with 16 GB RAM and 500 GB SSD.
I found two old cores are more than enough for my needs.

I've bought it on eBay for 127 EUR.

![]({{ site.baseurl }}/images/2022-06-12-my-home-server-setup/nuc-front.jpg)

![]({{ site.baseurl }}/images/2022-06-12-my-home-server-setup/nuc-back.jpg)

![]({{ site.baseurl }}/images/2022-06-12-my-home-server-setup/nuc-bottom.jpg)

# Reset the BIOS password

Unfortunately, it still had an BIOS password set, and the previous owner forgot it.

The official support [provides instructions](https://www.intel.com/content/www/us/en/support/articles/000007242/intel-nuc.html)
how to clear it.
It has to be done via hardware jumpers, something I haven't touched like 20 years ago to set the master/slave hard-drive.

![]({{ site.baseurl }}/images/2022-06-12-my-home-server-setup/jumper.jpg)

![]({{ site.baseurl }}/images/2022-06-12-my-home-server-setup/config-menu.jpg)

![]({{ site.baseurl }}/images/2022-06-12-my-home-server-setup/nuc-bios.jpg)

# Services

I run [GitLab](https://about.gitlab.com/) and [Nextcloud](https://nextcloud.com/) on the server.
I use them to host private Git repos, sync my contacts and notes and store files on my private cloud drive.

I think privacy is important and I also think too many people share private data with too many companies.

# Router and DNS settings

I have requested an IPv4 address at my ISP, I have set up a [MyFritz! account](https://www.myfritz.net) to get a dynamic DNS name,
and I further have configured a CNAME DNS entry for my own personal domain.

Whenever I try to access my domain, I will be forwarded to my FritzBox router.

On the FritzBox, I have set up port forwardings for Port 22 (SSH) 80 (HTTP) and 443 (HTTPS), both for IPv4 and IPv6.

# Server OS

The Intel NUC runs a recent Debian (I've used [this image](https://cdimage.debian.org/debian-cd/current/amd64/iso-cd/debian-11.3.0-amd64-netinst.iso))
with basically just Docker installed.

I copied the .iso to an USB stick [via](https://linuxize.com/post/create-bootable-debian-10-usb-stick-on-linux/):

```
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

I run a nginx server to forward incoming connections to the right service,
and I have one Docker container for each GitLab and Nextcloud.

# Backup

First, I had to make a backup of the existing server.

Since some docker containers created files with a different user, I had to make the backup via sudo.

[This post](https://askubuntu.com/questions/719439/using-rsync-with-sudo-on-the-destination-machine)
helped to do it.

I ended up with these commands:

```
sudo rsync -avh0 --stats --numeric-ids --rsync-path="sudo rsync" nuc@nuc:/home/nuc home
sudo rsync -avh0 --stats --numeric-ids --rsync-path="sudo rsync" nuc@nuc:/etc/letsencrypt letsencrypt
```

# TLS (nginx settings and Let's encrypt)

I use certbot (run via docker) to update my Let's encrypt TLS certificates. I just need to stop nginx before and then run this command:

```
docker run -it --rm --name certbot -v "/etc/letsencrypt:/etc/letsencrypt" -v "/var/lib/letsencrypt:/var/lib/letsencrypt" certbot/certbot renew
```

(Use `certificates` instead of `renew` to just print your current certificates)

In the nginx config, I refer to that certificate.
Also, I explicitly only allow a single (strong) SSL Cipher via TLS 1.2.

<details markdown="1">
<summary>nginx.conf</summary>
```
events {
}

http {

  ssl_session_cache shared:SSL:10m;
  ssl_ciphers ECDHE-RSA-AES256-GCM-SHA384;
  ssl_protocols TLSv1.2;
  proxy_buffering off;

  gzip on;
  gzip_vary on;
  gzip_proxied any;
  gzip_comp_level 6;
  gzip_types text/plain text/css text/xml application/json application/javascript application/xml application/xml+rss image/svg+xml;

  server {

    listen 443 http2 ssl;
    listen [::]:443 http2 ssl;
    server_name git.neonew.de;

    ssl_certificate /opt/git.neonew.de/fullchain.pem;
    ssl_certificate_key /opt/git.neonew.de/privkey.pem;

    location / {

      proxy_pass http://192.168.1.2:8080;
      proxy_set_header Host $host;
      proxy_set_header X-Real-IP $remote_addr;
      proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
      proxy_set_header X-Forwarded-Proto $scheme;
      proxy_set_header X-Forwarded-Ssl on;

      proxy_redirect http:// https://;
    }
  }

  server {

    listen 443 http2 ssl;
    listen [::]:443 http2 ssl;
    server_name cloud.neonew.de;

    ssl_certificate /opt/cloud.neonew.de/fullchain.pem;
    ssl_certificate_key /opt/cloud.neonew.de/privkey.pem;

    location / {

      proxy_pass http://192.168.1.3:5555;
      proxy_set_header Host $host;
      proxy_set_header X-Real-IP $remote_addr;
      proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
      proxy_set_header X-Forwarded-Proto $scheme;
      proxy_set_header X-Forwarded-Ssl on;

      proxy_redirect http:// https://;

      client_max_body_size 16400M;
    }
  }
}
```
</details>

# Portainer

Usually I manage the containers via ssh and the Docker CLI.
I thought about having Portainer running to manage the containers via a web view, but this is not done yet.

Might be updated in future.

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

![]({{ site.baseurl }}/images/2022-06-12-my-home-server-setup/nextcloud.jpg)
![]({{ site.baseurl }}/images/2022-06-12-my-home-server-setup/davx.jpg)
![]({{ site.baseurl }}/images/2022-06-12-my-home-server-setup/opentasks.jpg)
![]({{ site.baseurl }}/images/2022-06-12-my-home-server-setup/notes.jpg)

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

## :heavy_minus_sign: Availability

I only run a single server, which of course can have hardware failures.
So in the (at least unlikely) event the server dies, my services won't be available.
If this happens when I'm not at home (like a vacation), nobody will try to solve the issue for me.

Cloud providers have redundancy, multiple nodes, etc. so they are much more likely to be available.
If there still is a problem somewhere, a lot of people will try to fix it immediately without your assistence.

## :heavy_minus_sign: Maintenance

Having an self-hosted server also means you have to maintain it yourself, and this can be quite some extra regular work.

I usually update the services and OS every few months, or on a major release for one of the services.
I also update the certificates manually.

For backups: I don't really care too much for this server, because most of the data is just needed for a few hours/days (like my notes) or is stored elsewhere (like contacts).
The configuration for nginx is stored in a Git repo, which I also have on my laptop.
So in the unlikely event the server dies, I will just replace it and configure it from scratch again.

If you keep important data on your server, you are of course also responsible to properly backup it.

## :heavy_minus_sign: Security

Of course, updates are very important for the server's security.
Since I only do updates every few months I might be a target to software vulnerabilities for a small period of time, but that's a risk I take.
If I randomly stumble across an exploit in the news, I will do an update asap.

A cloud provider will update more frequently and much faster than I can.

Also, I don't really check the logs. If there is anything suspicious in there, I probably won't notice it.
Cloud providers will detect suspicious behavior most certainly.

## :heavy_plus_sign: Storage

Having your own server let's you usually have a lot more disk space for a lot less money.

## :heavy_plus_sign: Privacy

That's my main reason I want to host a private server and this outweights all drawbacks, at least for me.
