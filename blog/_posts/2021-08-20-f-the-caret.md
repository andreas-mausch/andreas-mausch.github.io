---
layout: post
title: "F the caret"
date: 2021-08-20 21:00:00 +02:00
tags:
---

Why I prefer fixed versions for dependencies and a reproducible build.

# npm and the caret (^)

Most likely you have seen or maybe use yourself the caret in front of
your dependency version, for example `^1.4.2`.

Here is a great article which explains it's meaning:

[https://bytearcher.com/articles/semver-explained-why-theres-a-caret-in-my-package-json/](https://bytearcher.com/articles/semver-explained-why-theres-a-caret-in-my-package-json/)

This means, if a new patch version `1.4.3` of that package is released, it will be used instead of your
specified version `1.4.2`.
Even if there is an update to the minor version, for example `1.5.0`, it will be taken.

This is convenient, because your software is automatically updated.

However, it results in one, for me major, disadvantage:
Your build is **not reproducible** anymore.

# Example of the consequences having a non-reproducible build

The CI in this project uses [npm-cli-login](https://www.npmjs.com/package/npm-cli-login) access a custom npm registry:

```
yarn add global npm-cli-login
```

So on Thursday, there was an update to the package [boolean](https://github.com/thenativeweb/boolean),
which now enforced the *engine* node to be at least v16.
However, AWS Lambda [only supports](https://docs.aws.amazon.com/lambda/latest/dg/lambda-runtimes.html) up to v14.

The `boolean` package is used as some sub-dependency of `npm-cli-login`:

<details markdown="1">
<summary>npm-cli-login has this dependency tree</summary>
```
$ npx npm-remote-ls npm-cli-login
└─ npm-cli-login@0.1.1
   ├─ chai@3.5.0
   │  ├─ deep-eql@0.1.3
   │  │  └─ type-detect@0.1.1
   │  ├─ type-detect@1.0.0
   │  └─ assertion-error@1.1.0
   ├─ jshint@2.13.1
   │  ├─ console-browserify@1.1.0
   │  │  └─ date-now@0.1.4
   │  ├─ exit@0.1.2
   │  ├─ htmlparser2@3.8.3
   │  │  ├─ domutils@1.5.1
   │  │  │  ├─ domelementtype@1.3.1
   │  │  │  └─ dom-serializer@0.2.2
   │  │  │     ├─ entities@2.2.0
   │  │  │     └─ domelementtype@2.2.0
   │  │  ├─ domhandler@2.3.0
   │  │  │  └─ domelementtype@1.3.1
   │  │  ├─ domelementtype@1.3.1
   │  │  ├─ readable-stream@1.1.14
   │  │  │  ├─ core-util-is@1.0.2
   │  │  │  ├─ inherits@2.0.4
   │  │  │  ├─ string_decoder@0.10.31
   │  │  │  └─ isarray@0.0.1
   │  │  └─ entities@1.0.0
   │  ├─ minimatch@3.0.4
   │  │  └─ brace-expansion@1.1.11
   │  │     ├─ balanced-match@1.0.2
   │  │     └─ concat-map@0.0.1
   │  ├─ lodash@4.17.21
   │  ├─ shelljs@0.3.0
   │  ├─ strip-json-comments@1.0.4
   │  └─ cli@1.0.1
   │     ├─ glob@7.1.7
   │     │  ├─ fs.realpath@1.0.0
   │     │  ├─ inflight@1.0.6
   │     │  ├─ once@1.4.0
   │     │  ├─ inherits@2.0.4
   │     │  ├─ minimatch@3.0.4
   │     │  └─ path-is-absolute@1.0.1
   │     └─ exit@0.1.2
   ├─ jscs@3.0.7
   │  ├─ cli-table@0.3.6
   │  │  └─ colors@1.0.3
   │  ├─ chalk@1.1.3
   │  │  ├─ escape-string-regexp@1.0.5
   │  │  ├─ ansi-styles@2.2.1
   │  │  ├─ has-ansi@2.0.0
   │  │  │  └─ ansi-regex@2.1.1
   │  │  ├─ strip-ansi@3.0.1
   │  │  │  └─ ansi-regex@2.1.1
   │  │  └─ supports-color@2.0.0
   │  ├─ exit@0.1.2
   │  ├─ estraverse@4.3.0
   │  ├─ commander@2.9.0
   │  │  └─ graceful-readlink@1.0.1
   │  ├─ cst@0.4.10
   │  │  ├─ babel-runtime@6.26.0
   │  │  │  ├─ core-js@2.6.12
   │  │  │  └─ regenerator-runtime@0.11.1
   │  │  ├─ source-map-support@0.4.18
   │  │  │  └─ source-map@0.5.7
   │  │  └─ babylon@6.18.0
   │  ├─ glob@5.0.15
   │  │  ├─ inflight@1.0.6
   │  │  │  ├─ once@1.4.0
   │  │  │  └─ wrappy@1.0.2
   │  │  ├─ minimatch@3.0.4
   │  │  ├─ inherits@2.0.4
   │  │  ├─ once@1.4.0
   │  │  └─ path-is-absolute@1.0.1
   │  ├─ htmlparser2@3.8.3
   │  ├─ jscs-preset-wikimedia@1.0.1
   │  ├─ jsonlint@1.6.3
   │  │  ├─ JSV@4.0.2
   │  │  └─ nomnom@1.8.1
   │  │     ├─ underscore@1.6.0
   │  │     └─ chalk@0.4.0
   │  │        ├─ has-color@0.1.7
   │  │        ├─ strip-ansi@0.1.1
   │  │        └─ ansi-styles@1.0.0
   │  ├─ js-yaml@3.4.6
   │  │  ├─ argparse@1.0.10
   │  │  │  └─ sprintf-js@1.0.3
   │  │  ├─ esprima@2.7.3
   │  │  └─ inherit@2.2.7
   │  ├─ jscs-jsdoc@2.0.0
   │  │  ├─ jsdoctypeparser@1.2.0
   │  │  │  └─ lodash@3.10.1
   │  │  └─ comment-parser@0.3.2
   │  │     └─ readable-stream@2.3.7
   │  ├─ lodash@3.10.1
   │  ├─ minimatch@3.0.4
   │  ├─ natural-compare@1.2.2
   │  ├─ pathval@0.1.1
   │  ├─ prompt@0.2.14
   │  │  ├─ pkginfo@0.4.1
   │  │  ├─ revalidator@0.1.8
   │  │  ├─ utile@0.2.1
   │  │  │  ├─ async@0.2.10
   │  │  │  ├─ deep-equal@2.0.5
   │  │  │  │  ├─ es-get-iterator@1.1.2
   │  │  │  │  │  ├─ is-arguments@1.1.1
   │  │  │  │  │  ├─ call-bind@1.0.2
   │  │  │  │  │  ├─ get-intrinsic@1.1.1
   │  │  │  │  │  ├─ has-symbols@1.0.2
   │  │  │  │  │  ├─ is-map@2.0.2
   │  │  │  │  │  ├─ isarray@2.0.5
   │  │  │  │  │  ├─ is-set@2.0.2
   │  │  │  │  │  └─ is-string@1.0.7
   │  │  │  │  │     └─ has-tostringtag@1.0.0
   │  │  │  │  ├─ is-date-object@1.0.5
   │  │  │  │  │  └─ has-tostringtag@1.0.0
   │  │  │  │  │     └─ has-symbols@1.0.2
   │  │  │  │  ├─ get-intrinsic@1.1.1
   │  │  │  │  │  ├─ function-bind@1.1.1
   │  │  │  │  │  ├─ has@1.0.3
   │  │  │  │  │  └─ has-symbols@1.0.2
   │  │  │  │  ├─ is-arguments@1.1.1
   │  │  │  │  │  ├─ call-bind@1.0.2
   │  │  │  │  │  └─ has-tostringtag@1.0.0
   │  │  │  │  ├─ call-bind@1.0.2
   │  │  │  │  │  ├─ function-bind@1.1.1
   │  │  │  │  │  └─ get-intrinsic@1.1.1
   │  │  │  │  ├─ isarray@2.0.5
   │  │  │  │  ├─ is-regex@1.1.4
   │  │  │  │  │  ├─ has-tostringtag@1.0.0
   │  │  │  │  │  └─ call-bind@1.0.2
   │  │  │  │  ├─ object.assign@4.1.2
   │  │  │  │  │  ├─ call-bind@1.0.2
   │  │  │  │  │  ├─ define-properties@1.1.3
   │  │  │  │  │  │  └─ object-keys@1.1.1
   │  │  │  │  │  ├─ object-keys@1.1.1
   │  │  │  │  │  └─ has-symbols@1.0.2
   │  │  │  │  ├─ object-is@1.1.5
   │  │  │  │  │  ├─ call-bind@1.0.2
   │  │  │  │  │  └─ define-properties@1.1.3
   │  │  │  │  ├─ regexp.prototype.flags@1.3.1
   │  │  │  │  │  ├─ call-bind@1.0.2
   │  │  │  │  │  └─ define-properties@1.1.3
   │  │  │  │  ├─ object-keys@1.1.1
   │  │  │  │  ├─ side-channel@1.0.4
   │  │  │  │  │  ├─ call-bind@1.0.2
   │  │  │  │  │  ├─ get-intrinsic@1.1.1
   │  │  │  │  │  └─ object-inspect@1.11.0
   │  │  │  │  ├─ which-collection@1.0.1
   │  │  │  │  │  ├─ is-map@2.0.2
   │  │  │  │  │  ├─ is-set@2.0.2
   │  │  │  │  │  ├─ is-weakmap@2.0.1
   │  │  │  │  │  └─ is-weakset@2.0.1
   │  │  │  │  ├─ which-typed-array@1.1.6
   │  │  │  │  │  ├─ call-bind@1.0.2
   │  │  │  │  │  ├─ has-tostringtag@1.0.0
   │  │  │  │  │  ├─ es-abstract@1.18.5
   │  │  │  │  │  │  ├─ call-bind@1.0.2
   │  │  │  │  │  │  ├─ get-intrinsic@1.1.1
   │  │  │  │  │  │  ├─ has@1.0.3
   │  │  │  │  │  │  ├─ es-to-primitive@1.2.1
   │  │  │  │  │  │  │  ├─ is-callable@1.2.4
   │  │  │  │  │  │  │  ├─ is-date-object@1.0.5
   │  │  │  │  │  │  │  └─ is-symbol@1.0.4
   │  │  │  │  │  │  ├─ internal-slot@1.0.3
   │  │  │  │  │  │  │  ├─ get-intrinsic@1.1.1
   │  │  │  │  │  │  │  ├─ has@1.0.3
   │  │  │  │  │  │  │  └─ side-channel@1.0.4
   │  │  │  │  │  │  ├─ has-symbols@1.0.2
   │  │  │  │  │  │  ├─ is-callable@1.2.4
   │  │  │  │  │  │  ├─ is-regex@1.1.4
   │  │  │  │  │  │  ├─ is-negative-zero@2.0.1
   │  │  │  │  │  │  ├─ object-keys@1.1.1
   │  │  │  │  │  │  ├─ object-inspect@1.11.0
   │  │  │  │  │  │  ├─ is-string@1.0.7
   │  │  │  │  │  │  ├─ function-bind@1.1.1
   │  │  │  │  │  │  ├─ string.prototype.trimend@1.0.4
   │  │  │  │  │  │  │  ├─ call-bind@1.0.2
   │  │  │  │  │  │  │  └─ define-properties@1.1.3
   │  │  │  │  │  │  ├─ unbox-primitive@1.0.1
   │  │  │  │  │  │  │  ├─ function-bind@1.1.1
   │  │  │  │  │  │  │  ├─ has-bigints@1.0.1
   │  │  │  │  │  │  │  ├─ which-boxed-primitive@1.0.2
   │  │  │  │  │  │  │  └─ has-symbols@1.0.2
   │  │  │  │  │  │  ├─ object.assign@4.1.2
   │  │  │  │  │  │  └─ string.prototype.trimstart@1.0.4
   │  │  │  │  │  │     ├─ define-properties@1.1.3
   │  │  │  │  │  │     └─ call-bind@1.0.2
   │  │  │  │  │  ├─ is-typed-array@1.1.7
   │  │  │  │  │  │  ├─ available-typed-arrays@1.0.4
   │  │  │  │  │  │  ├─ call-bind@1.0.2
   │  │  │  │  │  │  ├─ foreach@2.0.5
   │  │  │  │  │  │  ├─ es-abstract@1.18.5
   │  │  │  │  │  │  └─ has-tostringtag@1.0.0
   │  │  │  │  │  ├─ available-typed-arrays@1.0.4
   │  │  │  │  │  └─ foreach@2.0.5
   │  │  │  │  └─ which-boxed-primitive@1.0.2
   │  │  │  │     ├─ is-bigint@1.0.4
   │  │  │  │     │  └─ has-bigints@1.0.1
   │  │  │  │     ├─ is-symbol@1.0.4
   │  │  │  │     │  └─ has-symbols@1.0.2
   │  │  │  │     ├─ is-boolean-object@1.1.2
   │  │  │  │     │  ├─ call-bind@1.0.2
   │  │  │  │     │  └─ has-tostringtag@1.0.0
   │  │  │  │     ├─ is-string@1.0.7
   │  │  │  │     └─ is-number-object@1.0.6
   │  │  │  │        └─ has-tostringtag@1.0.0
   │  │  │  ├─ rimraf@2.7.1
   │  │  │  ├─ mkdirp@0.5.5
   │  │  │  │  └─ minimist@1.2.5
   │  │  │  ├─ ncp@0.4.2
   │  │  │  └─ i@0.3.6
   │  │  ├─ winston@0.8.3
   │  │  │  ├─ async@0.2.10
   │  │  │  ├─ colors@0.6.2
   │  │  │  ├─ cycle@1.0.3
   │  │  │  ├─ isstream@0.1.2
   │  │  │  ├─ pkginfo@0.3.1
   │  │  │  ├─ stack-trace@0.0.10
   │  │  │  └─ eyes@0.1.8
   │  │  └─ read@1.0.7
   │  │     └─ mute-stream@0.0.8
   │  ├─ reserved-words@0.1.2
   │  ├─ to-double-quotes@2.0.0
   │  ├─ strip-bom@2.0.0
   │  │  └─ is-utf8@0.2.1
   │  ├─ strip-json-comments@1.0.4
   │  ├─ to-single-quotes@2.0.1
   │  ├─ resolve@1.20.0
   │  │  ├─ is-core-module@2.6.0
   │  │  │  └─ has@1.0.3
   │  │  │     └─ function-bind@1.1.1
   │  │  └─ path-parse@1.0.7
   │  ├─ vow@0.4.20
   │  ├─ vow-fs@0.3.6
   │  │  ├─ uuid@2.0.3
   │  │  ├─ vow@0.4.20
   │  │  ├─ glob@7.1.7
   │  │  └─ vow-queue@0.4.3
   │  │     └─ vow@0.4.20
   │  └─ xmlbuilder@3.1.0
   │     └─ lodash@3.10.1
   ├─ npm-registry-client@8.6.0
   │  ├─ concat-stream@1.6.2
   │  │  ├─ inherits@2.0.4
   │  │  ├─ buffer-from@1.1.2
   │  │  ├─ typedarray@0.0.6
   │  │  └─ readable-stream@2.3.7
   │  │     ├─ core-util-is@1.0.2
   │  │     ├─ inherits@2.0.4
   │  │     ├─ isarray@1.0.0
   │  │     ├─ process-nextick-args@2.0.1
   │  │     ├─ safe-buffer@5.1.2
   │  │     ├─ string_decoder@1.1.1
   │  │     │  └─ safe-buffer@5.1.2
   │  │     └─ util-deprecate@1.0.2
   │  ├─ normalize-package-data@2.5.0
   │  │  ├─ resolve@1.20.0
   │  │  ├─ hosted-git-info@2.8.9
   │  │  ├─ validate-npm-package-license@3.0.4
   │  │  │  ├─ spdx-correct@3.1.1
   │  │  │  │  ├─ spdx-expression-parse@3.0.1
   │  │  │  │  └─ spdx-license-ids@3.0.10
   │  │  │  └─ spdx-expression-parse@3.0.1
   │  │  │     ├─ spdx-license-ids@3.0.10
   │  │  │     └─ spdx-exceptions@2.3.0
   │  │  └─ semver@5.7.1
   │  ├─ once@1.4.0
   │  │  └─ wrappy@1.0.2
   │  ├─ graceful-fs@4.2.8
   │  ├─ npm-package-arg@6.1.1
   │  │  ├─ osenv@0.1.5
   │  │  │  ├─ os-homedir@1.0.2
   │  │  │  └─ os-tmpdir@1.0.2
   │  │  ├─ hosted-git-info@2.8.9
   │  │  ├─ semver@5.7.1
   │  │  └─ validate-npm-package-name@3.0.0
   │  │     └─ builtins@1.0.3
   │  ├─ request@2.88.2
   │  │  ├─ aws-sign2@0.7.0
   │  │  ├─ combined-stream@1.0.8
   │  │  │  └─ delayed-stream@1.0.0
   │  │  ├─ extend@3.0.2
   │  │  ├─ forever-agent@0.6.1
   │  │  ├─ caseless@0.12.0
   │  │  ├─ is-typedarray@1.0.0
   │  │  ├─ isstream@0.1.2
   │  │  ├─ har-validator@5.1.5
   │  │  │  ├─ har-schema@2.0.0
   │  │  │  └─ ajv@6.12.6
   │  │  │     ├─ fast-json-stable-stringify@2.1.0
   │  │  │     ├─ json-schema-traverse@0.4.1
   │  │  │     ├─ fast-deep-equal@3.1.3
   │  │  │     └─ uri-js@4.4.1
   │  │  │        └─ punycode@2.1.1
   │  │  ├─ json-stringify-safe@5.0.1
   │  │  ├─ mime-types@2.1.32
   │  │  │  └─ mime-db@1.49.0
   │  │  ├─ oauth-sign@0.9.0
   │  │  ├─ http-signature@1.2.0
   │  │  │  ├─ assert-plus@1.0.0
   │  │  │  ├─ sshpk@1.16.1
   │  │  │  │  ├─ asn1@0.2.4
   │  │  │  │  │  └─ safer-buffer@2.1.2
   │  │  │  │  ├─ assert-plus@1.0.0
   │  │  │  │  ├─ dashdash@1.14.1
   │  │  │  │  │  └─ assert-plus@1.0.0
   │  │  │  │  ├─ getpass@0.1.7
   │  │  │  │  │  └─ assert-plus@1.0.0
   │  │  │  │  ├─ jsbn@0.1.1
   │  │  │  │  ├─ ecc-jsbn@0.1.2
   │  │  │  │  │  ├─ jsbn@0.1.1
   │  │  │  │  │  └─ safer-buffer@2.1.2
   │  │  │  │  ├─ tweetnacl@0.14.5
   │  │  │  │  ├─ safer-buffer@2.1.2
   │  │  │  │  └─ bcrypt-pbkdf@1.0.2
   │  │  │  │     └─ tweetnacl@0.14.5
   │  │  │  └─ jsprim@1.4.1
   │  │  │     ├─ extsprintf@1.3.0
   │  │  │     ├─ assert-plus@1.0.0
   │  │  │     ├─ json-schema@0.2.3
   │  │  │     └─ verror@1.10.0
   │  │  │        ├─ core-util-is@1.0.2
   │  │  │        ├─ assert-plus@1.0.0
   │  │  │        └─ extsprintf@1.4.0
   │  │  ├─ performance-now@2.1.0
   │  │  ├─ form-data@2.3.3
   │  │  │  ├─ asynckit@0.4.0
   │  │  │  ├─ mime-types@2.1.32
   │  │  │  └─ combined-stream@1.0.8
   │  │  ├─ safe-buffer@5.2.1
   │  │  ├─ qs@6.5.2
   │  │  ├─ tunnel-agent@0.6.0
   │  │  │  └─ safe-buffer@5.2.1
   │  │  ├─ tough-cookie@2.5.0
   │  │  │  ├─ punycode@2.1.1
   │  │  │  └─ psl@1.8.0
   │  │  ├─ uuid@3.4.0
   │  │  └─ aws4@1.11.0
   │  ├─ slide@1.1.6
   │  ├─ safe-buffer@5.2.1
   │  ├─ retry@0.10.1
   │  ├─ semver@5.7.1
   │  ├─ ssri@5.3.0
   │  │  └─ safe-buffer@5.2.1
   │  └─ npmlog@4.1.2
   │     ├─ are-we-there-yet@1.1.5
   │     │  ├─ readable-stream@2.3.7
   │     │  └─ delegates@1.0.0
   │     ├─ console-control-strings@1.1.0
   │     ├─ set-blocking@2.0.0
   │     └─ gauge@2.7.4
   │        ├─ console-control-strings@1.1.0
   │        ├─ has-unicode@2.0.1
   │        ├─ object-assign@4.1.1
   │        ├─ string-width@1.0.2
   │        │  ├─ is-fullwidth-code-point@1.0.0
   │        │  │  └─ number-is-nan@1.0.1
   │        │  ├─ strip-ansi@3.0.1
   │        │  └─ code-point-at@1.1.0
   │        ├─ signal-exit@3.0.3
   │        ├─ strip-ansi@3.0.1
   │        ├─ wide-align@1.1.3
   │        │  └─ string-width@2.1.1
   │        │     ├─ strip-ansi@4.0.0
   │        │     │  └─ ansi-regex@3.0.0
   │        │     └─ is-fullwidth-code-point@2.0.0
   │        └─ aproba@1.2.0
   ├─ mocha@5.2.0
   │  ├─ browser-stdout@1.3.1
   │  ├─ escape-string-regexp@1.0.5
   │  ├─ commander@2.15.1
   │  ├─ diff@3.5.0
   │  ├─ growl@1.10.5
   │  ├─ minimatch@3.0.4
   │  ├─ debug@3.1.0
   │  │  └─ ms@2.0.0
   │  ├─ he@1.1.1
   │  ├─ glob@7.1.2
   │  │  ├─ fs.realpath@1.0.0
   │  │  ├─ inflight@1.0.6
   │  │  ├─ inherits@2.0.4
   │  │  ├─ minimatch@3.0.4
   │  │  ├─ once@1.4.0
   │  │  └─ path-is-absolute@1.0.1
   │  ├─ mkdirp@0.5.1
   │  │  └─ minimist@0.0.8
   │  └─ supports-color@5.4.0
   │     └─ has-flag@3.0.0
   └─ snyk@1.684.0
      ├─ @snyk/cloud-config-parser@1.10.2
      │  ├─ tslib@1.14.1
      │  ├─ esprima@4.0.1
      │  └─ yaml-js@0.3.0
      ├─ @snyk/cli-interface@2.11.0
      │  └─ @types/graphlib@2.1.8
      ├─ @open-policy-agent/opa-wasm@1.2.0
      │  ├─ sprintf-js@1.1.2
      │  └─ utf8@3.0.0
      ├─ @snyk/dep-graph@1.28.1
      │  ├─ event-loop-spinner@2.1.0
      │  │  └─ tslib@2.3.1
      │  ├─ lodash.clone@4.5.0
      │  ├─ lodash.constant@3.0.0
      │  ├─ lodash.isequal@4.5.0
      │  ├─ lodash.filter@4.6.0
      │  ├─ lodash.isfunction@3.0.9
      │  ├─ lodash.isempty@4.4.0
      │  ├─ lodash.foreach@4.5.0
      │  ├─ lodash.isundefined@3.0.1
      │  ├─ lodash.keys@4.2.0
      │  ├─ lodash.map@4.6.0
      │  ├─ lodash.values@4.3.0
      │  ├─ lodash.reduce@4.6.0
      │  ├─ lodash.transform@4.6.0
      │  ├─ lodash.union@4.6.0
      │  ├─ lodash.size@4.2.0
      │  ├─ tslib@1.14.1
      │  ├─ semver@7.3.5
      │  │  └─ lru-cache@6.0.0
      │  │     └─ yallist@4.0.0
      │  └─ object-hash@2.2.0
      ├─ @snyk/gemfile@1.2.0
      ├─ @snyk/graphlib@2.1.9-patch.3
      │  ├─ lodash.filter@4.6.0
      │  ├─ lodash.constant@3.0.0
      │  ├─ lodash.foreach@4.5.0
      │  ├─ lodash.clone@4.5.0
      │  ├─ lodash.isundefined@3.0.1
      │  ├─ lodash.map@4.6.0
      │  ├─ lodash.isempty@4.4.0
      │  ├─ lodash.reduce@4.6.0
      │  ├─ lodash.isfunction@3.0.9
      │  ├─ lodash.keys@4.2.0
      │  ├─ lodash.has@4.5.2
      │  ├─ lodash.size@4.2.0
      │  ├─ lodash.values@4.3.0
      │  ├─ lodash.transform@4.6.0
      │  └─ lodash.union@4.6.0
      ├─ @snyk/inquirer@7.3.3-patch
      │  ├─ ansi-escapes@4.3.2
      │  │  └─ type-fest@0.21.3
      │  ├─ cli-cursor@3.1.0
      │  │  └─ restore-cursor@3.1.0
      │  │     ├─ onetime@5.1.2
      │  │     │  └─ mimic-fn@2.1.0
      │  │     └─ signal-exit@3.0.3
      │  ├─ chalk@4.1.2
      │  │  ├─ supports-color@7.2.0
      │  │  │  └─ has-flag@4.0.0
      │  │  └─ ansi-styles@4.3.0
      │  │     └─ color-convert@2.0.1
      │  │        └─ color-name@1.1.4
      │  ├─ lodash.clone@4.5.0
      │  ├─ lodash.assign@4.2.0
      │  ├─ cli-width@3.0.0
      │  ├─ figures@3.2.0
      │  │  └─ escape-string-regexp@1.0.5
      │  ├─ lodash.assignin@4.2.0
      │  ├─ external-editor@3.1.0
      │  │  ├─ iconv-lite@0.4.24
      │  │  ├─ chardet@0.7.0
      │  │  └─ tmp@0.0.33
      │  ├─ lodash.filter@4.6.0
      │  ├─ lodash.find@4.6.0
      │  ├─ lodash.defaults@4.2.0
      │  ├─ lodash.findindex@4.6.0
      │  ├─ lodash.flatten@4.4.0
      │  ├─ lodash.isfunction@3.0.9
      │  ├─ lodash.isboolean@3.0.3
      │  ├─ lodash.isplainobject@4.0.6
      │  ├─ lodash.map@4.6.0
      │  ├─ lodash.last@3.0.0
      │  ├─ lodash.omit@4.5.0
      │  ├─ lodash.isstring@4.0.1
      │  ├─ lodash.isnumber@3.0.3
      │  ├─ lodash.set@4.3.2
      │  ├─ lodash.uniq@4.5.0
      │  ├─ mute-stream@0.0.8
      │  ├─ lodash.sum@4.0.2
      │  ├─ run-async@2.4.1
      │  ├─ strip-ansi@6.0.0
      │  │  └─ ansi-regex@5.0.0
      │  ├─ string-width@4.2.2
      │  │  ├─ emoji-regex@8.0.0
      │  │  ├─ strip-ansi@6.0.0
      │  │  └─ is-fullwidth-code-point@3.0.0
      │  ├─ through@2.3.8
      │  └─ rxjs@6.6.7
      │     └─ tslib@1.14.1
      ├─ @snyk/code-client@4.0.0
      │  ├─ @types/flat-cache@2.0.0
      │  ├─ @deepcode/dcignore@1.0.4
      │  ├─ @snyk/fast-glob@3.2.6-patch
      │  │  ├─ merge2@1.4.1
      │  │  ├─ micromatch@4.0.4
      │  │  │  ├─ braces@3.0.2
      │  │  │  └─ picomatch@2.3.0
      │  │  ├─ picomatch@2.3.0
      │  │  ├─ @nodelib/fs.walk@1.2.8
      │  │  │  ├─ fastq@1.12.0
      │  │  │  │  └─ reusify@1.0.4
      │  │  │  └─ @nodelib/fs.scandir@2.1.5
      │  │  │     ├─ run-parallel@1.2.0
      │  │  │     │  └─ queue-microtask@1.2.3
      │  │  │     └─ @nodelib/fs.stat@2.0.5
      │  │  ├─ @nodelib/fs.stat@2.0.5
      │  │  └─ @snyk/glob-parent@5.1.2-patch.1
      │  │     └─ is-glob@4.0.1
      │  ├─ @types/lodash.pick@4.4.6
      │  │  └─ @types/lodash@4.14.172
      │  ├─ @types/lodash.omit@4.5.6
      │  │  └─ @types/lodash@4.14.172
      │  ├─ @types/lodash.union@4.6.6
      │  │  └─ @types/lodash@4.14.172
      │  ├─ lodash.omit@4.5.0
      │  ├─ @types/sarif@2.1.4
      │  ├─ @types/uuid@8.3.1
      │  ├─ ignore@5.1.8
      │  ├─ lodash.chunk@4.2.0
      │  ├─ lodash.union@4.6.0
      │  ├─ lodash.pick@4.4.0
      │  ├─ @types/lodash.chunk@4.2.6
      │  │  └─ @types/lodash@4.14.172
      │  ├─ queue@6.0.2
      │  │  └─ inherits@2.0.4
      │  ├─ multimatch@5.0.0
      │  │  ├─ @types/minimatch@3.0.5
      │  │  ├─ array-union@2.1.0
      │  │  ├─ arrify@2.0.1
      │  │  ├─ minimatch@3.0.4
      │  │  └─ array-differ@3.0.0
      │  ├─ needle@2.8.0
      │  │  ├─ debug@3.2.7
      │  │  ├─ iconv-lite@0.4.24
      │  │  └─ sax@1.2.4
      │  └─ uuid@8.3.2
      ├─ ansi-escapes@3.2.0
      ├─ @snyk/snyk-hex-plugin@1.1.4
      │  ├─ @snyk/dep-graph@1.28.1
      │  ├─ debug@4.3.2
      │  ├─ tslib@2.3.1
      │  ├─ upath@2.0.1
      │  ├─ tmp@0.0.33
      │  │  └─ os-tmpdir@1.0.2
      │  └─ @snyk/mix-parser@1.3.2
      │     ├─ tslib@2.3.1
      │     └─ @snyk/dep-graph@1.28.1
      ├─ @snyk/fix@1.650.0
      │  ├─ chalk@4.1.1
      │  │  ├─ ansi-styles@4.3.0
      │  │  └─ supports-color@7.2.0
      │  ├─ @snyk/dep-graph@1.28.1
      │  ├─ lodash.groupby@4.6.0
      │  ├─ debug@4.3.2
      │  ├─ lodash.sortby@4.7.0
      │  ├─ @snyk/fix-poetry@0.7.2
      │  │  ├─ tslib@1.14.1
      │  │  ├─ bottleneck@2.19.5
      │  │  ├─ debug@4.3.1
      │  │  │  └─ ms@2.1.2
      │  │  └─ @snyk/child-process@0.3.1
      │  ├─ p-map@4.0.0
      │  │  └─ aggregate-error@3.1.0
      │  │     ├─ clean-stack@2.2.0
      │  │     └─ indent-string@4.0.0
      │  ├─ ora@5.4.0
      │  ├─ @snyk/fix-pipenv-pipfile@0.5.4
      │  │  ├─ bottleneck@2.19.5
      │  │  ├─ @snyk/child-process@0.3.1
      │  │  │  ├─ debug@4.3.2
      │  │  │  ├─ tslib@1.14.1
      │  │  │  └─ source-map-support@0.5.19
      │  │  ├─ tslib@1.14.1
      │  │  └─ debug@4.3.1
      │  ├─ strip-ansi@6.0.0
      │  └─ toml@3.0.0
      ├─ chalk@2.4.2
      │  ├─ ansi-styles@3.2.1
      │  │  └─ color-convert@1.9.3
      │  │     └─ color-name@1.1.3
      │  ├─ escape-string-regexp@1.0.5
      │  └─ supports-color@5.5.0
      │     └─ has-flag@3.0.0
      ├─ cli-spinner@0.2.10
      ├─ diff@4.0.2
      ├─ configstore@5.0.1
      │  ├─ dot-prop@5.3.0
      │  │  └─ is-obj@2.0.0
      │  ├─ graceful-fs@4.2.8
      │  ├─ make-dir@3.1.0
      │  │  └─ semver@6.3.0
      │  ├─ unique-string@2.0.0
      │  │  └─ crypto-random-string@2.0.0
      │  ├─ write-file-atomic@3.0.3
      │  │  ├─ signal-exit@3.0.3
      │  │  ├─ imurmurhash@0.1.4
      │  │  ├─ is-typedarray@1.0.0
      │  │  └─ typedarray-to-buffer@3.1.5
      │  │     └─ is-typedarray@1.0.0
      │  └─ xdg-basedir@4.0.0
      ├─ debug@4.3.2
      │  └─ ms@2.1.2
      ├─ @snyk/snyk-cocoapods-plugin@2.5.2
      │  ├─ source-map-support@0.5.19
      │  ├─ @snyk/cli-interface@2.11.2
      │  │  └─ @types/graphlib@2.1.8
      │  ├─ tslib@2.3.1
      │  ├─ @snyk/dep-graph@1.28.1
      │  └─ @snyk/cocoapods-lockfile-parser@3.6.2
      │     ├─ js-yaml@3.14.1
      │     ├─ @snyk/dep-graph@1.28.1
      │     ├─ @types/js-yaml@3.12.7
      │     └─ tslib@1.14.1
      ├─ lodash.flatten@4.4.0
      ├─ lodash.clonedeep@4.5.0
      ├─ lodash.assign@4.2.0
      ├─ glob@7.1.7
      ├─ lodash.camelcase@4.3.0
      ├─ global-agent@2.2.0
      │  ├─ es6-error@4.1.1
      │  ├─ matcher@3.0.0
      │  │  └─ escape-string-regexp@4.0.0
      │  ├─ boolean@3.1.3
      │  ├─ core-js@3.16.2
      │  ├─ serialize-error@7.0.1
      │  │  └─ type-fest@0.13.1
      │  ├─ semver@7.3.5
      │  └─ roarr@2.15.4
      │     ├─ boolean@3.1.3
      │     ├─ json-stringify-safe@5.0.1
      │     ├─ globalthis@1.0.2
      │     │  └─ define-properties@1.1.3
      │     ├─ detect-node@2.1.0
      │     ├─ semver-compare@1.0.0
      │     └─ sprintf-js@1.1.2
      ├─ lodash.map@4.6.0
      ├─ lodash.flattendeep@4.4.0
      ├─ lodash.get@4.4.2
      ├─ lodash.groupby@4.6.0
      ├─ lodash.isempty@4.4.0
      ├─ lodash.isobject@3.0.2
      ├─ abbrev@1.1.1
      ├─ lodash.merge@4.6.2
      ├─ lodash.orderby@4.6.0
      ├─ lodash.uniq@4.5.0
      ├─ lodash.omit@4.5.0
      ├─ lodash.sortby@4.7.0
      ├─ lodash.values@4.3.0
      ├─ lodash.upperfirst@4.3.1
      ├─ open@7.4.2
      │  ├─ is-docker@2.2.1
      │  └─ is-wsl@2.2.0
      │     └─ is-docker@2.2.1
      ├─ ora@5.4.0
      │  ├─ chalk@4.1.2
      │  ├─ cli-spinners@2.6.0
      │  ├─ is-interactive@1.0.0
      │  ├─ is-unicode-supported@0.1.0
      │  ├─ cli-cursor@3.1.0
      │  ├─ bl@4.1.0
      │  │  ├─ inherits@2.0.4
      │  │  ├─ readable-stream@3.6.0
      │  │  │  ├─ inherits@2.0.4
      │  │  │  ├─ string_decoder@1.3.0
      │  │  │  │  └─ safe-buffer@5.2.1
      │  │  │  └─ util-deprecate@1.0.2
      │  │  └─ buffer@5.7.1
      │  │     ├─ base64-js@1.5.1
      │  │     └─ ieee754@1.2.1
      │  ├─ log-symbols@4.1.0
      │  │  ├─ is-unicode-supported@0.1.0
      │  │  └─ chalk@4.1.2
      │  ├─ strip-ansi@6.0.0
      │  └─ wcwidth@1.0.1
      │     └─ defaults@1.0.3
      │        └─ clone@1.0.4
      ├─ os-name@3.1.0
      │  ├─ macos-release@2.5.0
      │  └─ windows-release@3.3.3
      │     └─ execa@1.0.0
      │        ├─ get-stream@4.1.0
      │        │  └─ pump@3.0.0
      │        │     ├─ end-of-stream@1.4.4
      │        │     └─ once@1.4.0
      │        ├─ cross-spawn@6.0.5
      │        │  ├─ path-key@2.0.1
      │        │  ├─ shebang-command@1.2.0
      │        │  │  └─ shebang-regex@1.0.0
      │        │  ├─ semver@5.7.1
      │        │  ├─ nice-try@1.0.5
      │        │  └─ which@1.3.1
      │        │     └─ isexe@2.0.0
      │        ├─ is-stream@1.1.0
      │        ├─ signal-exit@3.0.3
      │        ├─ npm-run-path@2.0.2
      │        │  └─ path-key@2.0.1
      │        ├─ p-finally@1.0.0
      │        └─ strip-eof@1.0.0
      ├─ needle@2.6.0
      │  ├─ debug@3.2.7
      │  │  └─ ms@2.1.3
      │  ├─ iconv-lite@0.4.24
      │  │  └─ safer-buffer@2.1.2
      │  └─ sax@1.2.4
      ├─ micromatch@4.0.2
      │  ├─ picomatch@2.3.0
      │  └─ braces@3.0.2
      │     └─ fill-range@7.0.1
      │        └─ to-regex-range@5.0.1
      │           └─ is-number@7.0.0
      ├─ pegjs@0.10.0
      ├─ snyk-cpp-plugin@2.2.1
      │  ├─ chalk@4.1.2
      │  ├─ @snyk/dep-graph@1.28.1
      │  ├─ hosted-git-info@3.0.8
      │  │  └─ lru-cache@6.0.0
      │  ├─ debug@4.3.2
      │  └─ tslib@2.3.1
      ├─ snyk-config@4.0.0
      │  ├─ debug@4.3.2
      │  ├─ async@3.2.1
      │  ├─ lodash.merge@4.6.2
      │  └─ minimist@1.2.5
      ├─ proxy-from-env@1.1.0
      ├─ promise-queue@2.2.5
      ├─ semver@6.3.0
      ├─ snyk-module@3.1.0
      │  ├─ hosted-git-info@3.0.8
      │  └─ debug@4.3.2
      ├─ snyk-docker-plugin@4.23.0
      │  ├─ @snyk/dep-graph@1.28.1
      │  ├─ chalk@2.4.2
      │  ├─ docker-modem@2.1.3
      │  │  ├─ readable-stream@3.6.0
      │  │  ├─ split-ca@1.0.1
      │  │  ├─ debug@4.3.2
      │  │  └─ ssh2@0.8.9
      │  │     └─ ssh2-streams@0.4.10
      │  │        ├─ asn1@0.2.4
      │  │        ├─ bcrypt-pbkdf@1.0.2
      │  │        └─ streamsearch@0.1.2
      │  ├─ @snyk/rpm-parser@2.2.1
      │  │  └─ event-loop-spinner@2.1.0
      │  ├─ @snyk/snyk-docker-pull@3.7.0
      │  │  ├─ child-process@1.0.2
      │  │  ├─ tar-stream@2.2.0
      │  │  ├─ @snyk/docker-registry-v2-client@2.3.0
      │  │  │  ├─ needle@2.8.0
      │  │  │  ├─ parse-link-header@1.0.1
      │  │  │  │  └─ xtend@4.0.2
      │  │  │  └─ tslib@1.14.1
      │  │  └─ tmp@0.2.1
      │  ├─ debug@4.3.2
      │  ├─ event-loop-spinner@2.1.0
      │  ├─ mkdirp@1.0.4
      │  ├─ elfy@1.0.0
      │  │  └─ endian-reader@0.3.0
      │  ├─ gunzip-maybe@1.4.2
      │  │  ├─ is-deflate@1.0.0
      │  │  ├─ browserify-zlib@0.1.4
      │  │  │  └─ pako@0.2.9
      │  │  ├─ peek-stream@1.1.3
      │  │  │  ├─ buffer-from@1.1.2
      │  │  │  ├─ duplexify@3.7.1
      │  │  │  │  ├─ inherits@2.0.4
      │  │  │  │  ├─ stream-shift@1.0.1
      │  │  │  │  ├─ readable-stream@2.3.7
      │  │  │  │  └─ end-of-stream@1.4.4
      │  │  │  └─ through2@2.0.5
      │  │  ├─ is-gzip@1.0.0
      │  │  ├─ pumpify@1.5.1
      │  │  │  ├─ duplexify@3.7.1
      │  │  │  ├─ inherits@2.0.4
      │  │  │  └─ pump@2.0.1
      │  │  │     ├─ end-of-stream@1.4.4
      │  │  │     └─ once@1.4.0
      │  │  └─ through2@2.0.5
      │  │     ├─ readable-stream@2.3.7
      │  │     └─ xtend@4.0.2
      │  ├─ tmp@0.2.1
      │  │  └─ rimraf@3.0.2
      │  │     └─ glob@7.1.7
      │  ├─ dockerfile-ast@0.2.1
      │  │  └─ vscode-languageserver-types@3.16.0
      │  ├─ snyk-nodejs-lockfile-parser@1.36.0
      │  │  ├─ js-yaml@4.1.0
      │  │  ├─ @snyk/graphlib@2.1.9-patch.3
      │  │  ├─ @snyk/dep-graph@1.28.1
      │  │  ├─ @yarnpkg/lockfile@1.1.0
      │  │  ├─ @yarnpkg/core@2.4.0
      │  │  ├─ lodash.isempty@4.4.0
      │  │  ├─ lodash.flatmap@4.5.0
      │  │  ├─ lodash.set@4.3.2
      │  │  ├─ lodash.topairs@4.3.0
      │  │  ├─ semver@7.3.5
      │  │  ├─ tslib@1.14.1
      │  │  ├─ snyk-config@4.0.0
      │  │  ├─ event-loop-spinner@2.1.0
      │  │  ├─ uuid@8.3.2
      │  │  └─ lodash.clonedeep@4.5.0
      │  ├─ tar-stream@2.2.0
      │  │  ├─ bl@4.1.0
      │  │  ├─ end-of-stream@1.4.4
      │  │  │  └─ once@1.4.0
      │  │  ├─ fs-constants@1.0.0
      │  │  ├─ inherits@2.0.4
      │  │  └─ readable-stream@3.6.0
      │  ├─ tslib@1.14.1
      │  ├─ uuid@8.3.2
      │  └─ semver@7.3.5
      ├─ snyk-mvn-plugin@2.26.2
      │  ├─ @snyk/cli-interface@2.11.0
      │  ├─ @snyk/dep-graph@1.28.1
      │  ├─ glob@7.1.7
      │  ├─ debug@4.3.2
      │  ├─ @snyk/java-call-graph-builder@1.23.1
      │  │  ├─ jszip@3.7.1
      │  │  │  ├─ pako@1.0.11
      │  │  │  ├─ lie@3.3.0
      │  │  │  ├─ set-immediate-shim@1.0.1
      │  │  │  └─ readable-stream@2.3.7
      │  │  ├─ ci-info@2.0.0
      │  │  ├─ @snyk/graphlib@2.1.9-patch.3
      │  │  ├─ glob@7.1.7
      │  │  ├─ debug@4.3.2
      │  │  ├─ temp-dir@2.0.0
      │  │  ├─ snyk-config@4.0.0
      │  │  ├─ tmp@0.2.1
      │  │  ├─ progress@2.0.3
      │  │  ├─ source-map-support@0.5.19
      │  │  ├─ needle@2.8.0
      │  │  ├─ tslib@1.14.1
      │  │  └─ xml-js@1.6.11
      │  │     └─ sax@1.2.4
      │  ├─ needle@2.8.0
      │  ├─ tslib@1.11.1
      │  └─ tmp@0.1.0
      │     └─ rimraf@2.7.1
      ├─ snyk-nodejs-lockfile-parser@1.35.0
      │  ├─ event-loop-spinner@2.1.0
      │  ├─ js-yaml@4.1.0
      │  │  └─ argparse@2.0.1
      │  ├─ lodash.clonedeep@4.5.0
      │  ├─ lodash.flatmap@4.5.0
      │  ├─ @snyk/graphlib@2.1.9-patch.3
      │  ├─ lodash.isempty@4.4.0
      │  ├─ @yarnpkg/core@2.4.0
      │  │  ├─ @types/semver@7.3.8
      │  │  ├─ @types/treeify@1.0.0
      │  │  ├─ @arcanis/slice-ansi@1.0.2
      │  │  │  └─ grapheme-splitter@1.0.4
      │  │  ├─ @yarnpkg/fslib@2.5.1
      │  │  │  ├─ @yarnpkg/libzip@2.2.2
      │  │  │  └─ tslib@1.14.1
      │  │  ├─ binjumper@0.1.4
      │  │  ├─ camelcase@5.3.1
      │  │  ├─ chalk@3.0.0
      │  │  ├─ @yarnpkg/libzip@2.2.2
      │  │  │  ├─ tslib@1.14.1
      │  │  │  └─ @types/emscripten@1.39.5
      │  │  ├─ @yarnpkg/parsers@2.4.0
      │  │  │  ├─ js-yaml@3.14.1
      │  │  │  └─ tslib@1.14.1
      │  │  ├─ ci-info@2.0.0
      │  │  ├─ @yarnpkg/pnp@2.3.2
      │  │  │  ├─ tslib@1.14.1
      │  │  │  ├─ @yarnpkg/fslib@2.5.1
      │  │  │  └─ @types/node@13.13.52
      │  │  ├─ @yarnpkg/shell@2.4.1
      │  │  │  ├─ @yarnpkg/fslib@2.5.1
      │  │  │  ├─ @yarnpkg/parsers@2.4.0
      │  │  │  ├─ clipanion@2.6.2
      │  │  │  ├─ cross-spawn@7.0.3
      │  │  │  ├─ micromatch@4.0.4
      │  │  │  ├─ fast-glob@3.2.7
      │  │  │  │  ├─ @nodelib/fs.stat@2.0.5
      │  │  │  │  ├─ merge2@1.4.1
      │  │  │  │  ├─ micromatch@4.0.4
      │  │  │  │  ├─ @nodelib/fs.walk@1.2.8
      │  │  │  │  └─ glob-parent@5.1.2
      │  │  │  │     └─ is-glob@4.0.1
      │  │  │  ├─ stream-buffers@3.0.2
      │  │  │  └─ tslib@1.14.1
      │  │  ├─ clipanion@2.6.2
      │  │  ├─ diff@4.0.2
      │  │  ├─ cross-spawn@7.0.3
      │  │  │  ├─ path-key@3.1.1
      │  │  │  ├─ shebang-command@2.0.0
      │  │  │  │  └─ shebang-regex@3.0.0
      │  │  │  └─ which@2.0.2
      │  │  │     └─ isexe@2.0.0
      │  │  ├─ lodash@4.17.21
      │  │  ├─ json-file-plus@3.3.1
      │  │  │  ├─ is@3.3.0
      │  │  │  ├─ safer-buffer@2.1.2
      │  │  │  ├─ promiseback@2.0.3
      │  │  │  │  ├─ is-callable@1.2.4
      │  │  │  │  └─ promise-deferred@2.0.3
      │  │  │  │     └─ promise@7.3.1
      │  │  │  ├─ object.assign@4.1.2
      │  │  │  └─ node.extend@2.0.2
      │  │  │     ├─ has@1.0.3
      │  │  │     └─ is@3.3.0
      │  │  ├─ micromatch@4.0.4
      │  │  ├─ mkdirp@0.5.5
      │  │  ├─ globby@11.0.4
      │  │  │  ├─ array-union@2.1.0
      │  │  │  ├─ dir-glob@3.0.1
      │  │  │  │  └─ path-type@4.0.0
      │  │  │  ├─ slash@3.0.0
      │  │  │  ├─ merge2@1.4.1
      │  │  │  ├─ ignore@5.1.8
      │  │  │  └─ fast-glob@3.2.7
      │  │  ├─ got@11.8.2
      │  │  ├─ pretty-bytes@5.6.0
      │  │  ├─ stream-to-promise@2.2.0
      │  │  │  ├─ any-promise@1.3.0
      │  │  │  ├─ end-of-stream@1.1.0
      │  │  │  │  └─ once@1.3.3
      │  │  │  │     └─ wrappy@1.0.2
      │  │  │  └─ stream-to-array@2.3.0
      │  │  │     └─ any-promise@1.3.0
      │  │  ├─ treeify@1.1.0
      │  │  ├─ semver@7.3.5
      │  │  ├─ tar-stream@2.2.0
      │  │  ├─ @yarnpkg/json-proxy@2.1.1
      │  │  │  ├─ tslib@1.14.1
      │  │  │  └─ @yarnpkg/fslib@2.5.1
      │  │  ├─ tunnel@0.0.6
      │  │  ├─ tslib@1.14.1
      │  │  ├─ p-limit@2.3.0
      │  │  │  └─ p-try@2.2.0
      │  │  └─ pluralize@7.0.0
      │  ├─ got@11.8.2
      │  │  ├─ @types/cacheable-request@6.0.2
      │  │  │  ├─ @types/http-cache-semantics@4.0.1
      │  │  │  ├─ @types/keyv@3.1.2
      │  │  │  │  └─ @types/node@16.7.0
      │  │  │  ├─ @types/responselike@1.0.0
      │  │  │  └─ @types/node@16.7.0
      │  │  ├─ @types/responselike@1.0.0
      │  │  │  └─ @types/node@16.7.0
      │  │  ├─ cacheable-lookup@5.0.4
      │  │  ├─ cacheable-request@7.0.2
      │  │  │  ├─ get-stream@5.2.0
      │  │  │  │  └─ pump@3.0.0
      │  │  │  ├─ lowercase-keys@2.0.0
      │  │  │  ├─ http-cache-semantics@4.1.0
      │  │  │  ├─ keyv@4.0.3
      │  │  │  │  └─ json-buffer@3.0.1
      │  │  │  ├─ responselike@2.0.0
      │  │  │  ├─ normalize-url@6.1.0
      │  │  │  └─ clone-response@1.0.2
      │  │  │     └─ mimic-response@1.0.1
      │  │  ├─ @sindresorhus/is@4.0.1
      │  │  ├─ lowercase-keys@2.0.0
      │  │  ├─ decompress-response@6.0.0
      │  │  │  └─ mimic-response@3.1.0
      │  │  ├─ http2-wrapper@1.0.3
      │  │  │  ├─ quick-lru@5.1.1
      │  │  │  └─ resolve-alpn@1.2.0
      │  │  ├─ @szmarczak/http-timer@4.0.6
      │  │  │  └─ defer-to-connect@2.0.1
      │  │  ├─ p-cancelable@2.1.1
      │  │  └─ responselike@2.0.0
      │  │     └─ lowercase-keys@2.0.0
      │  ├─ lodash.set@4.3.2
      │  ├─ p-map@2.1.0
      │  ├─ snyk-config@4.0.0
      │  ├─ uuid@8.3.2
      │  ├─ tslib@1.14.1
      │  ├─ lodash.topairs@4.3.0
      │  └─ @yarnpkg/lockfile@1.1.0
      ├─ snyk-go-plugin@1.17.0
      │  ├─ @snyk/dep-graph@1.28.1
      │  ├─ tmp@0.2.1
      │  ├─ tslib@1.14.1
      │  ├─ debug@4.3.2
      │  ├─ snyk-go-parser@1.4.1
      │  │  ├─ tslib@1.14.1
      │  │  └─ toml@3.0.0
      │  └─ @snyk/graphlib@2.1.9-patch.3
      ├─ snyk-gradle-plugin@3.16.1
      │  ├─ @snyk/cli-interface@2.11.0
      │  ├─ chalk@3.0.0
      │  │  ├─ supports-color@7.2.0
      │  │  └─ ansi-styles@4.3.0
      │  ├─ tmp@0.2.1
      │  ├─ @snyk/dep-graph@1.28.1
      │  ├─ @types/debug@4.1.7
      │  │  └─ @types/ms@0.7.31
      │  ├─ debug@4.3.2
      │  ├─ @snyk/java-call-graph-builder@1.23.1
      │  └─ tslib@2.3.1
      ├─ snyk-nuget-plugin@1.22.1
      │  ├─ debug@4.3.2
      │  ├─ tslib@1.14.1
      │  ├─ snyk-paket-parser@1.6.0
      │  │  └─ tslib@1.14.1
      │  ├─ jszip@3.7.0
      │  │  ├─ lie@3.3.0
      │  │  │  └─ immediate@3.0.6
      │  │  ├─ pako@1.0.11
      │  │  ├─ set-immediate-shim@1.0.1
      │  │  └─ readable-stream@2.3.7
      │  ├─ dotnet-deps-parser@5.1.0
      │  │  ├─ lodash.set@4.3.2
      │  │  ├─ lodash.isempty@4.4.0
      │  │  ├─ source-map-support@0.5.19
      │  │  ├─ tslib@1.14.1
      │  │  ├─ xml2js@0.4.23
      │  │  └─ lodash.uniq@4.5.0
      │  └─ xml2js@0.4.23
      │     ├─ sax@1.2.4
      │     └─ xmlbuilder@11.0.1
      ├─ snyk-php-plugin@1.9.2
      │  ├─ @snyk/cli-interface@2.11.2
      │  ├─ tslib@1.11.1
      │  └─ @snyk/composer-lockfile-parser@1.4.1
      │     ├─ lodash.get@4.4.2
      │     ├─ lodash.findkey@4.6.0
      │     ├─ lodash.isempty@4.4.0
      │     └─ lodash.invert@4.3.0
      ├─ rimraf@2.7.1
      │  └─ glob@7.1.7
      ├─ snyk-policy@1.22.0
      │  ├─ lodash.clonedeep@4.5.0
      │  ├─ js-yaml@3.14.1
      │  │  ├─ esprima@4.0.1
      │  │  └─ argparse@1.0.10
      │  ├─ email-validator@2.0.4
      │  ├─ promise-fs@2.1.1
      │  │  └─ @octetstream/promisify@2.0.2
      │  ├─ debug@4.3.2
      │  ├─ snyk-try-require@2.0.2
      │  │  ├─ lodash.clonedeep@4.5.0
      │  │  ├─ debug@4.3.2
      │  │  └─ lru-cache@5.1.1
      │  │     └─ yallist@3.1.1
      │  ├─ snyk-module@3.2.0
      │  │  ├─ debug@4.3.2
      │  │  └─ hosted-git-info@4.0.2
      │  │     └─ lru-cache@6.0.0
      │  ├─ snyk-resolve@1.1.0
      │  └─ semver@7.3.5
      ├─ source-map-support@0.5.19
      │  ├─ buffer-from@1.1.2
      │  └─ source-map@0.6.1
      ├─ strip-ansi@5.2.0
      │  └─ ansi-regex@4.1.0
      ├─ snyk-python-plugin@1.20.1
      │  ├─ @snyk/cli-interface@2.11.2
      │  ├─ tmp@0.2.1
      │  └─ snyk-poetry-lockfile-parser@1.1.7
      │     ├─ tslib@2.3.1
      │     ├─ @snyk/cli-interface@2.11.2
      │     ├─ @iarna/toml@2.2.5
      │     ├─ debug@4.3.2
      │     └─ @snyk/dep-graph@1.28.1
      ├─ snyk-try-require@1.3.1
      │  ├─ lodash.clonedeep@4.5.0
      │  ├─ debug@3.2.7
      │  ├─ then-fs@2.0.0
      │  │  └─ promise@7.3.1
      │  │     └─ asap@2.0.6
      │  └─ lru-cache@4.1.5
      │     ├─ yallist@2.1.2
      │     └─ pseudomap@1.0.2
      ├─ snyk-resolve-deps@4.7.2
      │  ├─ ansicolors@0.3.2
      │  ├─ lodash.assign@4.2.0
      │  ├─ lodash.assignin@4.2.0
      │  ├─ debug@4.3.2
      │  ├─ lodash.set@4.3.2
      │  ├─ lodash.clone@4.5.0
      │  ├─ lodash.flatten@4.4.0
      │  ├─ lodash.get@4.4.2
      │  ├─ lru-cache@4.1.5
      │  ├─ semver@5.7.1
      │  ├─ snyk-resolve@1.1.0
      │  ├─ snyk-module@3.2.0
      │  ├─ then-fs@2.0.0
      │  ├─ snyk-tree@1.0.0
      │  │  └─ archy@1.0.0
      │  └─ snyk-try-require@1.3.1
      ├─ snyk-sbt-plugin@2.11.3
      │  ├─ semver@6.3.0
      │  ├─ tree-kill@1.2.2
      │  ├─ debug@4.3.2
      │  ├─ tslib@1.14.1
      │  └─ tmp@0.1.0
      ├─ tar@6.1.10
      │  ├─ fs-minipass@2.1.0
      │  │  └─ minipass@3.1.3
      │  ├─ chownr@2.0.0
      │  ├─ mkdirp@1.0.4
      │  ├─ yallist@4.0.0
      │  ├─ minipass@3.1.3
      │  │  └─ yallist@4.0.0
      │  └─ minizlib@2.1.2
      │     ├─ yallist@4.0.0
      │     └─ minipass@3.1.3
      ├─ wrap-ansi@5.1.0
      │  ├─ ansi-styles@3.2.1
      │  ├─ string-width@3.1.0
      │  │  ├─ emoji-regex@7.0.3
      │  │  ├─ strip-ansi@5.2.0
      │  │  └─ is-fullwidth-code-point@2.0.0
      │  └─ strip-ansi@5.2.0
      ├─ tempy@1.0.1
      │  ├─ temp-dir@2.0.0
      │  ├─ is-stream@2.0.1
      │  ├─ unique-string@2.0.0
      │  ├─ type-fest@0.16.0
      │  └─ del@6.0.0
      │     ├─ graceful-fs@4.2.8
      │     ├─ is-path-cwd@2.2.0
      │     ├─ is-path-inside@3.0.3
      │     ├─ p-map@4.0.0
      │     ├─ globby@11.0.4
      │     ├─ slash@3.0.0
      │     ├─ is-glob@4.0.1
      │     │  └─ is-extglob@2.1.1
      │     └─ rimraf@3.0.2
      ├─ uuid@8.3.2
      ├─ yaml@1.10.2
      └─ snyk-resolve@1.1.0
         ├─ debug@4.3.2
         └─ promise-fs@2.1.1
```
</details>

This led to this:

```
error boolean@3.1.3: The engine "node" is incompatible with this module. Expected version ">= 16.7.0". Got "14.17.1"
error Found incompatible module.
```

The problematic package which uses the caret is in this case [global-agent](https://github.com/gajus/global-agent/blob/a3c390e285627de5265e1523b08e54ce5c617c14/package.json):

```
"boolean": "^3.1.2"
```

[An issue](https://github.com/thenativeweb/boolean/issues/317) raised in the `boolean` package has quickly got attentation within hours,
because several builds for several projects started to fail.

In our case, the workaround using `--ignore-engines` solved the problem.

Another workaround would be to use `resolutions`
(for [npm](https://www.npmjs.com/package/npm-force-resolutions) and [yarn](https://classic.yarnpkg.com/en/docs/selective-version-resolutions/)).
However, I don't know a way to use them with globally installed packages.

# npm shrinkwrap as a solution?

[https://docs.npmjs.com/cli/v7/configuring-npm/package-lock-json#package-lockjson-vs-npm-shrinkwrapjson](https://docs.npmjs.com/cli/v7/configuring-npm/package-lock-json#package-lockjson-vs-npm-shrinkwrapjson)

I don't think the shrinkwrap file is a solution, because npm doesn't recommend it for libraries, but only CLI tools.

To be honest, I find the whole `package-lock.json` and `npm-shrinkwrap.json` topic pretty complicated and
I wonder if most devs know all the details here.

For me it's just a huge workaround for fixing a problem in the wrong place.
I have some hope there **is** a reasoning behind this and I will understand it at some day in the future.
Let's see.

# How other build tools handle this

## Maven

For Maven, I know [version ranges](https://maven.apache.org/enforcer/enforcer-rules/versionRanges.html) exist, but they are barely used
on the projects I have worked on.

See also [https://www.baeldung.com/maven-dependency-latest-version](https://www.baeldung.com/maven-dependency-latest-version) here.

## Gradle

Gradle supports the Maven syntax and [some more](https://docs.gradle.org/current/userguide/single_versions.html).

# Now what?

For me, it is just plain stupid to have automatically updated versions of your dependencies.
Developers should update them manually on a regular basis and make sure
the newer versions don't break the software (ideally their tests tell them).

Having reproducible builds is so powerful and I just can't understand why you would give it
up just for the *little* convenience of not having to update your dependencies that often.
I don't even understand why the build tools support this kind of stuff.

In case of the boolean package, the issue has been fixed very quickly (within hours),
but nobody guarantees you people react this fast.
And if they do not, you need to find ugly workarounds to set the version to your desired fixed value,
while your whole team might be **blocked** in the CI. :(

---

# Update: Magento 2.4.1 -> 2.4.2

Another sad example of what people do in patch updates.

In the version change in the patch level Magento did this:

- Support for Composer 2: [Magento 2.4.2 introduced support for Composer 2](https://devdocs.magento.com/guides/v2.4/comp-mgr/cli/cli-upgrade.html) (see also [here](https://github.com/magento/community-features/issues/302))
- File system changes: [From Magento 2.4.2, Magento modified docroot to improve security](https://www.rohanhapani.com/solved-404-not-found-after-fresh-magento-2-4-2-installation/), [frontend and admin not working magento 2.4.2 upgrade](https://magento.stackexchange.com/questions/332400/frontend-and-admin-not-working-magento-2-4-2-upgrade/), [404 Not Found after fresh Magento 2.4.2 installation](https://magento.stackexchange.com/questions/331840/404-not-found-after-fresh-magento-2-4-2-installation)

According to their [versioning schema](https://devdocs.magento.com/guides/v2.4/extension-dev-guide/versioning/),
*The PATCH version increments when backward-compatible bug fixes occur.*.

# Update: vue2-daterange-picker 0.6.3 -> 0.6.8

Another example: The daterange picker in an application was unintentionally updated.
I haven't checked the exact details, but some css changes broke the layout in the browser.
