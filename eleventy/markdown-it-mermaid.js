import { execSync } from "child_process"

function renderSync(code) {
  /*
    This is a bad hack. But it was the best solution I could find:
    - https://github.com/markslides/markdown-it-mermaid
      doesn't work well:
      it uses it's own renderAll() async method which is called manually at other places
    - using an own markdown-it plugin is problematic, because it requires a sync
      function to fill the content, but mermaid only offers an async render() function.
      https://github.com/mermaid-js/mermaid/issues/4741
      https://github.com/markdown-it/markdown-it/blob/master/docs/development.md#i-need-async-rule-how-to-do-it
      using deasync deadlocks.

    So creating a sub-process here is very heavy, but works reliable at least.
  */

  return execSync("npx mmdc --puppeteerConfigFile=./mermaid-puppeteer-config.json --outputFormat=svg --input=- --output=-", {
    input: code
  })
}

export default function markdownItMermaid(md, _options = {}) {
  const originalFence = md.renderer.rules.fence || function (tokens, idx, options, env, self) {
    return self.renderToken(tokens, idx, options)
  }

  md.renderer.rules.fence = function (tokens, idx, options, env, self) {
    const token = tokens[idx]
    const info = token.info.trim()

    if (info === "mermaid") {
      const processed = renderSync(token.content)
      return `<div class="mermaid-rendered-svg">${processed}</div>`
    }

    return originalFence(tokens, idx, options, env, self)
  }
}
