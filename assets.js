'use strict';

//
// Required modules.
//
var path = require('path')
  , fs = require('fs');

/**
 * Create new collection of assets from a specific brand.
 *
 * @param {String} brand ndodejitsu brand of your liking
 * @api public
 */
module.exports = function Assets(brand) {
  var collection = this;

  //
  // Default framework to use.
  //
  collection.brand = brand || 'nodejitsu';

  //
  // Load all assets of the branch.
  //
  fs.readdirSync(__dirname + '/assets').forEach(function include(file) {
    if ('.js' !== path.extname(file)) return;

    Object.defineProperty(collection, path.basename(file, '.js'), {
      value: require('./assets/' + file)[collection.brand || 'nodejitsu'],
      writable: false
    });
  });
};
