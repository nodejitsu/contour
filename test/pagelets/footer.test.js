describe('Pagelet - Footer', function () {
  'use strict';

  var common = require('../common')
    , expect = common.expect
    , sinon = common.sinon;

  var Footer = require('../../pagelets/footer')
    , footer;

  beforeEach(function () {
    footer = new Footer;
  });

  afterEach(function () {
    footer = null;
  });

  it('is exposed as constructible and extendable Pagelet', function () {
    expect(Footer).to.be.a('function');
    expect(Footer.extend).to.be.a('function');
  });

  it('has set of defaults', function () {
    expect(footer.defaults).to.have.property('logo', true);
    expect(footer.defaults).to.have.property('copyright', '&copy; ' + new Date().getFullYear() + ' - Design by Nodejitsu Inc.');
    expect(footer.defaults).to.have.property('navigation');
    expect(footer.defaults.navigation).to.have.length(3);
  });

  it('has two child pagelets', function () {
    var pagelets = Object.keys(footer.pagelets);
    expect(pagelets).to.include('social');
    expect(pagelets).to.include('mailchimp');
    expect(pagelets).to.have.length(2);
  });

  it('has default link to status which is plain http', function () {
    var status = footer.defaults.navigation[2];

    expect(status).to.have.property('name', 'Resources');
    expect(status).to.have.property('links');
    expect(status.links).to.be.an('array');
    expect(status.links).to.have.length(1);
    expect(status.links[0]).to.have.property('href');
    expect(status.links[0]).to.have.property('target', '_blank');
    expect(status.links[0].href).to.include('status.nodejitsu.com');
    expect(status.links[0].href).to.not.include('https');
  });
});