# snappy-msgpack-channels

[![Build Status](https://travis-ci.org/KlausTrainer/snappy-msgpack-channels.svg?branch=main)](https://travis-ci.org/KlausTrainer/snappy-msgpack-channels)
[![JavaScript Style Guide](https://img.shields.io/badge/code%20style-standard-brightgreen.svg)](http://standardjs.com/)
[![semantic-release](https://img.shields.io/badge/%20%20%F0%9F%93%A6%F0%9F%9A%80-semantic--release-e10079.svg)](https://github.com/semantic-release/semantic-release)

Multiplexed negotiated streams of framed Snappy-compressed MessagePack messages.

## Usage

### Server

```js
var snappyChannels = require('snappy-msgpack-channels');
var server = snappyChannels.createServer();

// listen for new channel requests
server.on('request', function(req) {
  // req.payload can be arbitrary values passed in by the client
  if (req.payload.token == '1234') {
    req.grant(); // grant the channel
  } else {
    req.deny('access denied'); // deny the channel
  }
});
```

### Client

```js
var snappyChannels = require('snappy-msgpack-channels');
var client = snappyChannels.createClient();

// ask for a channel, passing in any arbitrary payload
client.channel({token: '1234'}, function(err, channel) {
  if (err) {
    console.error('could not get a channel because', err.message);
  } else {
    channel.write({hello: 'world'});
  }
});
```

## Acknowledgments ##

snappy-msgpack-channels has been heavily inspired by:

* [pipe-channels](https://github.com/pgte/pipe-channels) by Pedro Teixeira

## License

ISC
