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

  it('is exposed as constructible and extendable base Pagelet', function () {
    var test = new (Pagelet.extend({ additional: 'property' }));

    expect(Pagelet).to.be.a('function');
    expect(Pagelet.extend).to.be.a('function');
    expect(test).to.be.instanceof(Pagelet);
    expect(test).to.have.property('additional', 'property');
  });
});