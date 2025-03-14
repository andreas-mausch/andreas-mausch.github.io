const fs = require("fs")
const { render } = require("svg-term")
const { optimize } = require("svgo")

const imageShortcodes = require("./images")

module.exports = function (src) {
  const file = imageShortcodes.relativeFile(src, this.page)
  if (!fs.existsSync(file)) {
    throw new Error(`asciinema file not found: ${file}`)
  }

  return optimize(render(String(fs.readFileSync(file)), {})).data
}
