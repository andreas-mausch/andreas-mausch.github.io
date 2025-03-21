import QRCode from "qrcode"

export default async input => {
  const dataUrl = await QRCode.toDataURL(input)
  return `<img src="${dataUrl}" alt="Generated QR code">`
}
