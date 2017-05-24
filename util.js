var snappyMsgpack = require('snappy-msgpack-stream')
var pumpify = require('pumpify')

module.exports.wrapStream = function (stream) {
  return pumpify.obj(
      snappyMsgpack.createEncodeStream(),
      stream,
      snappyMsgpack.createDecodeStream())
}
