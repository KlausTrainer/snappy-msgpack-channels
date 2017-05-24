var multiplex = require('multiplex')
var timers = require('timers')

var wrapStream = require('./util').wrapStream

module.exports = function createClient () {
  var waitingChannels = {}

  var multiplexStream = multiplex(onConnection)

  multiplexStream.channel = channel

  return multiplexStream

  function channel (payload, cb) {
    var negotiationStream = wrapStream(multiplexStream.createStream())

    negotiationStream.once('data', onNegotiationReply)
    negotiationStream.write(payload)

    function onNegotiationReply (reply) {
      var err = reply[0]
      var channelId = reply[1]
      if (err) {
        cb(err)
      } else {
        var channel = waitingChannels[channelId]
        /* istanbul ignore else */
        if (channel) {
          delete waitingChannels[channelId]
          timers.setImmediate(cb, null, channel)
        } else {
          waitForChannel(channelId, cb)
        }
      }
    }
  }

  function onConnection (channel, channelId) {
    var cb = waitingChannels[channelId]
    /* istanbul ignore if */
    if (cb) {
      delete waitingChannels[channelId]
      timers.setImmediate(cb, null, wrapStream(channel))
    } else {
      waitForChannel(channelId, wrapStream(channel))
    }
  }

  function waitForChannel (channelId, connection) {
    waitingChannels[channelId] = connection
  }
}
