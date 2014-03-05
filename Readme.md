# hipchat-stream

stream interface for [HipChat API](https://www.hipchat.com/docs/api/), specialized for message posting

## Installation

`$ npm install hipchat-stream`

## Usage

As far we support only `/rooms/message`.

`hipchat()` returns a tramsform stream (based on Stream1) which accepts a flow of string to be post, and outputs a flow of string API response.

```javascript
var hipchat = require('hipchat-stream');
var from = require('from');

var stream = hipchat('your auth token', 'room ID', 'from', {
  // other optional parameters (e.g. color, notify)
}

var readable = from(['this', 'is', 'a', 'readable', 'stream']);

from.pipe(hipchat).pipe(process.stdout) // {"status":"sent"}{"status:"sent"} ...
```

## License

MIT
