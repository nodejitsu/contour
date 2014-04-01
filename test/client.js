'use strict';

//
// Setup a server.
//
var http = require('http').createServer().listen(4000, '127.0.0.1', function listening() {
  console.log('Test server running on port 4000');
});