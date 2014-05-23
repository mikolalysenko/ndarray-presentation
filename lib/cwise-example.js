"use strict"

var ndarray = require("ndarray")
var cwise = require("cwise")

var CELLSIZE = 10

function drawList(array) {
  var svg = [
    '<svg xmlns="http://www.w3.org/2000/svg" 
      width="', CELLSIZE*array.shape[1], '" height="', CELLSIZE*array.shape[1] ,'">']

  for(var i=0; i<=array.shape[0]; ++i) {
    svg.push('<line x1="', 0, '" y1="', i*CELLSIZE, '" x2="', CELLSIZE*array.shape[1], '" y2="', i*CELLSIZE, '">')
  }

  for(var i=0; i<=array.shape[1]; ++i) {
    svg.push('<line x1="', i*CELLSIZE, '" y1="', 0, '" x2="', i*CELLSIZE, '" y2="', CELLSIZE*array.shape[0], '">')
  }

  svg.push("</svg>")
  return svg.join("")
}