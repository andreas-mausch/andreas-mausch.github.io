const autoprefixer = require("autoprefixer")
const dates = require("./eleventy/dates")
const directoryOutputPlugin = require("@11ty/eleventy-plugin-directory-output")
const eleventySass = require("eleventy-sass")
const emoji = require("eleventy-plugin-emoji")
const imageShortcodes = require("./eleventy/images")
const katex = require("katex")
const linkPost = require("./eleventy/link-post")
const markdownIt = require("./eleventy/markdown")
const postcss = require("postcss")
const tableOfContents = require("eleventy-plugin-toc")
const typescriptPlugin = require("./eleventy/typescript-esbuild")

module.exports = function (eleventyConfig) {
  eleventyConfig.addPassthroughCopy("favicon.svg")
  eleventyConfig.addPassthroughCopy({ "node_modules/katex/dist/fonts": "styles/fonts" })

  eleventyConfig.addLayoutAlias("page", "layouts/page.njk")
  eleventyConfig.addLayoutAlias("post", "layouts/post.njk")

  eleventyConfig.setLibrary("md", markdownIt)

  eleventyConfig.addFilter("date", dates.date)
  eleventyConfig.addFilter("isoDate", dates.isoDate)
  eleventyConfig.addFilter("isoDateTime", dates.isoDateTime)
  eleventyConfig.addFilter("carousel", imageShortcodes.carousel)
  eleventyConfig.addFilter("katex", text => katex.renderToString(text, { throwOnError: false }))

  eleventyConfig.addLiquidShortcode("image", imageShortcodes.imageShortcode)
  eleventyConfig.addLiquidShortcode("image-url", imageShortcodes.imageUrl)
  eleventyConfig.addLiquidShortcode("image-comparison", imageShortcodes.comparison)
  eleventyConfig.addLiquidShortcode("thumbnail", imageShortcodes.thumbnail)
  eleventyConfig.addLiquidShortcode("thumbnail-clickable", imageShortcodes.clickableThumbnail)
  eleventyConfig.addLiquidShortcode("carousel", imageShortcodes.carousel)
  eleventyConfig.addLiquidTag("link-post", linkPost)

  eleventyConfig.setQuietMode(true)

  eleventyConfig.addPlugin(directoryOutputPlugin, {
    columns: {
      filesize: true,
      benchmark: true
    },
    warningFileSize: 50 * 1000
  })
  eleventyConfig.addPlugin(eleventySass, {
    sass: {
      style: "compressed",
      sourceMap: false,
      loadPaths: ["node_modules"]
    },
    postcss: postcss([autoprefixer])
  })
  eleventyConfig.addPlugin(emoji)
  eleventyConfig.addPlugin(tableOfContents, {
    tags: ["h1", "h2", "h3", "h4", "h5"]
  })
  eleventyConfig.addPlugin(typescriptPlugin)
}
