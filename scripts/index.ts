import { swiffyslider } from "swiffy-slider"
import "img-comparison-slider/dist/index"
import { copyToClipboard } from "./_copy-to-clipboard"

window.swiffyslider = swiffyslider

window.addEventListener("load", () => {
  window.swiffyslider.init()
  copyToClipboard()
})
