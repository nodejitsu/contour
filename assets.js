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
  options = options || Object.create(null);
  this.fuse();

  var enumerable = Assets.predefine(this, { configurable: false })
    , standalone = options.mode === 'standalone'
    , self = this;

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

    //
    // Replace paths in views, css, js and dependencies.
    //
    async.each(['dependencies', 'view', 'css', 'js'], function brander(property, next) {
      var value = Array.isArray(prototype[property])
        ? prototype[property]
        : [prototype[property]];

      async.map(value.filter(Boolean), function each(file, fn) {
        var branded = file.replace('{{brand}}', options.brand);

        fs.exists(branded, function exist(exists) {
          if (exists) return fn(null, branded);

          //
          // Resolve the path against the pagelet map and check again.
          //
          branded = path.join(__dirname, 'pagelets', branded);
          fs.exists(branded, function exist(exists) {
            fn(null, exists ? branded : file.replace('{{brand}}', 'nodejitsu'));
          });
        });
      }, function mapped(error, result) {
        if (error) return next(error);

        prototype[property] = result.length === 1 ? result[0] : result;
        next();
      });
    }, function branded(error) {
      done(error, Pagelet);
    });
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