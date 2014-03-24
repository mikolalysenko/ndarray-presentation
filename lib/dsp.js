"use strict"

var pool = require("typedarray-pool")
var pitchShift = require("pitch-shift")

//Init web audio
var context
if (typeof AudioContext !== "undefined") {
  context = new AudioContext();
} else if (typeof webkitAudioContext !== "undefined") {
  context = new webkitAudioContext();
} else {
  throw new Error("No WebAudio!")
}

var playing = false
var createSource = null
var curSource = null
var scaleFactor = 1.0

var pitchShifter = createProcessingNode(context)
var pausePlay = document.getElementById("audio-play-button")
var stretchFactor = document.getElementById("audio-stretch-factor")

function createProcessingNode(context) {
  var queue = []
  var frame_size = 1024
  var hop_size = 256
  
  var shifter = pitchShift(function(data) {
    var buf = pool.mallocFloat32(data.length)
    buf.set(data)
    queue.push(buf)
  }, function(t, pitch) {
    return scaleFactor
  }, {
    frameSize: frame_size,
    hopSize: hop_size
  })

  //Enque some garbage to buffer stuff
  shifter(new Float32Array(frame_size))
  shifter(new Float32Array(frame_size))
  shifter(new Float32Array(frame_size))
  shifter(new Float32Array(frame_size))
  shifter(new Float32Array(frame_size))
  
  //Create a script node
  var scriptNode = context.createScriptProcessor(frame_size, 1, 1)
  scriptNode.onaudioprocess = function(e){
    shifter(e.inputBuffer.getChannelData(0))
    var out = e.outputBuffer.getChannelData(0)
    var q = queue[0]
    queue.shift()
    out.set(q)
    pool.freeFloat32(q)
  }
  
  return scriptNode
}

function createFileSource(buf) {
  var ret = context.createBufferSource()
  ret.buffer = buf
  return ret
}

//Load audio file
function loadFile(url) {
  var request = new XMLHttpRequest();
  request.open('GET', url, true);
  request.responseType = 'arraybuffer';
  request.onload = function() {
    context.decodeAudioData(request.response, function(buffer) {
      createSource = createFileSource.bind(undefined, buffer)
    }, function(err) {
      console.error("Error loading file", url, ":", err)
    })
  }
  request.send()
}
loadFile("audio/gettysburg.mp3")

function togglePlaying() {
  if(!createSource) {
    return
  }
  if(playing) {
    curSource.disconnect(0)
    pitchShifter.disconnect(0)
    curSource.stop(0)
    playing = false
    pausePlay.className = "play"
  } else {
    curSource = createSource()
    curSource.connect(pitchShifter)
    pitchShifter.connect(context.destination)
    curSource.loop = true
    curSource.start(0)
    playing = true
    pausePlay.className = "pause"
  }
}

pausePlay.addEventListener("click", togglePlaying)

stretchFactor.addEventListener("change", function() {
  scaleFactor = Math.exp(+stretchFactor.value)
})

Reveal.addEventListener("slidechanged", function() {
  if(playing) {
    togglePlaying()
  }
})