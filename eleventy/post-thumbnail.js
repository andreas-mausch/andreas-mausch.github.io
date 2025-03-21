import { existsSync } from "fs"
import { imageShortcode, relativeFile, thumbnail } from "./images.js"

export default post => {
  if (post.inputPath) {
    if (!post.inputPath.endsWith("/index.md")) {
      return ""
    }

    const filename = post.data.thumbnail || "thumbnail.jpg"
    const thumbnailPath = relativeFile(filename, post)
    if (!existsSync(thumbnailPath)) {
      if (post.data.thumbnail) {
        throw new Error(`Thumbnail defined but not found: ${post.data.thumbnail} (${thumbnailPath})`)
      } else {
        return ""
      }
    }

    // Do not convert .svg to .jpg to maintain transparency
    if (post.data.thumbnail?.endsWith(".svg")) {
      return imageShortcode(filename, "Post thumbnail", post)
    }
    return thumbnail(filename, "Post thumbnail", post)
  }
}
