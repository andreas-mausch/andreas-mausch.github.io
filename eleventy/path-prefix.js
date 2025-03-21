// Unfortunately, this is needed because there is no other way to access the pathPrefix passed on the CLI
// See here: https://github.com/11ty/eleventy-img/issues/44
// And here: https://github.com/11ty/eleventy/issues/1641
export default () => process.env.ELEVENTY_PATH_PREFIX || ""
