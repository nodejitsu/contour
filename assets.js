'use strict';

//
// Required modules.
//
var fuse = require('fusing')
  , async = require('async')
  , path = require('path')
  , fs = require('fs');

//
// Base path for assets.
//
var assets = path.join(__dirname, 'pagelets');

/**
 * Create new collection of assets from a specific brand.
 *
 * Options that can be supplied
 *  - brand {String} framework or brand to use, e.g nodejitsu or opsmezzo
 *  - pipe {BigPipe} bigpipe instance
 *
 * @api public
 */
function Assets(options) {
  var readable = Assets.predefine(this, Assets.predefine.READABLE)
    , enumerable = Assets.predefine(this, { configurable: false })
    , standalone = options.mode === 'standalone'
    , self = this;

  /**
   * Return a mapping function with preset brand, will default to nodejitsu files if
   * the requested branded file does not exist.
   *
   * @todo, make call async
   *
   * @param {String} brand
   * @returns {Function} mapper
   * @api private
   */
  function brander(file) {
    var branded = file.replace('{{brand}}', options.brand);
    return fs.existsSync(branded) ? branded : file.replace('{{brand}}', 'nodejitsu');
  }

  //
  // Hook into the before emit of optimize, this allows changing properties
  // of the pagelet before it is constructed.
  //
  options.pipe.on('transform:pagelet:before', function brand(Pagelet, done) {
    var prototype = Pagelet.prototype;

    //
    // Not a contour Pagelet so do not transform properties, return early.
    //
    if (!prototype.contour) return done(null, Pagelet);

    //
    // Set the fragment such that only the template is rendered.
    //
    prototype.fragment = standalone ? '{pagelet:template}' : prototype.fragment;
    prototype.view = brander(prototype.view);

    //
    // Replace paths in CSS, JS and dependencies.
    //
    if (Array.isArray(prototype.css)) {
      prototype.css = prototype.css.map(brander);
    }

    if (Array.isArray(prototype.js)) {
      prototype.js = prototype.js.map(brander);
    }

    if (Array.isArray(prototype.dependencies)) {
      prototype.dependencies = prototype.dependencies.map(brander);
    }

    return done(null, Pagelet);
  });

  //
  // Load all assets of the branch.
  //
  fs.readdirSync(assets).forEach(function include(file) {
    if ('.js' !== path.extname(file) || ~file.indexOf('pagelet')) return;

    //
    // Create getter for each pagelet in assets.
    //
    var Pagelet = require(path.join(assets, file));
    enumerable(path.basename(file, '.js'), {
      enumerable: true,
      value: Pagelet
    }, true);
  });
}

//
// Expose the collection.
//
module.exports = fuse(Assets, require('events').EventEmitter);