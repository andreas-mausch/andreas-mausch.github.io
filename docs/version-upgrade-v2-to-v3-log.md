# Install new version

```bash
npm install @11ty/eleventy@3
npm install @11ty/eleventy-upgrade-help@3
```

# Cannot install `eleventy-upgrade-help`, problem with `eleventy-sass` (workaround found)

fails for `eleventy-sass`:
https://github.com/kentaroi/eleventy-sass/issues/30

```shell-session
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

This one works:

```
npm install --legacy-peer-deps @11ty/eleventy-upgrade-help@3
```

# Upgrade `.eleventy.js`

Add the plugin `UpgradeHelper`, as described in the docs.

# Error: `Package subpath './src/TemplateRender' is not defined by "exports"` (fixed in beta)

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

GitHub Issue: <https://github.com/kentaroi/eleventy-sass/issues/30>

Is `eleventy-sass` the reason again?

> I just released eleventy-sass@3.0.0-beta.0 that is compatible with Eleventy 3. I haven't read all of the changes made to Eleventy 3, but fortunately the plugin seems to work with Eleventy 3.
> <https://github.com/kentaroi/eleventy-sass/issues/30#issuecomment-2294096992>

Fix: Use a beta version, which is compatible with Eleventy v3:

```bash
npm install --save-dev eleventy-sass@3.0.0-beta.0
```

# Output of `11ty/eleventy-upgrade-help`

```shell-session
$ npm run build

> eleventy-sample@1.0.0 build
> ELEVENTY_ENV=production eleventy

[11ty/eleventy-upgrade-help] ---
[11ty/eleventy-upgrade-help] This plugin will help you migrate from 2.0 to 3.0.
[11ty/eleventy-upgrade-help] If you are migrating from 0.x or 1.x, please use a previous version of this plugin.
[11ty/eleventy-upgrade-help] ---
[11ty/eleventy-upgrade-help] PASSED You are using Node v23.9.0. Node 18 or newer is required.
[11ty/eleventy-upgrade-help] PASSED Eleventy will fail with an error when you point `--config` to a configuration file that does not exist. You are not using `--config`—so don’t worry about it! Read more: https://github.com/11ty/eleventy/issues/3373
[11ty/eleventy-upgrade-help] PASSED You aren’t using `--formats=` or  `--formats=''` but if you were you should know that these are now empty template format sets. In previous versions, they were aliased to "*". Read more: https://github.com/11ty/eleventy/issues/3255
[11ty/eleventy-upgrade-help] PASSED No {pug,ejs,haml,mustache,handlebars} templates were found in this project. If you were, you would have needed to install plugins for these: https://github.com/11ty/eleventy-plugin-template-languages. Learn more: https://github.com/11ty/eleventy/issues/3124
[11ty/eleventy-upgrade-help] WARNING You will likely want to add a `compileOptions.permalink` option for the sass Custom Template Language. If you do not explicitly specify this behavior, we will no longer render permalink strings in sass syntax. The default for this option changed from `true` to "raw". Docs: https://www.11ty.dev/docs/languages/custom/#compileoptions.permalink-to-override-permalink-compilation GitHub issue: https://github.com/11ty/eleventy/issues/2780
[11ty/eleventy-upgrade-help] WARNING You will likely want to add a `compileOptions.permalink` option for the scss Custom Template Language. If you do not explicitly specify this behavior, we will no longer render permalink strings in scss syntax. The default for this option changed from `true` to "raw". Docs: https://www.11ty.dev/docs/languages/custom/#compileoptions.permalink-to-override-permalink-compilation GitHub issue: https://github.com/11ty/eleventy/issues/2780
[11ty/eleventy-upgrade-help] WARNING You will likely want to add a `compileOptions.permalink` option for the ts Custom Template Language. If you do not explicitly specify this behavior, we will no longer render permalink strings in ts syntax. The default for this option changed from `true` to "raw". Docs: https://www.11ty.dev/docs/languages/custom/#compileoptions.permalink-to-override-permalink-compilation GitHub issue: https://github.com/11ty/eleventy/issues/2780
[11ty/eleventy-upgrade-help] NOTICE The `js-yaml` dependency was upgraded from v3 to v4 to improve error messaging when folks use tabs in their front matter. GitHub issue: https://github.com/11ty/eleventy/issues/2126 Most folks will be unaffected by this change but you can read the `js-yaml` migration guide: https://github.com/nodeca/js-yaml/blob/master/migrate_v3_to_v4.md
[11ty/eleventy-upgrade-help] PASSED The Serverless plugin was removed from Eleventy core in 3.0. Any use will throw an error, so if you don’t see an error you’re not using it. Learn more: https://www.11ty.dev/docs/plugins/serverless/
[11ty/eleventy-upgrade-help] PASSED The Edge plugin was removed from Eleventy core in 3.0. Any use will throw an error, so if you don’t see an error you’re not using it. Learn more: https://www.11ty.dev/docs/plugins/edge/
[11ty/eleventy-upgrade-help] PASSED The `htmlOutputSuffix` feature was removed. It doesn’t look like you were using it! Learn more: https://github.com/11ty/eleventy/issues/3327
Deprecation Warning [import]: Sass @import rules are deprecated and will be removed in Dart Sass 3.0.0.

