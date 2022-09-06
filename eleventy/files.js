const glob = require("glob")
const path = require("path")

module.exports = {
  glob: function (pattern) {
    const directory = path.parse(this.context.environments.page.inputPath).dir
    return glob.sync(pattern, {
      cwd: directory,
      nonull: false
    })
  }
}
