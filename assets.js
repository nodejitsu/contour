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
 * @param {String} mode standalone || bigpipe, defaults to bigpipe
 * @api public
 */
function Assets(brand, mode) {
  var readable = Assets.predefine(this, Assets.predefine.READABLE)
    , enumerable = Assets.predefine(this, { configurable: false })
    , self = this;

  //
  // Maintain stack of loaded pagelets.
  //
  readable('stack', {});

  //
  // Default framework to use with reference to the path to core.styl.
  //
  readable('brand', brand = brand || 'nodejitsu');

  //
  // Load all assets of the branch.
  //
  fs.readdirSync(assets).forEach(function include(file) {
    if ('.js' !== path.extname(file) || ~file.indexOf('pagelet')) return;

    var name = path.basename(file, '.js');
    self.stack[name] = require(path.join(assets, file)).brand(brand);

    //
    // Create getter for each pagelet in assets.
    //
    enumerable(name, {
      enumerable: true,
      value: mode === 'bigpipe'
        ? self.stack[name]
        : (new self.stack[name]).standalone
    }, true);
  });
}

//
// Expose the collection.
//
module.exports = fuse(Assets);