More info and automated migrator: https://sass-lang.com/d/import

    ╷
182 │   @import "_large";
    │           ^^^^^^^^
    ╵
    styles/style.scss 182:11  root stylesheet

Deprecation Warning [import]: Sass @import rules are deprecated and will be removed in Dart Sass 3.0.0.

More info and automated migrator: https://sass-lang.com/d/import

    ╷
186 │   @import "_print";
    │           ^^^^^^^^
    ╵
    styles/style.scss 186:11  root stylesheet

↘ _site/                                   --                                                  -- --
  ↘ posts/                                 --                                                  -- --
    → 2022-08-07-first-blo[…]/index.html   posts/2022-08-07-first-blo[…]/index.md           0.7kB --
    → 2022-08-07-image-thu[…]/index.html   posts/2022-08-07-image-thu[…]/index.md           4.2kB --
    → 2022-08-07-typescrip[…]/index.html   posts/2022-08-07-typescrip[…]/index.md           0.6kB --
    → 2022-08-11-code-bloc[…]/index.html   posts/2022-08-11-code-bloc[…]/index.md          14.8kB --
    → 2022-08-14-image-car[…]/index.html   posts/2022-08-14-image-car[…]/index.md           3.8kB --
    → 2022-08-15-image-com[…]/index.html   posts/2022-08-15-image-com[…]/index.md           1.1kB --
    → 2022-08-15-table-of-[…]/index.html   posts/2022-08-15-table-of-[…]/index.md           8.7kB --
    → 2022-08-16-emoji/index.html          posts/2022-08-16-emoji/index.md                  1.1kB --
    → 2022-08-16-links/index.html          posts/2022-08-16-links/index.md                  0.9kB --
    → 2022-08-17-katex-for[…]/index.html   posts/2022-08-17-katex-for[…]/index.md           3.5kB --
    → 2022-08-20-checklist/index.html      posts/2022-08-20-checklist/index.md              2.3kB --
    → 2022-08-20-footnotes/index.html      posts/2022-08-20-footnotes/index.md              3.4kB --
    → 2022-08-20-kbd-keyst[…]/index.html   posts/2022-08-20-kbd-keyst[…]/index.md           0.6kB --
    → 2022-08-22-quotes/index.html         posts/2022-08-22-quotes/index.md                 3.7kB --
    → 2022-08-23-tables/index.html         posts/2022-08-23-tables/index.md                 0.9kB --
    → 2022-08-25-post-with[…]/index.html   posts/2022-08-25-post-without-direct[…].md       0.6kB --
    → 2022-08-28-post-with[…]/index.html   posts/2022-08-28-post-with[…]/index.md           0.6kB --
    → 2022-09-02-video/index.html          posts/2022-09-02-video/index.md                  0.8kB --
    → 2022-09-04-post-with[…]/index.html   posts/2022-09-04-post-with[…]/index.md           0.8kB --
    → 2022-09-04-squared-t[…]/index.html   posts/2022-09-04-squared-t[…]/index.md           0.7kB --
    → 2022-09-04-svg-png/index.html        posts/2022-09-04-svg-png/index.md                2.0kB --
    → 2022-12-14-draft/index.html          posts/2022-12-14-draft/index.md                  0.5kB --
    → 2024-05-09-plantuml/index.html       posts/2024-05-09-plantuml/index.md              90.1kB --
    → 2024-05-11-qr-code/index.html        posts/2024-05-11-qr-code/index.md                1.9kB --
    → 2025-03-07-hex-view/index.html       posts/2025-03-07-hex-view/index.md              38.5kB --
    → 2025-03-14-asciinema/index.html      posts/2025-03-14-asciinema/index.md            133.3kB --
  ↘ scripts/                               --                                                  -- --
    • copy-to-clipboard.js                 scripts/copy-to-clipboard.ts                     0.3kB --
    • index.js                             scripts/index.ts                                22.1kB --
  ↘ styles/                                --                                                  -- --
    • katex.css                            styles/katex.scss                               23.4kB --
    • style.css                            styles/style.scss                               23.7kB --
  → version-upgrade/index.html             version-upgrade.md                               9.6kB --
  • feed.xml                               feed.njk                                        27.7kB --
  • index.html                             index.njk                                       12.0kB --
