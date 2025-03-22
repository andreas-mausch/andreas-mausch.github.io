---
title: "Eleventy: Upgrade from v2 to v3"
date: 2025-03-22T16:00:00+07:00
tags: ['eleventy', 'blog', 'maintenance', 'website']
toc: true
thumbnail: eleventy.svg
---

I made a bigger update to the blog system I use on this website, [Eleventy](https://www.11ty.dev/).
See my previous post about [setting Eleventy up]({% link-post "2022-08-11-migrate-blog-from-jekyll-to-eleventy" %}).

My base repository for the setup is here:
[base repository](https://github.com/andreas-mausch/eleventy-sample)

Eleventy offers an [Upgrade Helper Tool](https://www.11ty.dev/docs/plugins/upgrade-help/) which I tried to use.
Here is how it went.

# Problem installing eleventy-upgrade-help

However, when trying to install it, it failed:

```shell-session
$ npm install @11ty/eleventy@3
$ npm install @11ty/eleventy-upgrade-help@3
npm error code ERESOLVE
npm error ERESOLVE could not resolve
npm error
npm error While resolving: eleventy-sass@2.2.4
npm error Found: @11ty/eleventy@3.0.0
npm error node_modules/@11ty/eleventy
npm error   dev @11ty/eleventy@"3.0.0" from the root project
npm error
npm error Could not resolve dependency:
npm error peer @11ty/eleventy@"^1.0.0 || ^2.0.0-canary.12 || ^2.0.0-beta.1" from eleventy-sass@2.2.4
npm error node_modules/eleventy-sass
npm error   dev eleventy-sass@"2.2.4" from the root project
npm error
npm error Conflicting peer dependency: @11ty/eleventy@2.0.1
npm error node_modules/@11ty/eleventy
npm error   peer @11ty/eleventy@"^1.0.0 || ^2.0.0-canary.12 || ^2.0.0-beta.1" from eleventy-sass@2.2.4
npm error   node_modules/eleventy-sass
npm error     dev eleventy-sass@"2.2.4" from the root project
npm error
npm error Fix the upstream dependency conflict, or retry
npm error this command with --force or --legacy-peer-deps
npm error to accept an incorrect (and potentially broken) dependency resolution.
npm error
npm error
npm error For a full report see:
npm error /home/neonew/.npm/_logs/2025-03-19T14_08_35_121Z-eresolve-report.txt
npm error A complete log of this run can be found in: /home/neonew/.npm/_logs/2025-03-19T14_08_35_121Z-debug-0.log
```

This workaround worked:

```bash
npm install --legacy-peer-deps @11ty/eleventy-upgrade-help@3
```

# ./src/TemplateRender is not defined by "exports"

After that, I tried to run `npm run build`, which should show me the output of the helper plugin
with suggestions what to change. However, this error was presented to me instead:

```shell-session
$ npm run build

> eleventy-sample@1.0.0 build
> ELEVENTY_ENV=production eleventy

[11ty] Eleventy Error (CLI):
[11ty] 1. Error in your Eleventy config file '.eleventy.js'. (via EleventyConfigError)
[11ty] 2. Package subpath './src/TemplateRender' is not defined by "exports" in /home/neonew/Documents/coding/eleventy-sample/node_modules/@11ty/eleventy/package.json
[11ty] 
[11ty] Original error stack trace: Error [ERR_PACKAGE_PATH_NOT_EXPORTED]: Package subpath './src/TemplateRender' is not defined by "exports" in /home/neonew/Documents/coding/eleventy-sample/node_modules/@11ty/eleventy/package.json
[11ty]     at exportsNotFound (node:internal/modules/esm/resolve:314:10)
[11ty]     at packageExportsResolve (node:internal/modules/esm/resolve:661:9)
[11ty]     at resolveExports (node:internal/modules/cjs/loader:661:36)
[11ty]     at Function._findPath (node:internal/modules/cjs/loader:753:31)
[11ty]     at Function._resolveFilename (node:internal/modules/cjs/loader:1391:27)
[11ty]     at defaultResolveImpl (node:internal/modules/cjs/loader:1061:19)
[11ty]     at resolveForCJSWithHooks (node:internal/modules/cjs/loader:1066:22)
[11ty]     at Function._load (node:internal/modules/cjs/loader:1215:37)
[11ty]     at TracingChannel.traceSync (node:diagnostics_channel:322:14)
[11ty]     at wrapModuleLoad (node:internal/modules/cjs/loader:235:24)
```

I found that the `eleventy-sass` plugin I use was the reason, and there is a
[GitHub issue](https://github.com/kentaroi/eleventy-sass/issues/30) for my problem.

So I upgraded to the beta version, which is compatible with Eleventy v3. It solved the issue.

```bash
npm install --save-dev eleventy-sass@3.0.0-beta.0
```

# Output from the Upgrade Helper

The helper then ran successfully and showed me several NOTICEs and WARNINGs.

## permalink warning

```
WARNING: You will likely want to add a `compileOptions.permalink` option for the sass Custom Template Language. If you do not explicitly specify this behavior, we will no longer render permalink strings in sass syntax. The default for this option changed from `true` to "raw". Docs: https://www.11ty.dev/docs/languages/custom/#compileoptions.permalink-to-override-permalink-compilation GitHub issue: https://github.com/11ty/eleventy/issues/2780
```

I'm still not sure what that means.
I have tested the `feed.xml` and footnote links, they both work.
So I didn't change anything.

## js-yaml warning

```
NOTICE: The `js-yaml` dependency was upgraded from v3 to v4 to improve error messaging when folks use tabs in their front matter. GitHub issue: https://github.com/11ty/eleventy/issues/2126 Most folks will be unaffected by this change but you can read the `js-yaml` migration guide: https://github.com/nodeca/js-yaml/blob/master/migrate_v3_to_v4.md
```

I don't think I am affected by this. No Todo here neither.

## meta generator tag warning

```
NOTICE: Your project has .html output files (×28) that don’t have a populated <meta name="generator" content> tag. It would be helpful to Eleventy if you added it (but isn’t required).
```

Adding the generator tag to the `page.njk` fixed it.

## Deprecated sass rules

```
Deprecation Warning [import]: Sass @import rules are deprecated and will be removed in Dart Sass 3.0.0.
```

I am not sure this is related to the Eleventy upgrade, but rather to sass in general.

I have replaced all my occurrences of `@import` by `@mixin` and `@include`.

# Upgrade successful, done?

Now my build runs again without errors and I'm running Eleventy v3.
Great.

But Eleventy v3 also offers some new optional stuff which I have looked into.

## Convert config to new module format

`.eleventy.js` was in CommonJS, and the new `eleventy.config.js` is in ESM format.
Mostly `require` becomes `import` and the `exports` change a bit.

I also used `__dirname` in `eleventy/typescript-esbuild.js`, which was replaced by `path.resolve()`.

I like ESM a lot better and I think this is a great improvment.

## 2 high severity vulnerabilities

I still get a warning when running `npm install` about `2 high severity vulnerabilities`.

This is not fixed because `pre-commit` has an outdated dependency:

[Upgrade cross-spawn Dependency to Address Security Vulnerability (ReDoS)](https://github.com/observing/pre-commit/issues/167)

## Fontsource: Replace old-style mixin

First problem, I got a sass warning again:
**Global built-in functions are deprecated and will be removed in Dart Sass 3.0.0**

```shell-session
$ npm run build

> andreas-mausch-de@1.0.0 build
> ELEVENTY_ENV=production eleventy

/home/neonew/Documents/coding/andreas-mausch.github.io/_site/styles/icons/iconism.ttf font file created!
/home/neonew/Documents/coding/andreas-mausch.github.io/_site/styles/icons/iconism.woff2 font file created!
/home/neonew/Documents/coding/andreas-mausch.github.io/_site/styles/icons/iconism.css css file created!
Deprecation Warning [global-builtin]: Global built-in functions are deprecated and will be removed in Dart Sass 3.0.0.
Use list.append instead.

More info and automated migrator: https://sass-lang.com/d/import

    ╷
98  │                   $src: append(
    │ ┌───────────────────────^
99  │ │                   $src,
100 │ │                   url('#{$directory}/#{$variant}.#{$format}')
101 │ │                     format('#{$format}#{if($axis, '-variations', '')}'),
102 │ │                   comma
103 │ │                 );
    │ └─────────────────^
    ╵
    @fontsource/raleway/scss/mixins.scss 98:23  generator()
    @fontsource/raleway/scss/mixins.scss 167:3  faces()
    styles/style.scss 14:1                      root stylesheet

```

After upgrading fontsource to `5.2.5`, it gave a new warning:

```
Warning: Importing mixins via the fontsource package is deprecated and will be removed in the next major release. Please use the @fontsource-utils/scss package instead.
    @fontsource/raleway/scss/mixins.scss 37:3   generator()
    @fontsource/raleway/scss/mixins.scss 168:3  faces()
    styles/style.scss 14:1                      root stylesheet
```

I could fix it by using the new way of fontsource's mixins.
I also switched to the variable font.

See there documentation here:
<https://fontsource.org/docs/getting-started/faces-mixin>

## sass NodePackageImporter

I used to load scss from packages via the `loadPaths` option.
A better way is to use the importer `NodePackageImporter` and prefix
package imports via `@use "pkg:.."`.

See here:
<https://sass-lang.com/documentation/at-rules/use/#pkg-ur-ls>

## Eleventy PathPrefix issues

After doing the change, my browser tried to find the css at
`/eleventy-sample/eleventy-sample/styles/style.css`.

So it duplicated the path prefix for some reason.
Which is good, because previously I have implemented a workaround to get the path prefix right,
and now I can get rid of that workaround.

The templates become a bit easier to read, and I don't need the URL filter anymore:
<https://www.11ty.dev/docs/filters/url/>

```diff{% raw %}
-    <link rel="stylesheet" href="{{ "/styles/style.css" | url }}" />
+    <link rel="stylesheet" href="/styles/style.css" />
{% endraw %}```

Also, I don't need the ugly workaround using my custom
`ELEVENTY_PATH_PREFIX` environment variable. I was used to prefix image urls.

There is also the html `<base>` way to do this, but I don't use it (yet).

<https://www.11ty.dev/docs/config/#deploy-to-a-subdirectory-with-a-path-prefix>

<https://www.11ty.dev/docs/plugins/html-base/>

# Summary

It is great Eleventy offers a helper tool to make upgrading a bit less painful.

Also, two points of my previous list of cons were fixed, so things are moving in the right direction:

> - 👎 pathPrefix is ignored by the official plugin [eleventy-img](https://github.com/11ty/eleventy-img/issues/44)
>   and [eleventy-favicon](https://github.com/atomrc/eleventy-favicon/issues/8).
> - 👎 `.eleventy.js` must use the old-style `require()` instead of `import`. type: "module" is not supported:
>   [link](https://github.com/11ty/eleventy/issues/836)

What I wish for in the future is real typescript support for config file.
Currently, you can move your `eleventy.config.js` to `.ts` and run it via `tsx`:
`npx tsx ./node_modules/.bin/eleventy`

<https://www.11ty.dev/docs/languages/typescript/#using-a-type-script-configuration-file>

It would be great if `tsx` wouldn't be a requirement here, but instead Eleventy cares about it.
