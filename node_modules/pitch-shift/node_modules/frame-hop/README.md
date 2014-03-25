frame-hop
=========
Cuts a stream of floating point frames into a stream of partially overlapping frames.

## Example

```javascript
//Create frame slicer
var slicer = require("frame-hop")(256, 64, function(frame) {
  console.log("Got a frame!", frame)
})

//Add frames to slices by calling slicer:
slicer(data)
```

## Install

    npm install frame-hop

#### `require("frame-hop")(frame_size, hop_size, ondata[, max_data_size])`
Creates a windowed frame slicer

* `frame_size` is the size of an output frame
* `hop_size` is the amount of hopping between frames
* `ondata(frame)` is a callback that executed once per each frame that is sliced
* `max_data_size` is the maximum amount of data per input frame (default `frame_size`)

**Returns** A function `slicer(data)` which adds some amount of data to the rolling frame buffer.

## Credits
(c) 2013 Mikola Lysenko. MIT License
