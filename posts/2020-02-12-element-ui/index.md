---
title: Eat my time, element-ui
date: 2020-02-12T19:00:00+01:00
tags: ['software-development', 'frontend', 'element-ui', 'npm', 'popper.js', 'copied-dependency']
thumbnail: stale.png
---

I'm currently on a project to build a micro-frontend. Cool!

In general.

Technology stack is Vue.js, element-ui, export as web components, GraphQL API.

So today we found that dropdowns (el-select) won't work properly due to a bug.
The dropdown popup (implemented using popper.js) is positioned incorrectly and we see erros in the browser console.

:(

After some investigation we found **[this!][urgs]**

Right, somebody decided it's a good idea to just c/p the source of popper.js into the element-ui repo,
instead of just making it a dependency (like any good citizen would).

No chance to overwrite the version in the package-lock.json because of this inlined dependency.

Element has nearly 44k stars on github btw. How.

Now the last time this "dependency" has been updated is almost exactly two years ago: Feb 2018.

Back then popper.js had issues dealing with shadow dom correctly. These have been fixed long ago.
But not in element-ui.

Four days ago, somebody else apparently [noticed it][element-extract-dependency].

Some more links:

- [stackoverflow.com]
- [Popper: update vue-popper][element-update-popper.js]
- [popper.js: Support for ShadowDOM][popper.js-bugfix]

{% image "stale.png" %}

[urgs]: https://github.com/ElemeFE/element/blob/8ab1db83c537bf0b0d63bb6397ad3440811e892e/src/utils/popper.js
[stackoverflow.com]: https://stackoverflow.com/questions/54352781/how-to-fix-element-and-popper-js-errors-in-vuejs-web-components-with-a-shadowroo
[element-extract-dependency]: https://github.com/ElemeFE/element/pull/18792
[element-update-popper.js]: https://github.com/ElemeFE/element/pull/11778
[popper.js-bugfix]: https://github.com/popperjs/popper-core/issues/686
