import Toastify from 'toastify-js'

window.showToast = () => {
  Toastify({
    text: "This is a toast",
    duration: 3000,
    gravity: "top", // `top` or `bottom`
    position: "left", // `left`, `center` or `right`
  }).showToast();
}