[11ty/eleventy-upgrade-help] This plugin is intended for temporary use: once you’re satisfied please remove this plugin from your project.
[11ty/eleventy-upgrade-help] NOTICE Your project has .html output files (×28) that don’t have a populated <meta name="generator" content> tag. It would be helpful to Eleventy if you added it (but isn’t required). Applicable input files: ./version-upgrade.md, ./index.njk, ./posts/2022-08-25-post-without-directory.md, ./posts/2022-08-07-first-blog-post/index.md, ./posts/2022-08-07-image-thumbnails/index.md, ./posts/2022-08-07-typescript-example/index.md, ./posts/2022-08-11-code-block/index.md, ./posts/2022-08-14-image-carousel/index.md, ./posts/2022-08-15-image-comparison-slider/index.md, ./posts/2022-08-15-table-of-contents/index.md, ./posts/2022-08-16-links/index.md, ./posts/2022-08-16-emoji/index.md, ./posts/2022-08-17-katex-formula/index.md, ./posts/2022-08-20-checklist/index.md, ./posts/2022-08-20-footnotes/index.md, ./posts/2022-08-22-quotes/index.md, ./posts/2022-08-23-tables/index.md, ./posts/2022-08-20-kbd-keystrokes/index.md, ./posts/2022-09-02-video/index.md, ./posts/2022-08-28-post-with-thumbnail/index.md, ./posts/2022-09-04-post-with-thumbnail-reference/index.md, ./posts/2022-09-04-squared-thumbnail/index.md, ./posts/2022-09-04-svg-png/index.md, ./posts/2022-12-14-draft/index.md, ./posts/2024-05-09-plantuml/index.md, ./posts/2024-05-11-qr-code/index.md, ./posts/2025-03-07-hex-view/index.md, ./posts/2025-03-14-asciinema/index.md Read more: https://www.11ty.dev/docs/data-eleventy-supplied/#use-with-meta-namegenerator
[11ty] Benchmark   6886ms  31%     1× (Configuration) "asciinema" Liquid Shortcode
[11ty] Copied 84 Wrote 33 files in 22.47 seconds (681.0ms each, v3.0.0)
```

## WARNING: You will likely want to add a `compileOptions.permalink` option for the ts Custom Template Language

> You will likely want to add a `compileOptions.permalink` option for the sass Custom Template Language. If you do not explicitly specify this behavior, we will no longer render permalink strings in sass syntax. The default for this option changed from `true` to "raw". Docs: https://www.11ty.dev/docs/languages/custom/#compileoptions.permalink-to-override-permalink-compilation GitHub issue: https://github.com/11ty/eleventy/issues/2780

I'm still not sure what that means.
I have tested the `feed.xml` and footnote links, they both work.

## NOTICE: The `js-yaml` dependency was upgraded from v3 to v4 to improve error messaging when folks use tabs in their front matter.

> The `js-yaml` dependency was upgraded from v3 to v4 to improve error messaging when folks use tabs in their front matter. GitHub issue: https://github.com/11ty/eleventy/issues/2126 Most folks will be unaffected by this change but you can read the `js-yaml` migration guide: https://github.com/nodeca/js-yaml/blob/master/migrate_v3_to_v4.md

I don't think I am affected by this. No Todo here.

## NOTICE: Your project has .html output files (×28) that don’t have a populated <meta name="generator" content> tag.

> Your project has .html output files (×28) that don’t have a populated <meta name="generator" content> tag. It would be helpful to Eleventy if you added it (but isn’t required).

Adding the generator tag to the `page.njk` fixed it.

## Deprecation Warning [import]: Sass @import rules are deprecated and will be removed in Dart Sass 3.0.0.

Replaced by `@mixin` and `@include`.

# Convert `.eleventy.js` to `eleventy.config.js` in the new module format

`.eleventy.js` was in CommonJS, and the new `eleventy.config.js` is in ESM format.
Mostly `require` becomes `import` and the `exports` change a bit.

I also used `__dirname` in `eleventy/typescript-esbuild.js`, which was replaced by `path.resolve()`.

# 2 high severity vulnerabilities

```shell-session
$ npm install

added 622 packages, and audited 623 packages in 1m

150 packages are looking for funding
  run `npm fund` for details

2 high severity vulnerabilities

To address all issues (including breaking changes), run:
  npm audit fix --force

Run `npm audit` for details.

$ npm audit
# npm audit report

cross-spawn  <6.0.6
Severity: high
Regular Expression Denial of Service (ReDoS) in cross-spawn - https://github.com/advisories/GHSA-3xgq-45jj-v275
fix available via `npm audit fix --force`
Will install pre-commit@1.0.10, which is a breaking change
node_modules/pre-commit/node_modules/cross-spawn
  pre-commit  >=1.1.0
  Depends on vulnerable versions of cross-spawn
  node_modules/pre-commit

2 high severity vulnerabilities

To address all issues (including breaking changes), run:
  npm audit fix --force
```

This is not fixed because `pre-commit` has a security issue in it's dependencies:

[Upgrade cross-spawn Dependency to Address Security Vulnerability (ReDoS)](https://github.com/observing/pre-commit/issues/167)

Since the last commit to `pre-commit` was six years ago, I'm not sure this will ever get fixed. I will look for an alternative.
