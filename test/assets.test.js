describe('Assets', function () {
  'use strict';

  var common = require('./common')
    , expect = common.expect
    , sinon = common.sinon;

  var Assets = require('../assets')
    , assets;

  beforeEach(function () {
    assets = new Assets;
  });

  afterEach(function () {
    assets = null;
  });

  it('exposes a constructor');
  it('can brand pagelets');
  it('returns collection of Pagelets');
  it('defaults to nodejitsu brand if file does not exist');
  it('defaults to mode `bigpipe`');
});