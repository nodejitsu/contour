describe('Pagelet', function () {
  'use strict';

  var common = require('../common')
    , expect = common.expect
    , sinon = common.sinon;

  var Pagelet = require('../../pagelets/pagelet')
    , pagelet;

  beforeEach(function () {
    pagelet = new Pagelet;
  });

  afterEach(function () {
    pagelet = null;
  });

  it('is exposed as constructable and extenable base Pagelet');
});