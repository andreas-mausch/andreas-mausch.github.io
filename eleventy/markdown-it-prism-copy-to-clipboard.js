export default function (md, _options = {}) {
  const originalFence = md.renderer.rules.fence || function (tokens, idx, options, env, self) {
    return self.renderToken(tokens, idx, options)
  }

  md.renderer.rules.fence = function (tokens, idx, options, env, self) {
    const previousHtml = originalFence(tokens, idx, options, env, self)
    return `<div class="code-block">
    <button type="button" class="copy-to-clipboard">
      <i class="icon icon-copy"></i>
    </button>
    ${previousHtml}
    </div>`
  }
}
