overlap-add
===========
Perform additive synthesis from a stream of frames.

## Install

    npm install overlap-add

#### `require("overlap-add")(frame_size, hop_size, ondata)`
Performs additive synthesis on a sequence of frames.

* `frame_size` is the size of each frame
* `hop_size` is the size of a hop between successive frames
* `ondata(frame)` is a callback that gets fired each time a frame is full

**Returns** A function that you can call to push a frame of data into the stream.

## Credits
(c) 2013 Mikola Lysenko. MIT License