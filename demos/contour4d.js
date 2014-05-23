//Load modules
var surfaceNets = require("surface-nets")
var ndarray = require("ndarray")
var fill = require("ndarray-fill")
var sc = require("simplicial-complex")
var mat4 = require("gl-matrix").mat4

//Initialize array
var array = ndarray(new Float32Array(16*16*16*16), [16,16,16,16])
fill(array, function(i,j,k,l) {
  return Math.pow(i-8,2) + Math.pow(j-8,2) + Math.pow(k-8,2) + Math.pow(l-8,2)
})

//Generate surface! (again, just one line)
var complex = surfaceNets(array, 50)

//Map points to 3D space by projection
var positions = complex.positions.map(function(p) {
  var w = 10.0 / (p[3] + 9.0)
  return [ p[0]*w, p[1]*w, p[2]*w ]
})

var cells = sc.skeleton(complex.cells, 2)

//Render the implicit surface to stdout
console.log('<svg xmlns="http://www.w3.org/2000/svg" width="512" height="512" version="1.1">')
console.log(require("svg-3d-simplicial-complex")(
  cells, 
  positions, {
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