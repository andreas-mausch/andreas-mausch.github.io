import { JSDOM } from "jsdom"
import { ratio } from "get-contrast"

var HEX = "0123456789ABCDEF"

function remove_whitespace(str) {
  return str.replace(/\s/g, "")
}

function dec2_to_hex(dec) {
  if (dec < 0) dec = 0
  if (dec > 255) dec = 255
  return HEX.charAt(Math.floor(dec / 16)) + HEX.charAt(dec % 16)
}

function dec_to_hex8(dec) {
  var str = ""
  for (var i = 3; i >= 0; i--) {
    str += dec2_to_hex((dec >> (i * 8)) & 255)
  }
  return str
}

function getTextColorForBackground(backgroundColor) {
  const blackTextColor = "#000000"
  const whiteTextColor = "#ffffff"

  const blackContrast = ratio(backgroundColor, blackTextColor)
  const whiteContrast = ratio(backgroundColor, whiteTextColor)

  // Return black or white text based on the highest contrast ratio
  return blackContrast > whiteContrast ? blackTextColor : whiteTextColor
}

function buildHexView(document, rawData, caption, step, showLineNums, wordSize, rowBreak, highlights, legend) {
  const hexview = document.createElement("div")
  hexview.classList.add("hexview")

  var table = document.createElement("table")
  hexview.appendChild(table)

  var offset = 0

  function applyHighlights(row, index) {
    var cells = row.querySelectorAll("td") // Get all td elements in the row
    var lastCell = cells[cells.length - 1] // Target last <td> in row

    for (var idx = 0; idx < highlights.length; idx++) {
      if (index >= highlights[idx][0] && index <= highlights[idx][1]) {
        if (index == highlights[idx][0]) {
          lastCell.classList.add("hexview-border-start")
        }

        if (index == highlights[idx][1]) {
          lastCell.classList.add("hexview-border-end")
        }

        lastCell.classList.add("hexview-code-hi", "hexview-border-middle")
        lastCell.style.backgroundColor = highlights[idx][2]
        lastCell.style.color = getTextColorForBackground(highlights[idx][2])
        lastCell.title = highlights[idx][3]
      } else {
        lastCell.classList.add("hexview-code")
      }
    }
  }

  if (caption) {
    var captionElement = document.createElement("caption")
    captionElement.textContent = caption
    table.appendChild(captionElement)
  }

  while (rawData.length > 0) {
    const lineData = rawData.slice(0, step)
    rawData = rawData.slice(step)

    var row = document.createElement("tr")
    row.classList.add("hexview")
    table.appendChild(row)

    if (showLineNums) {
      var offsetCell = document.createElement("td")
      offsetCell.classList.add("hexview-offset")
      offsetCell.textContent = dec_to_hex8(offset) + " "
      row.appendChild(offsetCell)
    }

    for (var idxData = 0; idxData < lineData.length; idxData += wordSize) {
      var num = ""

      for (var idxWs = 0; idxWs < wordSize; idxWs++) {
        num += dec2_to_hex(lineData.charCodeAt(idxData + idxWs))
      }

      var cell = document.createElement("td")
      row.appendChild(cell)

      if (idxData === rowBreak - 1) {
        cell.innerHTML = num + "&nbsp;&nbsp;&nbsp;"
        applyHighlights(row, offset + idxData) // Highlight after appending
      } else {
        cell.innerHTML = num + " "
        applyHighlights(row, offset + idxData) // Highlight after appending
      }
    }

    var text = ""

    for (var i = 0; i < lineData.length; i++) {
      var cc = lineData.charCodeAt(i)

      if (cc >= 32 && cc <= 126) {
        text += lineData.charAt(i)
      } else {
        text += "."
      }
    }

    if (lineData.length < step) {
      var lastCell = row.querySelector("td:last-child")
      lastCell.colSpan = Math.floor((step - lineData.length) / wordSize) + 1
    }

    offset += step

    var textCell = document.createElement("td")
    textCell.classList.add("hexview-visual")
    textCell.textContent = text
    row.appendChild(textCell)
  }

  if (legend) {
    const legend = document.createElement("ul")
    highlights
      .filter((object1, index, self) =>
        // Remove duplicates, if a color is referenced more than once
        self.findIndex(object2 => (object1[2] === object2[2])) === index
      )
      .forEach(highlight => {
        const legendEntry = document.createElement("li")
        const span = document.createElement("span")
        span.style.color = highlight[2]
        span.style["font-weight"] = "bold"
        span.textContent = "████"
        legendEntry.appendChild(span)
        legendEntry.appendChild(document.createTextNode(": " + highlight[3]))
        legend.appendChild(legendEntry)
      })
    hexview.appendChild(legend)
  }

  return hexview
}

