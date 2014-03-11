describe('Assets', function () {
  'use strict';

  var common = require('../common')
    , Pagelet = require('pagelet')
    , expect = common.expect
    , sinon = common.sinon
    , fs = require('fs')
    , path = require('path');

  describe('alert', function () {
    var Alert = require('../../assets/nodejitsu/alert')
      , alert;

    beforeEach(function () {
      alert = new Alert({ });
    });

    afterEach(function () {
      alert = null;
    });

    it('is exposed as constructable and extenable Pagelet', function () {
      expect(Alert).to.be.a('function');
      expect(Alert.extend).to.be.a('function');
    });

    it('can be extended upon');

    it('has set of defaults', function () {
      expect(alert).to.have.property('text', '');
      expect(alert).to.have.property('type', 'notice');
      expect(alert).to.have.property('closable', false);
    });

    it('#render will return rendered template', function () {
      console.log(alert.render());
    });
  });
});

