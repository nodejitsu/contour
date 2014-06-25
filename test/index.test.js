describe('Contour', function () {
  'use strict';

  var Contour = require('../index')
    , Assets = require('../assets')
    , Pagelet = require('pagelet')
    , common = require('./common')
    , expect = common.expect
    , path = require('path')
    , fs = require('fs');

  it('is exposed as constructor', function () {
    var contour = new Contour;
    expect(Contour).to.be.a('function');
    expect(contour).to.be.instanceof(Contour);
  });

  it('is an eventemitter', function () {
    var contour = new Contour;
    expect(contour).to.have.property('_events');
  });

  it('has a proxy method to #get', function () {
    expect(Contour.get).to.be.an('function');
    expect(Contour.get).to.equal(new Contour().get);
  });

  it('has a reference to the available brands', function () {
    expect(Contour.prototype.available).to.be.an('array');
    expect(Contour.prototype.available).to.include('nodejitsu');
    expect(Contour.prototype.available).to.include('npm');
  });

  it('exposes the Assets constructor', function () {
    expect(Contour.prototype.Assets).to.be.an('function');
    expect(new Contour.prototype.Assets).to.be.instanceof(Assets);
  });

  describe('Constructor', function () {
    var contour;

    beforeEach(function () {
      contour = new Contour;
    });

    afterEach(function () {
      contour = null;
    });

    it('exposes Pagelets by file names', function () {
      var pagelets = fs.readdirSync('pagelets');

      pagelets.forEach(function checkFunction(file) {
        if ('.js' !== path.extname(file) || ~file.indexOf('pagelet')) return;
        file = path.basename(file, '.js');

        expect(contour).to.have.property(file);
        expect(new contour[file]).to.be.instanceof(Pagelet);
      });
    });

    it('switching brand change Pagelet branding', function () {
      var contour = new Contour({ brand: 'npm'});
      expect(contour.brand).to.equal('npm');
    });
  });

  describe('#get', function () {
    it('exposes the core stylus');
    it('defaults to the nodejitsu brand');
    it('can switch depending on brand');
    it('returns object with stylus file paths');
  });
});
