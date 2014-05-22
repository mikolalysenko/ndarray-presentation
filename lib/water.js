"use strict"

var cwise = require("cwise")

var waterUpdate = cwise({
  args: [ "array", 
          {offset: [-1, 0], array:0}, 
          {offset: [ 1, 0], array:0},
          {offset: [ 0,-1], array:0},
          {offset: [ 0, 1], array:0},
          "scalar" ],
  body: function(center, left, right, down, up, flow) {

  }

})