import { swiffyslider } from "swiffy-slider"
import "img-comparison-slider/dist/index"

window.swiffyslider = swiffyslider

window.addEventListener("load", () => {
  window.swiffyslider.init()
})
