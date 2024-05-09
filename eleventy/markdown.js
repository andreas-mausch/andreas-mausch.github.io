const markdownIt = require("markdown-it")
const anchor = require("markdown-it-anchor")
const attribution = require("markdown-it-attribution")
const attrs = require("markdown-it-attrs")
const externalLinks = require("markdown-it-external-links")
const footnote = require("markdown-it-footnote")
const prism = require("markdown-it-prism")
const taskCheckbox = require("markdown-it-task-checkbox")
const lineNumbers = require("./markdown-it-prism-line-numbers")
const hierarchy = require("./markdown-it-hierarchy")
const copyToClipboard = require("./markdown-it-prism-copy-to-clipboard")
const plantUml = require("markdown-it-plantuml-ex2")

const markdown = markdownIt({
  html: true
}).use(hierarchy)
  .use(attribution, {
    classNameContainer: "quote",
    classNameAttribution: "quote-attribution",
    marker: "--",
    removeMarker: true
  })
  .use(attrs)
  .use(externalLinks, {
    externalTarget: "_blank"
  })
  .use(footnote)
  .use(anchor, {
    permalink: anchor.permalink.ariaHidden({
      symbol: "<svg viewBox=\"0 0 16 16\" version=\"1.1\" width=\"16\" height=\"16\" aria-hidden=\"true\"><path fill-rule=\"evenodd\" d=\"M7.775 3.275a.75.75 0 001.06 1.06l1.25-1.25a2 2 0 112.83 2.83l-2.5 2.5a2 2 0 01-2.83 0 .75.75 0 00-1.06 1.06 3.5 3.5 0 004.95 0l2.5-2.5a3.5 3.5 0 00-4.95-4.95l-1.25 1.25zm-4.69 9.64a2 2 0 010-2.83l2.5-2.5a2 2 0 012.83 0 .75.75 0 001.06-1.06 3.5 3.5 0 00-4.95 0l-2.5 2.5a3.5 3.5 0 004.95 4.95l1.25-1.25a.75.75 0 00-1.06-1.06l-1.25 1.25a2 2 0 01-2.83 0z\"></path></svg>",
      placement: "after"
    })
  })
  .use(prism, {
    defaultLanguage: "plain",
    highlightInlineCode: true
  })
  .use(taskCheckbox)
  .use(plantUml)

markdown.options.highlight = lineNumbers(markdown.options.highlight)
markdown.renderer.rules.fence = copyToClipboard(markdown.renderer.rules.fence)

module.exports = markdown
