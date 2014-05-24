# wrap-stream [![unstable](http://hughsk.github.io/stability-badges/dist/unstable.svg)](http://github.com/hughsk/stability-badges) #

Wrap the output of a stream with a prefix and/or suffix.

## Usage ##

[![wrap-stream](https://nodei.co/npm/wrap-stream.png?mini=true)](https://nodei.co/npm/wrap-stream)

### `wrap(pre, post)` ###

Returns a through stream that adds `pre` before any other output and `post`
after calling `stream.end()`.

``` javascript
var wrap = require('wrap-stream')
var fs = require('fs')

fs.createReadStream(__filename)
  .pipe(wrap('hello', 'world'))
  .pipe(process.stdout)
```

If you'd prefer not to use either of `pre` or `post`, just pass `null` in its
place.

``` javascript
var wrap = require('wrap-stream')
var fs = require('fs')

fs.createReadStream(__filename)
  .pipe(wrap(null, 'lorem ipsum'))
  .pipe(process.stdout)
```

## License ##

MIT. See [LICENSE.md](http://github.com/hughsk/wrap-stream/blob/master/LICENSE.md) for details.
