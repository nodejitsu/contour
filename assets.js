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
 * @param {String} brand nodejitsu by default.
 * @param {String} mode standalone || bigpipe, defaults to bigpipe.
 * @api public
 */
function Assets(brand, mode) {
  var readable = Assets.predefine(this, Assets.predefine.READABLE)
    , enumerable = Assets.predefine(this, { configurable: false })
    , self = this
    , i = 0
    , files;

  /**
   * Callback to emit optimized event after all Pagelets have been optimized.
   *
   * @param {Error} error
   * @api private
   */
  function next(error) {
    if (error) return self.emit('error', error);
    if (++i === files.length) self.emit('optimized');
  }

  //
  // Default framework to use with reference to the path to core.styl.
  //
  readable('brand', brand = brand || 'nodejitsu');

  //
  // Load all assets of the branch.
  //
  (files = fs.readdirSync(assets)).forEach(function include(file) {
    if ('.js' !== path.extname(file) || ~file.indexOf('pagelet')) return;

    //
    // Create getter for each pagelet in assets.
    //
    var Pagelet = require(path.join(assets, file));
    enumerable(path.basename(file, '.js'), {
      enumerable: true,
      value: Pagelet.brand(self.brand, mode === 'standalone', next)
    }, true);
  });
}

//
// Expose the collection.
//
module.exports = fuse(Assets, require('events').EventEmitter);