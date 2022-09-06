const image = require("@11ty/eleventy-img")
const imageSize = require("image-size")
const getPathPrefix = require("./path-prefix")
const path = require("path")

const thumbnailWidth = 300

const imageMetadata = src => {
  const options = {
    widths: [thumbnailWidth],
    formats: ["jpeg"],
    urlPath: `${getPathPrefix()}/images/`,
    outputDir: "./_site/images/",
    filenameFormat: function (hash, src, width, format, _options) {
      const { name } = path.parse(src)
      return `${name}-${hash}-${width}.${format}`
    }
  }
  image(src, options)
  return image.statsSync(src, options)
}

function relativeFile(src, page) {
  return path.join(path.parse(page.inputPath).dir, src)
}

function relativeFileFilter(src) {
  return path.join(this.context.environments.page.url, src)
}

function findThumbnail(src, page = this.page) {
  const metadata = imageMetadata(relativeFile(src, page))

  return metadata.jpeg
    ?.filter(img => img.width <= thumbnailWidth)
    ?.sort((img1, img2) => img2.width - img1.width)
    .find(() => true)
}

function findImage(src, page = this.page) {
  const filename = relativeFile(src, page)
  imageMetadata(filename)
  const dimensions = imageSize(filename)

  return {
    width: dimensions.width,
    height: dimensions.height,
    url: `${getPathPrefix()}${path.join(page.url, src)}`
  }
}

function thumbnail(src, alt, page = this.page) {
  const thumbnail = findThumbnail(src, page)

  if (!thumbnail) {
    return
  }
  return `<img src="${thumbnail.url}" alt="${alt}" width="${thumbnail.width}" height="${thumbnail.height}">`
}

function imageUrl(src, page = this.page) {
  const image = findImage(src, page)
  return image.url
}

function clickableThumbnail(src, alt, page = this.page) {
  const img = thumbnail(src, alt, page)
  const largestImageUrl = imageUrl(src, page)
  return `<a href="${largestImageUrl}" target="_blank">${img}</a>`
}

function imageShortcode(src, alt) {
  const image = findImage(src, this.page)
  return `<img src="${image.url}" width="${image.width}" height="${image.height}" alt="${alt}">`
}

function carousel(srcs) {
  if (!srcs || srcs.length === 0) {
    throw new Error("srcs is undefined or empty")
  }

  let slider = "<div class=\"swiffy-slider slider-indicators-sm slider-indicators-dark slider-indicators-outside slider-indicators-round slider-indicators-highlight slider-nav-visible slider-nav-touch slider-nav-dark slider-nav-chevron slider-item-ratio-contain\">"
  slider += "<ul class=\"slider-container\">"
  for (const thumbnail of srcs.map(src => clickableThumbnail(src, "Slider image", this.context.environments.page))) {
    slider += `<li>${thumbnail}</li>`
  }
  slider += "</ul>"

  slider += "<button type=\"button\" class=\"slider-nav\"></button>"
  slider += "<button type=\"button\" class=\"slider-nav slider-nav-next\"></button>"

  slider += "<div class=\"slider-indicators\">"
  srcs.forEach((_src, index) => {
    slider += "<button"
    if (index === 0) {
      slider += " class=\"active\""
    }
    slider += "></button>"
  })
  slider += "</div>"
  slider += "</div>"

  return slider
}

function comparison(beforeName, afterName, page = this.page) {
  const before = findImage(beforeName, page)
  const after = findImage(afterName, page)

  if (!before || !after) {
    throw new Error(`comparison: before (${before}) or after (${after}) not found`)
  }

  let comparison = "<div class=\"image-comparison-slider\">"
  comparison += "<img-comparison-slider>"
  comparison += `<img slot="first" src="${before.url}" width="${before.width}" height="${before.height}" style="max-height: 80vh" />`
  comparison += `<img slot="second" src="${after.url}"  width="${after.width}" height="${after.height}" style="max-height: 80vh" />`
  comparison += "<svg slot=\"handle\" class=\"image-comparison-slider-handle\" xmlns=\"http://www.w3.org/2000/svg\" width=\"125\" viewBox=\"-8 -3 16 6\">"
  comparison += "<path stroke=\"#fff\" d=\"M -5 -2 L -7 0 L -5 2 M -5 -2 L -5 2 M 5 -2 L 7 0 L 5 2 M 5 -2 L 5 2\" stroke-width=\"1\" fill=\"#fff\" vector-effect=\"non-scaling-stroke\"></path>"
  comparison += "</svg>"
  comparison += "</img-comparison-slider>"
  comparison += "</div>"

  return comparison
}

module.exports = {
  relativeFile,
  relativeFileFilter,
  thumbnail,
  clickableThumbnail,
  imageShortcode,
  imageUrl,
  carousel,
  comparison
}
