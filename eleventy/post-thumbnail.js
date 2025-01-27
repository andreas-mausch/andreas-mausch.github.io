const fs = require("fs")
const imageShortcodes = require("./images")

module.exports = post => {
  if (post.inputPath) {
    if (!post.inputPath.endsWith("/index.md")) {
      return ""
    }

    const filename = post.data.thumbnail || "thumbnail.jpg"
    const thumbnailPath = imageShortcodes.relativeFile(filename, post)
    if (!fs.existsSync(thumbnailPath)) {
      if (post.data.thumbnail) {
        throw new Error(`Thumbnail defined but not found: ${post.data.thumbnail} (${thumbnailPath})`)
      } else {
        return ""
      }
    }

    // Do not convert .svg to .jpg to maintain transparency
    if (post.data.thumbnail?.endsWith(".svg")) {
      return imageShortcodes.imageShortcode(filename, "Post thumbnail", post)
    }
    return imageShortcodes.thumbnail(filename, "Post thumbnail", post)
  }
}
