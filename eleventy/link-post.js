const getPathPrefix = require("./path-prefix")

module.exports = _liquidEngine => ({
  parse: function (tagToken, _remainingTokens) {
    this.linkToPost = tagToken.args
  },
  render: async function (scope, _hash) {
    const linkToPost = await this.liquid.evalValue(this.linkToPost, scope)
    const post = scope.environments.collections.post.find(post => post.url === `/blog/${linkToPost}/`)

    if (!post) {
      throw new Error(`link-post: Post not found ${linkToPost}`)
    }

    return `${getPathPrefix()}${post.url}`
  }
})
