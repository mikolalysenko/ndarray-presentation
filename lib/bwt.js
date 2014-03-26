"use strict"

var ndarray = require("ndarray")
var ndstring = require("ndarray-string")
var scratch = require("ndarray-scratch")
var ndsort = require("ndarray-sort")
var hl = require("highlight.js")

var inputString = document.getElementById("bz2-string")
var forwardRotated = document.getElementById("bz2-forward-rotated")
var forwardSorted = document.getElementById("bz2-forward-sorted")
var forwardResult = document.getElementById("bz2-forward-result")

var inverseString = document.getElementById("bz2-inverse-string")
var inverseColumns = document.getElementById("bz2-inverse-columns")
var inverseResult = document.getElementById("bz2-inverse-result")

//Apply formatting to all text strings
Array.prototype.forEach.call(document.querySelectorAll(".bz2line"), function(element) {
  element.innerHTML = hl.highlight("javascript", element.innerText).value
  element.addEventListener("click", incrementColumn)
})

var columnStep = 0

function formatStr(str) {
  if(Array.isArray(str)) {
    str = str.join("\n")
  }
  return str.replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/\0/g, '<font color="red">0</font>')
}

function render() {
  var str = inputString.innerText + "\0"
  var n = str.length
  var x = ndstring(str+str,[n,n],[1,1])

  forwardRotated.innerHTML = formatStr(ndstring.toString(x))

  var y = ndsort(scratch.clone(x))

  forwardSorted.innerHTML = formatStr(ndstring.toString(y))

  var result = ndstring.toString(y.pick(-1, n-1))
  scratch.free(y)

  forwardResult.innerHTML = formatStr(result)

  inverseString.innerText = result.replace(/\0/g, "\\0")

  var xx = ndstring(result, [n,n], [1,0])
  var y = scratch.clone(xx)

  var ihtml = formatStr(ndstring.toString(y))
  for(var i=n-1; i>=0; --i) {
    var cols = y.lo(0, i)
    ndsort(cols)
    if(i > (n-columnStep-1)) {
      ihtml = formatStr(ndstring.toString(y))
    }
  }
  var nstep = Math.max(n-columnStep, 0)
  ihtml = "i = " + nstep + ":\n" + ihtml
  inverseColumns.innerHTML = ihtml

  inverseResult.innerText = str
}

inputString.addEventListener("keyup", render)
render()

inverseColumns.addEventListener("click", incrementColumn)

function incrementColumn() {
  columnStep += 1
  render()
}

Reveal.addEventListener("slidechanged", function() {
  columnStep = 0
  render()
})