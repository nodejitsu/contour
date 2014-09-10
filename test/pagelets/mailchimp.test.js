describe('Pagelet - Mailchimp', function () {
  'use strict';

  var common = require('../common')
    , expect = common.expect
    , sinon = common.sinon;

  var Mailchimp = require('../../pagelets/mailchimp')
    , mailchimp;

  beforeEach(function () {
    mailchimp = new Mailchimp;
  });

  afterEach(function () {
    mailchimp = null;
  });

  it('is exposed as constructible and extendable Pagelet', function () {
    expect(Mailchimp).to.be.a('function');
    expect(Mailchimp.extend).to.be.a('function');
  });

  it('has set of defaults', function () {
    expect(mailchimp.defaults).to.have.property('action', '//nodejitsu.us2.list-manage.com/subscribe/post');
    expect(mailchimp.defaults).to.have.property('u', 'e4a7e45f759ae0d449c3ba923');
    expect(mailchimp.defaults).to.have.property('id', '31f76174d4');
  });

  it('has action without specified protocol', function () {
    expect(mailchimp.defaults.action).to.not.include('http');
    expect(mailchimp.defaults.action).to.not.include('https');
  });
});