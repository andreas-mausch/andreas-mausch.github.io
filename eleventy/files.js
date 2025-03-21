import { sync } from "glob"
import { parse } from "path"

const glob = function (pattern) {
  const directory = parse(this.context.environments.page.inputPath).dir
  return sync(pattern, {
    cwd: directory,
    nonull: false
  })
}

export {
  glob
}
