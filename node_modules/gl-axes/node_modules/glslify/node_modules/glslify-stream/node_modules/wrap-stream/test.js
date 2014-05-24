var concat = require('concat-stream')
var test = require('tape')
var wrap = require('./')
var fs = require('fs')

test('pre and post work as expected', function(t) {
  t.plan(2)

  fs.createReadStream(__dirname + '/index.js')
    .pipe(wrap('hello', 'world'))
    .pipe(concat(function(data) {
      t.ok(data.slice(0, 5) === 'hello', '"pre" works')
      t.ok(data.slice(-5) === 'world', '"post" works')
    }))
})
