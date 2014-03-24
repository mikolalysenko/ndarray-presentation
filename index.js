"use strict"

var detach = require("remove-element")
var glIframe = document.createElement("iframe")
glIframe.setAttribute("src", "gl/index.html")

Reveal.addEventListener("slidechanged", function(event) {
  var prevContainer = event.previousSlide.querySelector(".glcontainer")
  if(prevContainer) {
    glIframe.contentWindow.postMessage(JSON.stringify({
      "event": "hide",
      "class": Array.prototype.join.call(event.previousSlide.classList)
    }), "*")
    detach(glIframe)
  }
  var nextContainer = event.currentSlide.querySelector(".glcontainer")
  if(nextContainer) {
    glIframe.width = nextContainer.clientWidth
    glIframe.height = nextContainer.clientHeight
    nextContainer.appendChild(glIframe)
    glIframe.contentWindow.postMessage(JSON.stringify({
      "event": "show",
      "class": Array.prototype.join.call(event.currentSlide.classList)
    }), "*")
  }
})

Reveal.initialize({})