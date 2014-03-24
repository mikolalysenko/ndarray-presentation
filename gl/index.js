"use strict"

var shell = require("gl-now")({ clearColor: [0,0,0,0] })
var camera = require("game-shell-orbit-camera")(shell)

var currentState = "none"
var states = {
  "none": require("./base.js"),
  "scivis": require("./scivis.js")
}

function switchState(nextState) {
  if(nextState === currentState) {
    return
  }
  states[currentState].hide()
  currentState = nextState
  states[currentState].show()
}

window.addEventListener("message", function(event) {
  switchState(event.data)
}, false)

shell.on("gl-init", function() {
  for(var id in states) {
    states[id].init(shell, camera)
  }
  console.log("initialize")
})

shell.on("gl-render", function(dt) {
  states[currentState].render(dt)
})

shell.on("tick", function() {
  states[currentState].tick()
})
