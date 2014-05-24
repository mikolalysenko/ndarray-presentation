//Load modules
var surfaceNets = require("surface-nets")
var ndarray = require("ndarray")
var fill = require("ndarray-fill")

//Initialize array to a circle
var array = ndarray(new Float32Array(33*33), [33,33])
fill(array, function(i,j) {
  return Math.pow(i-16,2) + Math.pow(j-16,2)
})

//Extract 2D contour (this is all there is to it!)
var complex = surfaceNets(array, 15*15)

//Write SVG image to stdout
var svgFile = ['<svg xmlns="http://www.w3.org/2000/svg" width="320" height="320">']
complex.cells.forEach(function(cell) {
  var p0 = complex.positions[cell[0]]
  var p1 = complex.positions[cell[1]]
  svgFile.push('<line x1="', 10*p0[0], '" y1="', 10*p0[1], '" x2="', 10*p1[0], '" y2="', 10*p1[1], '" stroke="red" stroke-width="1" />')
})
complex.positions.forEach(function(p) {
  svgFile.push('<circle cx="', 10*p[0], '" cy="', 10*p[1], '" r="1" stroke="black" stroke-width="0.1" fill="black" />')
})
svgFile.push('</svg>')
console.log(svgFile.join(""))