var through = require('through')

module.exports = wrap

function wrap(pre, post) {
  var first = true
  var send_pre = pre !== null && arguments.length
  var send_post = post !== null && arguments.length > 1

  return through(write, end)

  function write(data) {
    if (first) {
      if (send_pre) this.queue(pre)
      first = false
    }

    this.queue(data)
  }

  function end() {
    if (send_post) this.queue(post)
    this.queue(null)
  }
}
