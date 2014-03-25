"use strict";

var arraytools  = function () {

  var that = {}

  function isObj (v) {
    return (v != null) && (typeof v === 'object') && !Array.isArray(v)
  }

  function linspace (start, end, num) {
    var inc = (end - start) / (num - 1)
    var a = []
    for( var ii = 0; ii < num; ii++)
      a.push(start + ii*inc)
    return a
  }

  function zip3 (a, b, c) {
      var len = Math.min.apply(null, [a.length, b.length, c.length])
      var result = []
      for (var n = 0; n < len; n++) {
          result.push([a[n], b[n], c[n]])
      }
      return result
  }

  function sum (A) {
    var acc = 0
    accumulate(A, acc)
    function accumulate(x) {
      for (var i = 0; i < x.length; i++) {
        if (Array.isArray(x[i]))
          accumulate(x[i], acc)
        else
          acc += x[i]
      }
    }
    return acc
  }



  that.isObj = isObj
  that.linspace = linspace
  that.zip3 = zip3
  that.sum = sum

  return that

}


module.exports = arraytools()