'use strict';

var chai = require('chai')
  , sinon = require('sinon')
  , sinonChai = require('sinon-chai')
  , fs = require('fs')
  , path = require('path')
  , fixtures = {};

chai.use(sinonChai);
chai.Assertion.includeStack = true;

fs.readdirSync(__dirname + '/fixtures/pagelets').forEach(function each(file) {
  if (!~file.indexOf('.html')) return;
  fixtures[path.basename(file, '.html')] = fs.readFileSync(
    __dirname +'/fixtures/pagelets/'+ file,
    'utf-8'
  ).trim();
});

//
// Expose our assertations.
//
exports.expect = chai.expect;
exports.sinon = sinon;
exports.fixtures = fixtures;