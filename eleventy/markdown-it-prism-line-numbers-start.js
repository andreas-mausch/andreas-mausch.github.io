export default originalFence => (tokens, idx, options, env, self) => {
  const previousHtml = originalFence(tokens, idx, options, env, self)
  return previousHtml.replace(/(<code.*?)(data-linenumber-start="(\d+)")(.*?>)/,
    (_match, g1, _g2, g3, g4) => `${g1}style="counter-set: lineNumber ${g3 - 1};"${g4}`)
}
