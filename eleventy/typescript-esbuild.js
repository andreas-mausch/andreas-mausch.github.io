import { build } from "esbuild"
import { parse, resolve } from "path"

const isProduction = () => process.env.ELEVENTY_ENV === "production"

export default (eleventyConfig, _options = {}) => {
  eleventyConfig.addTemplateFormats("ts")
  eleventyConfig.addExtension("ts", {
    outputFileExtension: "js",
    compile: async (_content, inputPath) => {
      const parsed = parse(inputPath)
      if (parsed.name.startsWith("_")) {
        return
      }
      if (inputPath.endsWith(".d.ts")) {
        return
      }

      return async _data => {
        const compiled = await build({
          entryPoints: [resolve(inputPath)],
          bundle: true,
          minify: isProduction(),
          sourcemap: !isProduction(),
          legalComments: "none",
          write: false
        })
        return compiled.outputFiles[0].text
      }
    }
  })
}
