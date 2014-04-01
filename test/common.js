'use strict';

var chai = require('chai')
  , sinon = require('sinon')
  , sinonChai = require('sinon-chai')
  , fs = require('fs')
  , path = require('path')
  , fixtures = {};

chai.use(sinonChai);
chai.Assertion.includeStack = true;

fs.readdirSync(__dirname + '/fixtures/assets').forEach(function each(file) {
  if (!~file.indexOf('.html')) return;
  fixtures[path.basename(file, '.html')] = fs.readFileSync(
    __dirname +'/fixtures/assets/'+ file,
    'utf-8'
  ).trim();
});

//
// Expose our assertations.
//
exports.expect = chai.expect;
exports.sinon = sinon;
exports.fixtures = fixtures;

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