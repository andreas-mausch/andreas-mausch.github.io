---
title: Migrate Blog from Jekyll to Eleventy
date: 2022-08-11T21:00:00+02:00
tags: ['website', 'blog', 'jekyll', 'eleventy', 'github-pages']
thumbnail: thumbnail.png
---

# Why Jekyll in first place (2015)

The reason I've decided to use Jekyll was pretty straight-forward:
Github Pages was released and they offered built-in Jekyll integration.

Back then there was no Github Actions or any kind of built-in Github CI, and I wanted to have
a way to publish blog posts with the lowest possible barrier.

At that point in time I wasn't sure how frequently I would even use my own blog, and I thought
it could be very closely to never.
So my main goal was simplicity: A simple method to add blog posts, and almost zero maintenance.

I didn't have an own domain back then, so all I had to do was enable Github Pages for the repo
and use some simple Jekyll basic theme.

# Importing tumblr blog

I used to have a tumblr blog for my trip to Barbados (2013).
I discovered Jekyll offers an import method, so I added all the blog posts from tumblr also to my personal blog.

That felt great. All of the sudden, I had control over my older blog posts in such an easy way.

# Why Eleventy

When I realized I use the blog from time to time, I also discovered some things I didn't like about the way
Github Pages or Jekyll works:

- I couldn't choose freely from available Jekyll plugins for security reasons.
  GitHub provides a list of [supported plugins](https://pages.github.com/versions/).
- Integrate third-party dependencies (npm)
  I **hate** to have third-party code as part of my own repositiories.
  While it is ugly to maintain it also destroys full-text search over your repo.
  See also my rant post [here]({% link-post "2020-02-12-element-ui" %}).
- Limitation to JavaScript, no built-in TypeScript support
  I always loved statically typed languages for two reasons:
  Discover mistakes earlier and better IDE integration for auto-completion.
- No thumbnail support
  I'd like to only have the original image as part of the repo, and smaller versions of it could be generated.
- Images and blog posts are usually in different folders
  I'd rather have one blog post with all it's associated files in a single place

So I searched the web for some alternative, and I tried Hugo and Hexo.
I explicitly did not want to use any js framework like Nuxt or Gatsby to keep the site very simple and fast.

For Hugo I disliked the third-party dependency integration.
I would have liked to see a *npm-dependencies.txt* file or similar.
However, you'd have to set up a npm repo and have hugo as a dependency, which is the wrong way round in my opinion.

For eleventy it works the same, but in this case it makes sense since eleventy is a npm dependency itself and it's the common way to install it.
I liked it a bit better, also because I won't mix technologies too much. It is just npm then.
That's why I set up a [sample repository](https://github.com/andreas-mausch/eleventy-sample) to check out if eleventy was good in my case.

# Experience with Eleventy

I like the speed and the hot-reload.
I dislike no built-in TypeScript and SCSS support (how dare you?!).

It can be added, but those are really parts I don't want to have as part of my blog repo.
In best case it should only contain the real content and maybe the theming and no technical quirks like that.

I added TypeScript support by manually hacking a "plugin" for it.
I used @swc/core and I really like how easy it was to integrate it's *bundle* function, which
automatically resolves all imported dependencies and does the babeling stuff.
It doesn't check your TypeScript for valid types and linting, so you need to run these tasks separately.
I later exchanged swc for esbuild.

For SCSS I used a community plugin: eleventy-sass.
I just had to add the *node_modules* folder to the `loadPaths` in order to resolve styles from packages.

Thumbnail integration felt weird. There is an official *eleventy-img* plugin, however I didn't find an easy way
to access a single thumbnail image directly. Instead, they offer a way to have an img HTML tag with the srcset and sizes.
I wrote some liquid shortcodes myself to address that just for my personal needs.

# Summary

It took some time to convert all blog posts and layouts to the new style.
Despite having too much non-content and code in the repo, I think it is a very good base to continue with.
My main goal is still to have a low barrier to write new posts. That even got easier, thanks to image shortcodes, carousel etc.
The markdown files look a bit cleaner, which is great.

I also used the occasion to update the mobile burger menu to look cleaner and have some css transitions.
Some stuff is still missing (Resume, RSS feed and Barbados posts), but that can be easily added later.

Overall, I am very happy with the result.

{% image "thumbnail.png" %}

# Pros / Cons

- 👍 I have a new flexible blogging system:
  - in modern style (TypeScript + SCSS)
  - which can make use of npm dependencies
  - with thumbnail support
  - beautiful code blocks with line numbers and filenames
  - numbered headings
  - ..and [some more features](https://github.com/andreas-mausch/eleventy-sample)
- 👍 markdown-it-prism is great and it even got support for inline code within days after I have
  [requested it](https://github.com/jGleitz/markdown-it-prism/issues/599). Thank you, jGleitz!
- ❓ The only thing missing for me was [line numbers](https://github.com/jGleitz/markdown-it-prism/issues/1),
  but I could work around that with some js and css.
- ❓ There is one huge [Template.js](https://github.com/11ty/eleventy/blob/e9ca971210fa06efd2af3a7931ef368dcb085a79/src/Template.js)
  with lots of nesting. Puts a question mark on overall code quality.
- ❓ Not much progress on older issues: [822](https://github.com/11ty/eleventy/issues/822),
  [867](https://github.com/11ty/eleventy/issues/867)
- 👎 pathPrefix is ignored by the official plugin [eleventy-img](https://github.com/11ty/eleventy-img/issues/44)
  and [eleventy-favicon](https://github.com/atomrc/eleventy-favicon/issues/8).
  pathPrefix is important when you want to deploy to a subdirectory of a domain.
  Edit: Seems to be addressed by a new [plugin](https://www.11ty.dev/docs/plugins/html-base/).
- 👎 No built-in SASS/SCSS support. Luckily, somebody [developed a plugin](https://github.com/kentaroi/eleventy-sass).
- 👎 No built-in TypeScript support. I have solved this for myself by first using swc, then esbuild.
- 👎 `.eleventy.js` must be JavaScript, not TypeScript
- 👎 `.eleventy.js` must use the old-style `require()` instead of `import`. type: "module" is not supported:
  [link](https://github.com/11ty/eleventy/issues/836)
- 👎 No default human-readable date filter?!
  I don't like to write basic functionality myself.
- 👎 I switched from [eleventy-plugin-syntaxhighlight](https://www.11ty.dev/docs/plugins/syntaxhighlight/)
  to [markdown-it-prism](https://github.com/jGleitz/markdown-it-prism) because of
  [this issue](https://github.com/11ty/eleventy-plugin-syntaxhighlight/issues/66#issuecomment-1214289872).
- 👎 I had to copy and modify the `markdown-it-hierarchy.js` to the repo to
  [fix](https://github.com/andreas-mausch/eleventy-sample/commit/af9aee3a7b09aed12a66909b548e7b8cd21b5f5d)
  a [state issue](https://github.com/shytikov/markdown-it-hierarchy/issues/4).
