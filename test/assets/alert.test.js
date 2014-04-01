describe('Assets', function () {
  'use strict';

  var common = require('../common')
    , fixtures = common.fixtures
    , expect = common.expect
    , sinon = common.sinon;

  describe('alert', function () {
    var Alert = require('../../assets/nodejitsu/alert')
      , alert;

    beforeEach(function () {
      alert = new Alert;
    });

    afterEach(function () {
      alert = null;
    });

    it('is exposed as constructable and extenable Pagelet', function () {
      expect(Alert).to.be.a('function');
      expect(Alert.extend).to.be.a('function');
    });

    it('has set of defaults', function () {
      expect(alert.data).to.have.property('text', '');
      expect(alert.data).to.have.property('type', 'notice');
      expect(alert.data).to.have.property('closable', false);
    });

    it('render will use data for the template', function (done) {
      alert.set({ text: 'Very fancy alert' }).render(function (err, content) {
        expect(err).to.equal(undefined);
        expect(content).to.equal(fixtures.alert);
        done();
      });
    });

    it('close functionality can be added which will enlist client-side JS', function (done) {
      alert.set({ closable: true }).render(function (err, content) {
        expect(err).to.equal(undefined);
        expect(content).to.include('<a href="#close" class="close">');
        expect(content).to.include('<s class="ss-icon ss-delete">');
        expect(alert.queue.store).to.have.property('loader');
        expect(alert.queue.store.loader.custom).to.include('alert');
        done();
      });
    });

    it('additional custom classes can be added', function (done) {
      alert.set({ class: 'row' }).render(function (err, content) {
        expect(err).to.equal(undefined);
        expect(content).to.include('class="alert alert-notice row"');
        done();
      });
    });
  });
});