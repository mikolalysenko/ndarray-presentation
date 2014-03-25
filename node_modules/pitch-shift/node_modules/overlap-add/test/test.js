"use strict"

var overlapAdd = require("../overlap.js")

require("tape")("overlap-add unaligned", function(t) {

  var expected_frames = [
    [0, 1, 2, 10, 12, 14, 30],
    [26, 28, 51, 40, 42, 72, 54]
  ]
  
  var adder = overlapAdd(7, 3, function(x) {
    var f = expected_frames[0]
    expected_frames.shift()
    t.same(f, Array.prototype.slice.call(x))
  })
  
  function pushData(arr) {
    adder(new Float32Array(arr))
  }
  
  pushData([0,1,2,3,4,5,6])
  pushData([7,8,9,10,11,12,13])
  pushData([14,15,16,17,18,19,20])
  pushData([21,22,23,24,25,26,27])
  pushData([28,29,30,31,32,33,34])

  t.equals(expected_frames.length, 0)

  t.end()
})


require("tape")("overlap-add aligned", function(t) {

  var expected_frames = [
    [0, 1, 6, 8],
    [14, 16, 22, 24]
  ]
  
  var adder = overlapAdd(4, 2, function(x) {
    var f = expected_frames[0]
    expected_frames.shift()
    t.same(f, Array.prototype.slice.call(x))
  })
  
  function pushData(arr) {
    adder(new Float32Array(arr))
  }
  
  pushData([0,1,2,3])
  pushData([4,5,6,7])
  pushData([8,9,10,11])
  pushData([12,13,14,15])
  pushData([16,17,18,19])

  t.equals(expected_frames.length, 0)

  t.end()
})
