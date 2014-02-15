'use strict';

var chai = require('chai')
  , sinon = require('sinon')
  , sinonChai = require('sinon-chai');

chai.use(sinonChai);
chai.Assertion.includeStack = true;

//
// Expose our assertations.
//
exports.expect = chai.expect;
exports.sinon = sinon;

//
// Expose a port number generator.
//
var file = '/tmp/square{d}.json'
  , n = 0;

Object.defineProperty(exports, 'file', {
  get: function get() {
    return file.replace('{d}', n++);
  }
});