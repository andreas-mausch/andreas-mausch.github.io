const fs = require("fs")
const imageShortcodes = require("./images")

module.exports = post => {
  if (post.inputPath && post.inputPath.endsWith("/index.md")) {
    const filename = post.data.thumbnail || "thumbnail.jpg"
    const thumbnailPath = imageShortcodes.relativeFile(filename, post)
    if (fs.existsSync(thumbnailPath)) {
      return imageShortcodes.thumbnail(filename, "Post thumbnail", post)
    }
  }
  return ""
}
