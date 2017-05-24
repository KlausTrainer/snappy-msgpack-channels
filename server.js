var multiplex = require('multiplex')

var wrapStream = require('./util').wrapStream

module.exports = function createChannel () {
  var multiplexStream = multiplex(onConnection)

  return multiplexStream

  function onConnection (negotiationChannel, channelId) {
    var negotiationStream = wrapStream(negotiationChannel)

    negotiationStream.once('data', onChannelRequest)
    negotiationStream.once('error', warnError)

    function onChannelRequest (payload) {
      var request = {
        payload: payload,
        grant: grant,
        deny: deny
      }

      multiplexStream.emit('request', request)
    }

    function grant () {
      negotiationStream.end([null, channelId])
      return wrapStream(multiplexStream.createStream(channelId))
    }

    function deny (cause) {
      negotiationStream.end([{message: cause}])
    }
  }
}

/* istanbul ignore next */
function warnError (err) {
  var log = (console.warn || console.error || console.log).bind(console)
  log(err.stack || err.message || err)
}
