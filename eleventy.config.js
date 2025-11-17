import autoprefixer from "autoprefixer"
import directoryOutputPlugin from "@11ty/eleventy-plugin-directory-output"
import rss from "@11ty/eleventy-plugin-rss"
import eleventySass from "eleventy-sass"
import { NodePackageImporter } from "sass"
import emoji from "eleventy-plugin-emoji"
import katex from "katex"
import postcss from "postcss"
import tableOfContents from "eleventy-plugin-nesting-toc"
import { readFileSync } from "fs"
import yaml from "js-yaml"

import { date, isoDate, isoDateTime } from "./eleventy/dates.js"
import { glob } from "./eleventy/files.js"
import { relativeFileFilter, carousel, relativeFile, imageShortcode, imageUrl, comparison, thumbnail, clickableThumbnail, videoShortcode } from "./eleventy/images.js"
import iconFont from "./eleventy/icon-font.js"
import linkPost from "./eleventy/link-post.js"
import markdownIt from "./eleventy/markdown.js"
import postThumbnail from "./eleventy/post-thumbnail.js"
import qrCode from "./eleventy/qr-code.js"
import typescriptPlugin from "./eleventy/typescript-esbuild.js"
import asciinema from "./eleventy/asciinema.js"

const showDrafts = process.env.ELEVENTY_ENV === "development"

export default function (eleventyConfig) {
  eleventyConfig.addPassthroughCopy("favicon.svg")
  eleventyConfig.addPassthroughCopy("openpgp.asc")
  eleventyConfig.addPassthroughCopy("images")
  eleventyConfig.addPassthroughCopy({ "node_modules/katex/dist/fonts": "styles/fonts" })
  eleventyConfig.addPassthroughCopy({ "node_modules/@fontsource-variable/raleway/files": "styles/fontsource" })
  // Copy all non-processed files from the posts directories
  eleventyConfig.addPassthroughCopy({ "posts": "blog" }, {
    // Use this hack until https://github.com/11ty/eleventy/issues/1496 is fixed
    // Ideally, we would filter for all template formats which have been added via addTemplateFormats()
    // See also: https://github.com/11ty/eleventy/issues/1483
    filter: path => {
      return !path.endsWith(".md")
        && !path.endsWith(".json")
        && !path.endsWith(".ts")
        && !path.endsWith(".html")
    }
  })

  eleventyConfig.addLayoutAlias("page", "layouts/page.njk")
  eleventyConfig.addLayoutAlias("post", "layouts/post.njk")
  eleventyConfig.addLayoutAlias("post-list", "layouts/post-list.njk")

  eleventyConfig.setLibrary("md", markdownIt)

  eleventyConfig.addCollection("navigationPages", collectionApi =>
    collectionApi.getAll()
      .filter(item => "navigationWeight" in item.data)
      .sort((item1, item2) => item1.data.navigationWeight - item2.data.navigationWeight))
  eleventyConfig.addCollection("posts", collections =>
    collections.getFilteredByTag("post")
      .filter(post => showDrafts || !post.data.draft))

  eleventyConfig.addDataExtension("yaml", contents => yaml.load(contents))

  eleventyConfig.addFilter("relativeFile", relativeFileFilter)
  eleventyConfig.addFilter("date", date)
  eleventyConfig.addFilter("isoDate", isoDate)
  eleventyConfig.addFilter("isoDateTime", isoDateTime)
  eleventyConfig.addFilter("carousel", carousel)
  eleventyConfig.addFilter("glob", glob)
  eleventyConfig.addFilter("katex", text => katex.renderToString(text, { throwOnError: false }))
  eleventyConfig.addFilter("fileBase64", function (filename) { return readFileSync(relativeFile(filename, this.page), {encoding: "base64"}) })
  eleventyConfig.addFilter("filterByTags", (collection = [], requiredTags) =>
    collection.filter(post =>
      requiredTags.every(tag => post.data.tags?.includes(tag))
    )
  )
  eleventyConfig.addAsyncShortcode("qr-code", qrCode)

  eleventyConfig.addLiquidShortcode("asciinema", asciinema)
  eleventyConfig.addLiquidShortcode("image", imageShortcode)
  eleventyConfig.addLiquidShortcode("image-url", imageUrl)
  eleventyConfig.addLiquidShortcode("image-comparison", comparison)
  eleventyConfig.addLiquidShortcode("thumbnail", thumbnail)
  eleventyConfig.addLiquidShortcode("thumbnail-clickable", clickableThumbnail)
  eleventyConfig.addLiquidShortcode("carousel", carousel)
  eleventyConfig.addLiquidShortcode("video", videoShortcode)
  eleventyConfig.addLiquidTag("link-post", linkPost)

  eleventyConfig.addNunjucksShortcode("postThumbnail", postThumbnail)

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
      importers: [new NodePackageImporter()]
    },
    postcss: postcss([autoprefixer])
  })
  eleventyConfig.addPlugin(emoji)
  eleventyConfig.addPlugin(tableOfContents, {
    tags: ["h1", "h2", "h3", "h4", "h5"]
  })
  eleventyConfig.addPlugin(iconFont)
  eleventyConfig.addPlugin(rss)
  eleventyConfig.addPlugin(typescriptPlugin)
}
