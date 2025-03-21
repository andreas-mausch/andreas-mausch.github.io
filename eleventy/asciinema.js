import fs from "fs"
import { render } from "svg-term"
import { optimize } from "svgo"

import { relativeFile } from"./images.js"

export default function (src) {
  const file = relativeFile(src, this.page)
  if (!fs.existsSync(file)) {
    throw new Error(`asciinema file not found: ${file}`)
  }

  return optimize(render(String(fs.readFileSync(file)), {})).data
}
