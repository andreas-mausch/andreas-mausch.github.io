const { JSDOM } = require("jsdom")

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

function buildHexView(document, rawData, caption, step, showLineNums, wordSize, rowBreak, highlights) {
  var table = document.createElement("table")
  table.classList.add("hexview-table")
  table.classList.add("hexview")

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

  return table
}

module.exports = function markdownItHexView(md, options = {}) {
  const regex = /^```hexview\{([^}]*)\}/
  const closeMarker = options.closeMarker || "```"
  const closeChar = closeMarker.charCodeAt(0)

  function buildFromBase64(slf, content, highlights) {
    const rawData = atob(remove_whitespace(content))
    highlights = JSON.parse(`[${highlights.replace(/([#\w]+)/g, "\"$1\"")}]`)

    const dom = new JSDOM("<!DOCTYPE html><html><body></body></html>")
    const table = buildHexView(dom.window.document, rawData, "Test caption", 16, true, 1, 8, highlights)

    return table.outerHTML
  }

  function render(tokens, idx, _options, _env, slf) {
    const { content, attributes } = tokens[idx]
    try {
      return buildFromBase64(slf, content, attributes["data-highlights"])
    }
    catch (error) {
      return `<p style="border: 2px dashed red">Failed to render hexView<span>${md.utils.escapeHtml(error.toString())}</span></p>`
    }
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

    const token = state.push("hexView", "fence", 0)
    const attributes = match[1].trim()
    token.attributes = attributes ? Object.fromEntries(attributes.split(" ").map(attr => attr.split("="))) : []
    token.content = contents

    state.line = nextLine + (autoClosed ? 1 : 0)

    return true
  }

  md.block.ruler.before("fence", "hexView", hexView, {
    alt: ["paragraph", "reference", "blockquote", "list"]
  })

  md.renderer.rules.hexView = render
}
