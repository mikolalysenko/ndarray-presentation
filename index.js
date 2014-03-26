"use strict"

var detach = require("remove-element")
var glIframe = document.createElement("iframe")
glIframe.setAttribute("src", "gl/webgl.html")
glIframe.style.display = "none"
glIframe.style.visibility = "hidden"
glIframe.style.position = "absolute"
glIframe.style.top = "0px"
glIframe.style.bottom = "0px"
glIframe.style.left = "0px"
glIframe.style.right = "0px"
glIframe.style.border = "0px"
document.body.appendChild(glIframe)

//Run scripts from different frames
require("./lib/image-processing.js")
require("./lib/dsp.js")
require("./lib/pde.js")
require("./lib/slice-demo.js")
require("./lib/bwt.js")

function getTag(list) {
  for(var i=0; i<list.length; ++i) {
    if(list[i].indexOf("slide-") === 0) {
      return list[i].substr(6)
    }
  }
  return "none"
}

//Reveal.js interface
Reveal.addEventListener("slidechanged", function(event) {
  if(event.previousSlide) {
    var prevContainer = event.previousSlide.querySelector(".glcontainer")
    if(prevContainer) {
      glIframe.contentWindow.postMessage("none", "*")
      glIframe.style.display = "none"
      glIframe.style.visibility = "hidden"
    }
  }
  if(event.currentSlide) {
    var nextContainer = event.currentSlide.querySelector(".glcontainer")
    if(nextContainer) {
      glIframe.style.display = "block"
      glIframe.style.visibility = "visible"
      glIframe.width = window.innerWidth
      glIframe.height = window.innerHeight
      glIframe.contentWindow.postMessage(getTag(event.currentSlide.classList), "*")
    }
  }
})
Reveal.initialize({
  width: 1024,
  height: 768,
  slideNumber: true,
  history: true
})