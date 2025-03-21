import markdownIt from "markdown-it"
import anchor from "markdown-it-anchor"
import attribution from "markdown-it-attribution"
import attrs from "markdown-it-attrs"
import externalLinks from "markdown-it-external-links"
import footnote from "markdown-it-footnote"
import plantUml from "markdown-it-plantuml-ex2"
import prism from "markdown-it-prism"
import taskCheckbox from "markdown-it-task-checkbox"

import lineNumbers from "./markdown-it-prism-line-numbers.js"
import lineNumbersStart from "./markdown-it-prism-line-numbers-start.js"
import hierarchy from "./markdown-it-hierarchy.js"
import copyToClipboard from "./markdown-it-prism-copy-to-clipboard.js"
import hexView from "./markdown-it-hexview.js"

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
  .use(plantUml, { plantumlPath: "plantuml.jar" })
  .use(hexView)

markdown.options.highlight = lineNumbers(markdown.options.highlight)
markdown.renderer.rules.fence = copyToClipboard(lineNumbersStart(markdown.renderer.rules.fence))

export default markdown
