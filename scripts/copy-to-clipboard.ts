export function copyToClipboard() {
  const divs = document.querySelectorAll(".copy-to-clipboard")

  divs.forEach(element => element.addEventListener("click", event => {
    const code = (event.target as Element).closest("code")
    navigator.clipboard.writeText(code.innerText)
  }))
}
