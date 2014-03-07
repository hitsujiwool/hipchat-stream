
var https = require('https');
var qs = require('querystring');
var through = require('through');

var agent = new https.Agent({ maxSockets: 1 });

module.exports = function(token, room, from, opts) {
  var currentReq;

  function error(message) {
    return JSON.stringify({
      status: 'error',
      message: 'failed to post: ' + message
    });
  }

  return through(function(chunk) {
    var that = this;
    var req = https.request({
      hostname: 'api.hipchat.com',
      path: '/v1/rooms/message?' + qs.stringify({ auth_token: token }),
      method: 'POST',
      agent: agent,
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded'
      }
    });

    var params = {
      room_id: room,
      from: from,
      message: chunk.toString()
    };

    for (var key in opts) {
      params[key] = opts[key];
    }

    this.pause();

    req.on('response', function(res) {
      var buffer = [];
      res.on('data', function(chunk) {
        buffer.push(chunk);
      });
      res.on('end', function() {
        currentReq = null;
        that.queue(buffer.join(''));
        that.resume();
      });
    });

    req.on('error', function(e) {
      that.queue(error(chunk));
    });

    try {
      req.end(qs.stringify(params));
      currentReq = req;
    } catch (e) {
      that.queue(error(chunk));
    }

  }, function() {
    // stream.end()が呼ばれた際には即座にthis.queue(null)するのではなく、今リクエスト中の結果を待つ
    var that = this;
    if (currentReq) {
      currentReq.on('response', function(res) {
        res.on('end', function() {
          that.queue(null);
        });
      });
    } else {
      this.queue(null);
    }
  });
};
