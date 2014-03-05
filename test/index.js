var hipchat = require('..');
var assert = require('assert');
var from = require('from');
var nock = require('nock');

describe('hipchat()', function() {
  var stream;
  var readable;

  beforeEach(function() {
    stream = hipchat('your auth token', 'room ID', 'from', {
      // HipChat API parameters
    });

    readable = from(['baa', 'baa', 'baa']);

    nock('https://api.hipchat.com')
      .post('/v1/rooms/message?auth_token=your%20auth%20token')
      .times(3)
      .reply(200, {
        status: 'sent'
      });
  });

  it('should work well', function(done) {
    var res = [];
    readable
      .pipe(stream)
      .on('data', function(chunk) {
        res.push(chunk);
      })
      .on('end', function() {
        assert(res.length, 3);
        done();
      });
  });
});
