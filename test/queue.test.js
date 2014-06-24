describe('Queue', function () {
  'use strict';

  var common = require('./common')
    , expect = common.expect
    , sinon = common.sinon;

  var Queue = require('../queue')
    , queue;

  beforeEach(function () {
    queue = new Queue;
  });

  afterEach(function () {
    queue = null;
  });

  it('exposes a constructor');
  it('keeps track of stored data');

  describe('#enlist', function () {
    it('is a function');
    it('stores data by type for use in another template');
    it('mixes data with already stored data');
  });

  describe('#discharge', function () {
    it('is a function');
    it('reads data from store for single use');
    it('deletes data from store');
  });
});