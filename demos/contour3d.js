//Load modules
var surfaceNets = require("surface-nets")
var ndarray = require("ndarray")
var fill = require("ndarray-fill")
var mat4 = require("gl-matrix").mat4

//Initialize array
var array = ndarray(new Float32Array(32*32*32), [32,32,32])
fill(array, function(i,j,k) {
  return Math.pow(i-16,2) + Math.pow(j-16,2) + Math.pow(k-16,2)
})

//Generate surface! (again, just one line)
var complex = surfaceNets(array, 100)

//Render the implicit surface to stdout
console.log('<svg xmlns="http://www.w3.org/2000/svg" width="512" height="512" version="1.1">')
console.log(require("svg-3d-simplicial-complex")(
  complex.cells, 
  complex.positions, {
    view: mat4.lookAt(
      mat4.create(), 
      [32, 32, 32], 
      [16, 16, 16], 
      [0,1,0]),
    projection: mat4.perspective(mat4.create(),
      Math.PI/4.0,
      1.0,
      0.1,
      1000.0),
    viewport: [[0,0], [512,512]]
  }))
console.log("</svg>")