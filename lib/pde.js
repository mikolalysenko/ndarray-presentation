"use strict"

var ndarray = require("ndarray")
var fill = require("ndarray-fill")
var cwise = require("cwise")
var ops = require("ndarray-ops")
var colorize = require("apply-colormap")
var pool = require("typedarray-pool")

var imshow = require("ndarray-imshow")
window.imshow = imshow

var width = 256
var height = 256

var canvas = document.getElementById("pde-canvas")
canvas.width = width
canvas.height = height
var context = canvas.getContext("2d")
var pdeSlide = document.querySelector(".slide-pde")

var pixelData = context.createImageData(width, height)
var pixelArray = ndarray(pixelData.data, [width,height,4])
ops.assigns(pixelArray, 255)
pixelArray = pixelArray.hi(width, height, 3)

var rawBuffer = ndarray(new Float64Array(2*2*(width+2)*(height+2)), [2,2,width+2, height+2])
var stateBuffer = rawBuffer.lo(0,0,1,1).hi(2,2,width,height)

var animating = true
var parity = 0

var timestep = 1.0
var Da = 0.095
var Db = 0.03
var K = 0.074
var F = 0.023

var numRectangles = 1

function initialize() {
  ops.assigns(rawBuffer.pick(-1,0), 1.0)

  var blayer = rawBuffer.pick(-1,1)
  fill(blayer, function(z,x,y) {
    var xc = (x-0.5*width)
    var yc = (y-0.5*height)
    return Math.exp(-0.001 * (xc*xc + yc*yc)) * Math.random()
  })
}

var laplacian = cwise({
  args:["array", "array", 
    {offset:[0,1], array:1}, {offset:[0,-1], array:1}, {offset:[1,0], array:1}, {offset:[-1,0], array:1},
    {offset:[-1,-1], array:1}, {offset:[-1,1], array:1}, {offset:[1,-1], array:1}, {offset:[1,1], array:1}
  ],
  body:function laplaceOp(a, x, e0, e1, e2, e3, c0, c1, c2, c3) {
    a = ((c0 + c1 + c2 + c3) + 4.0 * (e0 + e1 + e2 + e3) - 20.0 * x) / 6.0
  }
})

var applyReaction = cwise({
  args:["array", "array", "array", "array", "scalar", "scalar", "scalar", "scalar", "scalar"],
  body: function reactOp(af, bf, a, b, dt, da, db, k, f) {
    var w = a * b * b
    af = a + dt * (da * af - w + f * (1.0 - a))
    bf = b + dt * (db * bf + w - (f + k) * b)
  }
})

function updateBoundaryConditions(buffer) {
  ops.assign(
    buffer.hi(3, 1, height+2),
    buffer.lo(0, width, 0).hi(3, 1, height+2))

  ops.assign(
    buffer.lo(0, width+1, 0).hi(3, 1, height+2),
    buffer.lo(0, 1, 0).hi(3, 1, height+2))

  ops.assign(
    buffer.hi(3, width+2, 1),
    buffer.lo(0, 0, height).hi(3, width+2, 1))

  ops.assign(
    buffer.lo(0, 0, height+1).hi(3, width+2, 1),
    buffer.lo(0, 0, 1).hi(3, width+2, 1))

  for(var d=0; d<2; ++d) {
    buffer.set(d, 0, 0, buffer.get(d, width, height))
    buffer.set(d, width+1, 0, buffer.get(d, 1, height))
    buffer.set(d, 0, height+1, buffer.get(d, height, 1))
    buffer.set(d, width+1, height+1, buffer.get(d, 1, 1))
  }
}

function doUpdate() {
  var prevBuffer = stateBuffer.pick(parity)
  parity ^= 1
  var nextBuffer = stateBuffer.pick(parity)
  for(var i=0; i<2; ++i) {
    laplacian(nextBuffer.pick(i), prevBuffer.pick(i))
  }
  applyReaction(
    nextBuffer.pick(0),
    nextBuffer.pick(1),
    prevBuffer.pick(0),
    prevBuffer.pick(1),
    timestep,
    Da,
    Db,
    K,
    F)
  updateBoundaryConditions(rawBuffer.pick(parity))
}

function renderFrame() {
  if(!animating) {
    return
  }
  for(var i=0; i<10; ++i) {
    doUpdate()
  }
  var temp = pool.mallocUint8(width*height*3)
  var img = colorize(stateBuffer.pick(parity, 0), { 
    min: 0.0,
    max: 1.0,
    outBuffer: temp
  })
  ops.assign(pixelArray, img)
  pool.freeUint8(temp)
  context.putImageData(pixelData, 0, 0)
  requestAnimationFrame(renderFrame)
}

Reveal.addEventListener("slidechanged", function(event) {
  if(event.previousSlide && event.previousSlide === pdeSlide) {
    animating = false
  } else if(event.currentSlide && event.currentSlide === pdeSlide) {
    initialize()
    animating = true
    renderFrame()
  }
})