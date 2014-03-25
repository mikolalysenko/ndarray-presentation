"use strict"

function overlapAdd(frame_size, hop_size, onFrame) {
  if(hop_size > frame_size) {
    throw new Error("Hop size must be smaller than frame size")
  }
  var buffer = new Float32Array(2 * frame_size)
  var first_slice = buffer.subarray(0, frame_size)
  var second_slice = buffer.subarray(frame_size)
  var sptr = 0, eptr = 0
  return function processOverlapAdd(data) {
    var n = frame_size
    var i, j, k
    var B = buffer
    
    //Add data to frame
    k = eptr
    for(i=0, j=sptr; j<k && i<n; ++i, ++j) {
      B[j] += data[i]
    }
    for(; i<n; ++i, ++j) {
      B[j] = data[i]
    }
    sptr += hop_size
    eptr = j
    
    //Emit frame if necessary
    if(sptr >= frame_size) {
      onFrame(first_slice)
      first_slice.set(second_slice)
      sptr -= frame_size
      eptr -= frame_size
    }
  }
}

module.exports = overlapAdd