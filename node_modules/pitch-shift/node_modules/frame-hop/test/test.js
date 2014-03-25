"use strict"

var frameHop = require("../hop.js")

require("tape")("frame-hop", function(t) {
  
  var expected_frames = [
    [0,1,2,3,4,5,6],
    [3,4,5,6,7,8,9],
    [6,7,8,9,10,11,12],
    [9,10,11,12,13,14,15],
    [12,13,14,15,16,17,18],
    [15,16,17,18,19,20,21]
  ]
  
  var slicer = frameHop(7, 3, function(x) {
    var f = expected_frames[0]
    expected_frames.shift()
    t.same(f, Array.prototype.slice.call(x, 0))
  })
  
  function pushData(arr) {
    slicer(new Float32Array(arr))
  }
  
  pushData([0,1,2])
  pushData([3,4])
  pushData([5,6,7,8,9,10,11])
  pushData([12,13])
  pushData([14,15,16,17,18,19,20,21])
  t.end()
})