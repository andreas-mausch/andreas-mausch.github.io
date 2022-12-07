module.exports = originalFence => {
  return (tokens, idx, options, env, self) => {
    const previousHtml = originalFence(tokens, idx, options, env, self)
    return `<div class="code-block">
    <button type="button" class="copy-to-clipboard">
      <i class="icon icon-copy"></i>
    </button>
    ${previousHtml}
    </div>`
  }
}