export default function markdownItHexView(md, options = {}) {
  const regex = /^```hexview(\{([^}]*)\})?/
  const closeMarker = options.closeMarker || "```"
  const closeChar = closeMarker.charCodeAt(0)

  function buildFromBase64(content, caption, highlights, legend) {
    const rawData = atob(remove_whitespace(content))
    highlights = highlights ? highlights.replace(/([#\w]+)/g, "\"$1\"") : ""
    highlights = JSON.parse(`[${highlights}]`)

    const dom = new JSDOM("<!DOCTYPE html><html><body></body></html>")
    const table = buildHexView(dom.window.document, rawData, caption, 16, true, 1, 8, highlights, legend)

    return table.outerHTML
  }

  function render(tokens, idx, _options, _env, _slf) {
    const { content, attributes } = tokens[idx]
    return buildFromBase64(content, attributes["caption"], attributes["highlights"], attributes["legend"])
  }

  function hexView(state, startLine, endLine, silent) {
    const firstLine = state.src.split("\n")[startLine]
    const match = firstLine.match(regex)
    let nextLine
    let i
    let autoClosed = false
    let start = state.bMarks[startLine] + state.tShift[startLine]
    let max = state.eMarks[startLine]

    if (!match) {
      return false
    }

    // Since start is found, we can report success here in validation mode
    if (silent) {
      return true
    }

    // Search for the end of the block
    nextLine = startLine

    for (; ;) {
      nextLine++
      if (nextLine >= endLine) {
        // unclosed block should be autoclosed by end of document.
        // also block seems to be autoclosed by end of parent
        break
      }

      start = state.bMarks[nextLine] + state.tShift[nextLine]
      max = state.eMarks[nextLine]

      if (start < max && state.sCount[nextLine] < state.blkIndent) {
        // non-empty line with negative indent should stop the list:
        // - ```
        //  test
        break
      }

      if (closeChar !== state.src.charCodeAt(start)) {
        // didn't find the closing fence
        continue
      }

      if (state.sCount[nextLine] > state.sCount[startLine]) {
        // closing fence should not be indented with respect of opening fence
        continue
      }

      let closeMarkerMatched = true
      for (i = 0; i < closeMarker.length; ++i) {
        if (closeMarker[i] !== state.src[start + i]) {
          closeMarkerMatched = false
          break
        }
      }

      if (!closeMarkerMatched) {
        continue
      }

      // make sure tail has spaces only
      if (state.skipSpaces(start + i) < max) {
        continue
      }

      // found!
      autoClosed = true
      break
    }

    const contents = state.src
      .split("\n")
      .slice(startLine + 1, nextLine)
      .join("\n")

    const token = state.push("hexview", "fence", 0)
    const attributes = match[2]?.trim()
    token.attributes = attributes ? Object.fromEntries(attributes.split(" ").map(attr => attr.split("="))) : []
    token.content = contents

    state.line = nextLine + (autoClosed ? 1 : 0)

    return true
  }

  md.block.ruler.before("fence", "hexview", hexView, {
    alt: ["paragraph", "reference", "blockquote", "list"]
  })

  md.renderer.rules.hexview = render
}
