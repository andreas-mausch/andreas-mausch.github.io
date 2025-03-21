import iconism from "iconism"
import { mkdirp } from "mkdirp"

export default (eleventyConfig, _options = {}) => {
  eleventyConfig.on("eleventy.before", async () => {
    const output = "./_site/styles/icons/"
    mkdirp.sync(output)
    await iconism({
      output,
      types: ["ttf", "woff2"],
      assets: ["css"],
      debug: true,
      prefix: "icon",
      input: "./icon-font.json"
    })
  })
}
