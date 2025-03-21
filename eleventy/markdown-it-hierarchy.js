// Source: https://github.com/shytikov/markdown-it-hierarchy/blob/e9f453e94d851e06952cbf206772a89c4df985f5/index.js

// Plugin that adds hierarchy numbering to headers, like "1. XXX", "1.2 YYY" etc
//
// Theory of operation:
//
// - Process tokens at the 'renderer' phase, the last phase in the markdown-it processing
//   path
// - Add rules for 'heading_open' and 'text'
// - In 'heading_open' identify the child token that contains the contents we want to add the hierarchy
//   number to and store it for the 'text' rule
// - In the 'text' rule if we find the matching token the token is modified to append the hierarchy text,
//   the token is rendered and the output stored, and the token restoreds

const generateHierarchicalText = function (accumulator, level) {
  let value = ""

  for (let header in accumulator) {
    value += `${accumulator[header]}.`

    if (header == level) {
      return `${value} `
    }
  }

  return `${value} `
}

export default function (md, _opts) {
  // Store the previous rules so we can call the previous rules. This allows
  // us to insert ourselves without disrupting other plugins that are also
  // attaching to the same rules
  var previousTextRule = md.renderer.rules.text
  var previousHeadingOpenRule = md.renderer.rules.heading_open

  md.renderer.rules.heading_open = function (tokens, idx, options, env, self) {
    let level = tokens[idx].tag

    if (!env.hierarchy) {
      env.hierarchy = {
        accumulator: [],
        hierarchyTextOutput: "",
        lastLevel: null,
        waitingForObject: null
      }
    }

    if (!env.hierarchy.lastLevel || (env.hierarchy.lastLevel < level)) {
      env.hierarchy.accumulator[level] = 1
    } else {
      env.hierarchy.accumulator[level]++
    }

    env.hierarchy.lastLevel = level
    env.hierarchy.hierarchyTextOutput = generateHierarchicalText(env.hierarchy.accumulator, level)
    // store the object that the text rule will look to modify when the rules engine
    // gets to that point
    env.hierarchy.waitingForObject = tokens[idx + 1].children[0]

    // call the previous rule if one was found or the default rule if none was found
    // this reduces the chance of conflict with other plugins
    let returnValue
    if (previousHeadingOpenRule !== undefined) {
      returnValue = previousHeadingOpenRule(tokens, idx, options, env, self)
    } else {
      returnValue = self.renderToken(tokens, idx, options, env, self)
    }

    return returnValue
  }

  md.renderer.rules.text = function (tokens, idx, options, env, self) {
    const originalContent = tokens[idx].content

    // if this is the token we should be altering, alter its content
    if (tokens[idx] === env.hierarchy?.waitingForObject) {
      tokens[idx].content = env.hierarchy.hierarchyTextOutput + originalContent
    }

    // call the previous rule if one was found or the default rule if none was found
    // this reduces the chance of conflict with other plugins
    let returnValue
    if (previousTextRule !== undefined) {
      returnValue = previousTextRule(tokens, idx, options, env, self)
    } else {
      returnValue = self.renderToken(tokens, idx, options, env, self)
    }

    // restore content to avoid potential unintended consequences with other plugins
    tokens[idx].content = originalContent

    return returnValue
  }
}
