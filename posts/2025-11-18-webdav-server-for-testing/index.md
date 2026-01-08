---
title: "WebDAV: Three ways to run a simple test server"
date: 2025-11-18T19:00:00+01:00
tags: ['docker', 'server']
thumbnail: thumbnail.jpg
---

I needed a simple WebDAV file server for testing and want to share what I found.

# Variants

## rclone

```bash
docker run --rm -p 8080:8080 -v ./data:/data -e RCLONE_USER=username -e RCLONE_PASS=password rclone/rclone:1.71.2 serve webdav /data --addr :8080 --baseurl '/webdav'
```

## bytemark

Caution: This image is 7 years old.

```bash
docker run --rm -v ./data:/var/lib/dav -e AUTH_TYPE=Digest -e USERNAME=username -e PASSWORD=password --publish 8080:80 -d bytemark/webdav:2.4
```

## Caddy

An example in Caddy, which requires some more configuration,
but might give you some more flexibility in exchange.

### Build docker image

```{data-filename=Dockerfile}
FROM caddy:2.10.2-builder AS builder

RUN xcaddy build --with github.com/mholt/caddy-webdav@7a5c90d

FROM busybox:1.37.0

COPY --from=builder /usr/bin/caddy /usr/bin/caddy

RUN mkdir /data

ENTRYPOINT ["/usr/bin/caddy", "run", "--config=/etc/Caddyfile"]
```

```bash
docker build -t caddy-webdav .
```

### Run WebDAV server

```{data-filename=Caddyfile}
{
	admin off
	order webdav before file_server
}

http://localhost

basicauth /webdav/* bcrypt {
  # Password is 'password'
	username $2y$10$3ZFVo6i8sdDXRGHC1c7LuuaprKz/L9jCMvjr9UszLgZGlTxAOmqPK
}

webdav /webdav/* {
	root /data
	prefix /webdav
}
```

```bash
docker run --rm -p 8080:80 -v ./Caddyfile:/etc/Caddyfile:ro -v ./data:/data caddy-webdav
```

### Generate bcrypt password hash

The password is saved in form of a bcrypt hash.
openssl doesn't support generating bcrypt hashes, unfortunately.

I found [bcrypt-tool](https://github.com/shoenig/bcrypt-tool),
which does not accept the password from stdin. :/

And there is `htpasswd` from the apache package.
But this will also install the whole apache server. :/

However, you can run this docker image to just generate the bcrypt password:

```bash
docker run -it --rm --network=none --entrypoint=htpasswd sineverba/htpasswd:1.5.0 -nBC 10 username
```

- `-n`: Display the results on standard output rather than updating a file.
- `-B`: Force the use of BCrypt encryption for passwords.
- `-C`: Set the computing cost factor for BCrypt (logarithmic scale, typical values 5-12).
        Higher values increase security but require more CPU time for hashing.

# Connect to WebDAV via cadaver

## Quick test with curl

```bash
curl -v --user user:password http://localhost:8080/webdav
```

This should return some XML.

## Real WebDAV

```bash
cadaver http://localhost:8080/webdav
```

Run commands like `ls`, `put file.txt` and so on to test functionality.

# Use rsync with our server

## Obscure password

```bash
cat /dev/stdin | rclone obscure -
```

## Test connection by listing files

```bash
rclone ls ":webdav,user='user',pass='VZTiy804LCdIyjE_VLCvuczpeaMnsHQR',url='http://localhost:8080/webdav':"
```

## Sync a local folder

```bash
rclone sync . ":webdav,user='user',pass='VZTiy804LCdIyjE_VLCvuczpeaMnsHQR',url='http://localhost:8080/webdav':"
```

# Security

Please note this is just an example.
In the real world, you should never use BasicAuth over plain HTTP.
BasicAuth is only secure over an encrypted connection like HTTPS.

For Caddy: it runs as the root user inside the docker container.
This is not so good, but not part of this test.
Best solution would be if the official image would change that.

See here:
[Run as unprivileged user](https://github.com/mholt/caddy-webdav/issues/17)

# Suggestion

I suggest to use the rclone variant if you just want to quickly spin up a WebDAV server.
rclone itself is well maintained, and the `docker run` command doesn't require any further
configuration files.

If you want to go into more details, or have a running infrastructure already,
Caddy might be worth a look.
