var qrcode = require("qrcode")

module.exports = async input => {
  const dataUrl = await qrcode.toDataURL(input)
  return `<img src="${dataUrl}" alt="Generated QR code">`
}
