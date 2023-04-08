export function copyToClipboard() {
  const divs = document.querySelectorAll(".copy-to-clipboard")

  divs.forEach(element => element.addEventListener("click", event => {
    const button = (event.target as Element).closest("button")
    const i = button.querySelector("i")
    const code = button.nextElementSibling.querySelector("code")
    navigator.clipboard.writeText(code.innerText)

    button.disabled = true
    i.classList.remove("icon-copy")
    i.classList.add("icon-check")

    setTimeout(() => {
      button.disabled = false
      i.classList.remove("icon-check")
      i.classList.add("icon-copy")
    }, 3000)
  }))
}
