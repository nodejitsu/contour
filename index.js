'use strict';

//
// Native modules.
//
var path = require('path')
  , fs = require('fs');

//
// Third-party modules.
//
var async = require('async')
  , fuse = require('fusing')
  , ejs = require('ejs')
  , cheerio = require('cheerio')
  , md = require('marked')
  , queue = require('./queue');

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
 * Include a template, data will be run through #supplier.
 *
 * @param {String} filename template
 * @param {Object} data additional data
 * @param {Boolean} cache cache the template compilation and lookup
 * @return {String}
 * @api public
 */
Contour.readable('include', function include(filename, data, cache) {
  if (!path.extname(filename)) {
    filename += '.ejs';
  }

  return this.addFile(filename, true, cache).call(this, data, true);
});

/**
 * Run included content through markdown after ejs has done its work.
 *
 * @param {String} filename template
 * @param {Object} data additional data
 * @return {String} markdown parsed content
 * @api public
 */
Contour.readable('markdown', function markdown() {
  return md(this.include.apply(this, arguments));
});

/**
 * Add template composer to the stack. EJS will cache the compile internally, so
 * its safe to bind the composer directly to supplier.
 *
 * @param {String} file template location
 * @param {Boolean} incl regular file inclusion
 * @param {Boolean} cache cache the include
 * @return {Function} promise of type #supplier
 * @api public
 */
Contour.readable('addFile', function addFile(file, incl, cache) {
  var type = path.basename(file)
    , compiled;

  // cache by default
  if (arguments.length !== 3) cache = true;

  // Set reference to template by filename.
  type = type.substr(0, type.lastIndexOf('.'));

  // Return early if we already compiled the template before.
  if (!incl && type in this) return this[type];

  // Bind types to a supplier to privision data.
  file = path.resolve(this._options.template, file);

  // Fall back to nodejitsu template if the file does not exist.
  if (!fs.existsSync(file)) file = file.replace(
    'templates/' + this._options.brand,
    'templates/nodejitsu'
  );

  compiled = this.supplier.bind(this, type, ejs.compile(
    this.getFileContent(file, cache),
    { filename: file, cache: cache }
  ));

  // Only add the compiled template to the stack if it is not a custom file.
  if (!incl && cache) this[type] = compiled;
  return compiled;
});

/**
 * Proxy each template type and merge in data.
 *
 * @param {String} type
 * @param {Function} render compiled ejs function
 * @param {Object} data data to supply to the renderer
 * @param {Boolean} incl regular file inclusion
 * @return {String} template content
 * @api private
 */
Contour.readable('supplier', function supplier(type, render, data, incl) {
  var source = this._options.defaults
    , self = this
    , copy, html, $;

  if (!incl) {
    if (type in source) {
      var values = source[type];
      copy = JSON.parse(JSON.stringify(values));

      // Call hook on defaults and supply data for source changes.
      if (values.hook) values.hook.call(this, data || copy);

      // Include copied defaults to prevent polution of multiple inclusions.
      data = self.mixin(copy, data || {}, queue.discharge(type));
      if (!('production' in data)) data.production = process.env.NODE_ENV === 'production';
    }

    // Notify an native Nodejitsu-app template was included.
    if (type in this.assets) this.emit('homegrown', this.assets[type]);
  }

  // Always add reference to this.app again.
  html = render.call(render, self.mixin(data || {}, { app: this }));

  // If required adjust element data-attributes.
  if (data && data.attributes) {
    $ = cheerio.load(html);

    Object.keys(data.attributes).forEach(function loopAttributes(selector) {
      var attr = data.attributes[selector];
      Object.keys(attr).forEach(function loopDataKeys(key) {
        $(selector).attr('data-' + key, attr[key]);
      });
    });

    html = $.html();
  }

  return html;
});

/**
 * Get the file content used by include and cache it to storage of the instance.
 *
 * @param {String} file path
 * @return {String} file content
 * @api private
 */
Contour.readable('getFileContent', function getFileContent(file, cache) {
  var store = this._storage;

  if (file in store && cache) return store[file];
  return store[file] = fs.readFileSync(file, 'utf-8');
});

/**
 * Small helper function that exposes the core per brand.
 *
 * @param {String} brand available brands
 * @return {String} path to the core stylus file
 * @api public
 */
Contour.get = function get(brand) {
  if (!~available.indexOf(brand)) return;
  var base = path.join(__dirname, 'assets', brand);

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
// Expose constructor.
//
module.exports = Contour;