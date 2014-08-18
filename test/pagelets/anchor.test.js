describe('Pagelet - Anchor', function () {
  'use strict';

  var common = require('../common')
    , expect = common.expect
    , sinon = common.sinon;

  var Anchor = require('../../pagelets/anchor')
    , anchor;

  beforeEach(function () {
    anchor = new Anchor;
  });

  afterEach(function () {
    anchor = null;
  });

  it('is exposed as constructable and extenable Pagelet', function () {
    expect(Anchor).to.be.a('function');
    expect(Anchor.extend).to.be.a('function');
  });

  it('has set of defaults', function () {
    expect(anchor.defaults).to.have.property('href', '#');
    expect(anchor.defaults).to.have.property('class', '');
    expect(anchor.defaults).to.have.property('text', 'I scroll down, I hate jumping');
  });

  it('render will use defaults and data for the template', function (done) {
    Anchor.brand().set({ text: 'Changed message' }).render(function (err, content) {
      expect(err).to.equal(undefined);
      expect(content).to.include('pipe.arrive');
      expect(content).to.include('<code data-pagelet-fragment=');
      expect(content).to.include('</script>');
      expect(content).to.include('"mode":"html","rpc":[],"remove":false,"authorized":true,"');
      expect(content).to.include('<a href="#" class="" data-scroll>\n  Changed message\n</a>');
      done();
    });
  });

  it('will enlist the client-side JS', function (done) {
    Anchor.brand().set({}).inject(function (err, content) {
      expect(err).to.equal(undefined);
      expect(content).to.include('<a href="#" class=""');
      expect(anchor.queue.store).to.have.property('loader');
      expect(anchor.queue.store.loader.apps).to.include('anchor');
      done();
    });
  });

  it('additional custom classes can be added', function (done) {
    Anchor.brand().set({ class: 'row' }).render(function (err, content) {
      expect(err).to.equal(undefined);
      expect(content).to.include('class="row"');
      done();
    });
  });
});