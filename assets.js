'use strict';

//
// Required modules.
//
var fuse = require('fusing')
  , path = require('path')
  , fs = require('fs');

//
// Base path for assets.
//
var assets = path.join(__dirname, 'assets');

/**
 * Create new collection of assets from a specific brand.
 *
 * @param {String} brand nodejitsu by default.
 * @api public
 */
function Assets(brand) {
  var readable = Assets.predefine(this, Assets.predefine.READABLE)
    , enumerable = Assets.predefine(this, { configurable: false });

  //
  // Default framework to use.
  //
  readable('brand', brand = brand || 'nodejitsu');

  //
  // Load all assets of the branch.
  //
  fs.readdirSync(assets).forEach(function include(pagelet) {
    if ('.js' !== path.extname(pagelet) || ~pagelet.indexOf('pagelet')) return;

    enumerable(path.basename(pagelet, '.js'), {
      enumerable: true,
      get: function get() {
        return (require(path.join(assets, pagelet))).brand(brand);
      }
    }, true);
  });
}

//
// Expose the collection.
//
module.exports = fuse(Assets);