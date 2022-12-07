module.exports = originalHighlight => {
  return (text, lang) => {
    const previousHtml = originalHighlight(text, lang)
    const copyToClipboardHtml = "<button type=\"button\" class=\"copy-to-clipboard\"><i class=\"icon icon-copy\"></i></button>"

    return copyToClipboardHtml + previousHtml
  }
}
