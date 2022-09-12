---
title: Please support deploying to a subdirectory
date: 2022-01-26T15:00:00+01:00
tags: ['context path']
---

Lately I worked with three web apps which refused to being deployed on a subdirectory of a domain,
for example `https://my.domain/path`.
They all expected to run at the root of the domain `https://my.domain`.
Which makes it difficult to use multiple apps on the same domain.

The only options are:

- Run them on a different port
- Run them on a subdomain

The first one makes the URL ugly, and in some companies it requires some bureaucracy to get another
port opened in the company-wide firewall.
The second one requires some technical setup as well, and it's not always the solution you are looking for.

I had the same problem with these apps:

- [Magento](https://github.com/magento/magento2)
- [OpenId Connect Server Mock](https://github.com/Soluto/oidc-server-mock) ([#81](https://github.com/Soluto/oidc-server-mock/issues/81))
- A custom extension written by a third-party for Shopify (could be solved by calling [forceRootUrl](https://laravel.com/api/5.8/Illuminate/Routing/UrlGenerator.html#method_forceRootUrl))

So here is my friendly request to every web app developer:
Please support some option to deploy your app on another path than root.
Thank you.
