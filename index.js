'use strict';

var fuse = require('fusing')
  , path = require('path')
  , fs = require('fs');

//
// Defaults.
//
var Assets = require('./assets')
  , available = [ 'nodejitsu', 'npm' ];

/**
 * Contour will register several default HTML5 templates of Nodejitsu. These
 * templates can used from inside views of other projects.
 *
 * Options that can be supplied
 *  - brand {String} framework or brand to use, e.g nodejitsu or opsmezzo
 *  - mode {String} bigpipe or standalone, defaults to bigpipe
 *
 * @Constructor
 * @param {Object} options optional, see above
 * @api public
 */
function Contour(options) {
  this.fuse();

  //
  // Add the pagelets of the required framework.
  //
  options = options || {};
  this.mixin(this, new Assets(options.brand, options.mode || 'bigpipe'));
}

//
// Add EventEmitter and Predefine functionality.
//
fuse(Contour, require('events').EventEmitter);

/**
 * Small helper function that exposes the core per brand.
 *
 * @param {String} brand available brands
 * @return {String} path to the core stylus file
 * @api public
 */
Contour.get = function get(brand) {
  if (!~available.indexOf(brand)) brand = 'nodejitsu';
  var base = path.join(__dirname, 'pagelets', brand);

  return fs.readdirSync(base).reduce(function reduce(memo, file) {
    if ('.styl' !== path.extname(file)) return memo;

    memo[path.basename(file, '.styl')] = path.join(base, file);
    return memo;
  }, { js: path.join(base, 'core.js') });
};

//
// Proxy method to get.
//
Contour.readable('get', Contour.get);

//
// Expose the brands that are available.
//
Contour.readable('available', available);

//
// Expose the Assets constructor.
//
Contour.readable('Assets', Assets);

//
// Expose constructor.
//
module.exports = Contour;