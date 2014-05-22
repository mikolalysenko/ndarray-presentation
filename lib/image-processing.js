var ndarray = require("ndarray")
var ndscratch = require("ndarray-scratch")
var ops = require("ndarray-ops")
var lena = require("baboon-image")
var luminance = require("luminance")
var gaussFilter = require("ndarray-gaussian-filter")
var pool = require("typedarray-pool")
var colorize = require("apply-colormap")

var grayLena = luminance(lena)

var imageProcessingCanvas = document.getElementById("image-processing-canvas")
var imageProcessingContext = imageProcessingCanvas.getContext("2d")
var imageProcessingSigma = document.getElementById("image-processing-sigma")
var imageProcessingPixels = imageProcessingContext.createImageData(512, 512)
var imageProcessingNdarray = ndarray(imageProcessingPixels.data, [512, 512, 4], [512*4, 4, 1], 0)
ops.assigns(imageProcessingNdarray, 255)

function repaintImageProcessing() {
  var sigma = +imageProcessingSigma.value
  var filtered = ndscratch.malloc(grayLena.shape)
  var pixels = pool.mallocUint8(grayLena.size * 3)
  ops.assign(filtered, grayLena)
  gaussFilter(filtered, sigma)
  var colors = colorize(filtered, {
    colormap: "gray",
    outBuffer: pixels
  })
  ndscratch.free(filtered)
  ops.assign(imageProcessingNdarray.hi(-1,-1,3), colors)
  pool.freeUint8(pixels)
  imageProcessingContext.putImageData(imageProcessingPixels, 0, 0)
}
repaintImageProcessing()
imageProcessingSigma.addEventListener("change", repaintImageProcessing)