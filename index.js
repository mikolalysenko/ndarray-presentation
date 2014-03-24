"use strict"

var detach = require("remove-element")
var glIframe = document.createElement("iframe")

Reveal.addEventListener("slidechanged", function(event) {
  var prevContainer = event.previousSlide.querySelector(".glcontainer")
  if(prevContainer) {
    glIframe.contentWindow.postMessage(JSON.stringify({
      "event": "hide",
      "class": event.previousSlide.attr("class")
    }, "*")
    detach(demoIframe)
  }
  var nextContainer = event.currentSlide.querySelector(".glcontainer")
  if()

})


Reveal.initialize({})