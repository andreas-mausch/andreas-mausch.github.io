export default function (md, _options = {}) {
  const originalFence = md.renderer.rules.fence || function (tokens, idx, options, env, self) {
    return self.renderToken(tokens, idx, options)
  }
  const originalHighlight = md.options.highlight

  md.renderer.rules.fence = function (tokens, idx, options, env, self) {
    const previousHtml = originalFence(tokens, idx, options, env, self)
    return previousHtml.replace(/(<code.*?)(data-linenumber-start="(\d+)")(.*?>)/,
      (_match, g1, _g2, g3, g4) => `${g1}style="counter-set: lineNumber ${g3 - 1};"${g4}`)
  }

  md.options.highlight = function (text, lang) {
    const html = originalHighlight(text, lang)
    // Similar to: https://github.com/11ty/eleventy-plugin-syntaxhighlight/blob/7b7b547fff07f2e60d91c0a7ed3bba1938dbc057/src/markdownSyntaxHighlightOptions.js#L28
    const lines = html.split("\n").slice(0, -1)

    return lines
      .map(line => `<span class="highlight-line">${line}</span>`)
      .join("\n")
  }
}
