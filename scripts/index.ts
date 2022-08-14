import Toastify from "toastify-js"
import { swiffyslider } from "swiffy-slider"

window.showToast = () => {
  Toastify({
    text: "This is a toast",
    duration: 3000,
    gravity: "top",
    position: "left"
  }).showToast()
}

window.swiffyslider = swiffyslider

window.addEventListener("load", () => {
  // @ts-expect-error: swiffyslider doesn't declare types
  window.swiffyslider.init()
})
