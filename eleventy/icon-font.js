const IconFontBuildr = require("icon-font-buildr")
const settings = require("../icon-font.json")

module.exports = (eleventyConfig, _options = {}) => {
  eleventyConfig.on("eleventy.before", async () => {
    await new IconFontBuildr(settings).build()
  })
}
