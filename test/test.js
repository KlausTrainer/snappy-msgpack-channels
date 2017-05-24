var Lab = require('lab')
var lab = exports.lab = Lab.script()
var describe = lab.experiment
var it = lab.it
var Code = require('code')
var expect = Code.expect

var Channels = require('../')

describe('Channels', function () {
  var server
  var client

  describe('server', function () {
    it('can be created', function (done) {
      server = Channels.createServer()
      done()
    })
  })

  describe('client', function () {
    it('can be created', function (done) {
      client = Channels.createClient()
      done()
    })
  })

  describe('combined', function () {
    it('can be piped to each other', function (done) {
      client.pipe(server).pipe(client)
      done()
    })

    it('the client can request a channel and the server accept it', function (done) {
      server.once('request', function (req) {
        expect(req.payload).to.equal({yo: 'hey'})
        var serverStream = req.grant()
        serverStream.once('data', function (d) {
          expect(d).to.equal({first: 'message'})
          serverStream.once('end', done)
        })
      })

      client.channel({yo: 'hey'}, function (err, channel) {
        expect(err).to.equal(null)
        channel.end({first: 'message'})
      })
    })

    it('the client can request a channel and the server deny it', function (done) {
      server.once('request', function (req) {
        expect(req.payload).to.equal({yo: 'no'})
        req.deny('nope!')
      })

      client.channel({yo: 'no'}, function (err, channel) {
        expect(err).to.be.an.object()
        expect(err.message).to.equal('nope!')
        done()
      })
    })

    it('can handle the server injecting unwarrented connection', function (done) {
      server.createStream('hey')
      done()
    })
  })
})
