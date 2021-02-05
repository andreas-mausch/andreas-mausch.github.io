---
layout: post
title:  "Cookie formats and Apache HttpClient"
date:   2021-02-03 19:00:00 +01:00
tags:
---

I've spent some time isolating a bug in the company's cookie proxy.
This is about the *expires* part of a cookie.

# Two formats

Let's see what **google.com** uses:

```bash
$ curl -v http://www.google.com
*   Trying 2a00:1450:4005:800::2004:80...
* Connected to www.google.com (2a00:1450:4005:800::2004) port 80 (#0)
> GET / HTTP/1.1
> Host: www.google.com
> User-Agent: curl/7.74.0
> Accept: */*
> 
* Mark bundle as not supporting multiuse
< HTTP/1.1 200 OK
< Date: Thu, 04 Feb 2021 14:52:31 GMT
< Expires: -1
< Cache-Control: private, max-age=0
< Content-Type: text/html; charset=ISO-8859-1
< P3P: CP="This is not a P3P policy! See g.co/p3phelp for more info."
< Server: gws
< X-XSS-Protection: 0
< X-Frame-Options: SAMEORIGIN
< Set-Cookie: NID=208=Q71yKqzPX7wekeaMyaa-RndCAZz6pLnozTJRLprMjuZzuImXnlCCXFoqoRoeuxrjn7pk8l2gIesgE5LITdauT_AnYm3jmUlwkqLW1LN4igl8zDVBW5UzTJUizdVeiyuIy4F7RfABvuLUI-dIXlQItQbiYCtTNQTzBh7lEwtn5YM; expires=Fri, 06-Aug-2021 14:52:31 GMT; path=/; domain=.google.com; HttpOnly
< Accept-Ranges: none
< Vary: Accept-Encoding
< Transfer-Encoding: chunked
< 
<!doctype html><html and so on..
```

See? It says **expires=Fri, 06-Aug-2021 14:52:31 GMT**.

This is interesting, as there apparently are two common ways to format that date.

- The Cookie date, described in [RFC 6265](https://tools.ietf.org/html/rfc6265#section-5.1.1)  
  This is pretty much the HTTP date (described in [RFC 7231](https://tools.ietf.org/html/rfc7231#section-7.1.1.2)).  
  You will also find that format on other HTTP headers, for example in the `If-Modified-Since` header.  
  Example: `Tue, 15 Jan 2013 21:47:38 GMT`
- Netscape's way, described in [RFC 2109](https://tools.ietf.org/html/rfc2109#section-10.1.2) (from 1997, obsolete)  
  Example: `Tue, 15-Jan-2013 21:47:38 GMT`

You can note two things:

- The only difference is the hyphens inbetween.
- Google uses the RFC 2109 format.

# Apache HttpClient

A very widely used client library is HttpClient. Now here it is getting interesting.
Because if you just use it out-of-the-box, HttpClient does not support the RFC 6265 and throws an exception instead:

Let's have a look at an example (I use HttpClient 4.5.13):

```java
CookieSpec defaultCookieSpec = new DefaultCookieSpec();
BasicHeader setCookieHeader = new BasicHeader("Set-Cookie", "testcookie=myvalue; Max-Age=43200; Expires=Wed, 03-Feb-2021 21:57:56 GMT; Path=/; Secure; HttpOnly");
defaultCookieSpec.parse(setCookieHeader, new CookieOrigin("host", 80, "/", true));
```

This code, with a cookie in the RFC 2109 format, works fine. HttpClient can parse you the header into a list of Cookie objects.

Let's try the (newer) RFC 6265 format:

```java
BasicHeader setCookieHeader = new BasicHeader("Set-Cookie", "testcookie=myvalue; Max-Age=43200; Expires=Fri, 29 Jan 2021 22:08:53 GMT; Path=/; Secure; HttpOnly");
defaultCookieSpec.parse(setCookieHeader, new CookieOrigin("host", 80, "/", true));
```

Boom! **MalformedCookieException: Invalid 'expires' attribute: Fri, 29 Jan 2021 22:08:53 GMT**.

Some googling, and you find a solution on [stackoverflow.com](https://stackoverflow.com/a/40697322):

> The default HttpClient has difficulty understanding the latest RFC-compliant headers.  
Instead of hiding the warning, just switch to a standard cookie spec [...]

**Wow!** I'm a bit disappointed HttpClient (by default) doesn't accept cookies, which are perfectly fine by the latest RFC. :(
Also, I find it confusing there is a *DEFAULT* and a *STANDARD* [CookieSpec](https://hc.apache.org/httpcomponents-client-ga/httpclient/apidocs/org/apache/http/client/config/CookieSpecs.html).

Why is standard not the default?  
Anyway, after the change, it worked well.

There is also a [bug ticket](https://issues.apache.org/jira/browse/HTTPCLIENT-1763) in the HttpClient bug tracker.  
**But wow again!** It has been *resolved* with the reason: *Invalid* :/

For completeness, here is the example above with the standard spec (it uses RFC6265LaxSpec as implementation):

```java
CookieSpec standardCookieSpec = new RFC6265LaxSpec();
BasicHeader setCookieHeader = new BasicHeader("Set-Cookie", "testcookie=myvalue; Max-Age=43200; Expires=Fri, 29 Jan 2021 22:08:53 GMT; Path=/; Secure; HttpOnly");
standardCookieSpec.parse(setCookieHeader, new CookieOrigin("host", 80, "/", true));
```

Note: The standard spec can also parse the RFC 2109 formatted cookie!

My personal preference: everything should just use ISO 8601 for date formatting (even http).
But that's not gonna happen soon. ;)
