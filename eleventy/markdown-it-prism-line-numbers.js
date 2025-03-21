export default originalHighlight => (text, lang) => {
  const html = originalHighlight(text, lang)
  // Similar to: https://github.com/11ty/eleventy-plugin-syntaxhighlight/blob/7b7b547fff07f2e60d91c0a7ed3bba1938dbc057/src/markdownSyntaxHighlightOptions.js#L28
  const lines = html.split("\n").slice(0, -1)

  return lines
    .map(line => `<span class="highlight-line">${line}</span>`)
    .join("\n")
}
