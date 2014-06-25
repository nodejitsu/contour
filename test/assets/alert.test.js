describe('Pagelet - Alert', function () {
  'use strict';

  var common = require('../common')
    , expect = common.expect
    , sinon = common.sinon;

  var Alert = require('../../pagelets/alert')
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
    expect(alert.defaults).to.have.property('text', '');
    expect(alert.defaults).to.have.property('type', 'notice');
    expect(alert.defaults).to.have.property('closable', false);
  });

  it('render will use data for the template', function (done) {
    Alert.brand().set({ text: 'Very fancy alert' }).render(function (err, content) {
      expect(err).to.equal(undefined);
      expect(content).to.include('pipe.arrive');
      expect(content).to.include('<code data-pagelet-fragment=');
      expect(content).to.include('</script>');
      expect(content).to.include('"mode":"html","rpc":[],"remove":false,"authorized":true,"');
      done();
    });
  });

  it('close functionality can be added which will enlist client-side JS', function (done) {
    Alert.brand().set({ closable: true }).render(function (err, content) {
      expect(err).to.equal(undefined);
      expect(content).to.include('<a href="#close" class="close">');
      expect(content).to.include('<s class="ss-icon ss-delete">');
      expect(alert.queue.store).to.have.property('loader');
      expect(alert.queue.store.loader.apps).to.include('alert');
      done();
    });
  });

  it('additional custom classes can be added', function (done) {
    Alert.brand().set({ class: 'row' }).render(function (err, content) {
      expect(err).to.equal(undefined);
      expect(content).to.include('class="alert alert-notice row"');
      done();
    });
  });
});