'use strict';

/**
 * Native modules.
 */
var path = require('path')
  , fs = require('fs');

/**
 * Third-party modules.
 */
var async = require('async')
  , fuse = require('fusing')
  , ejs = require('ejs')
  , mixin = require('utile').mixin
  , cheerio = require('cheerio')
  , md = require('marked')
  , queue = require('./queue');

//
// Defaults.
//
var defaults = require('./defaults')
  , template = __dirname + '/templates'
  , Assets = require('./assets');

/**
 * Contour will register several default HTML5 templates of Nodejitsu. These
 * templates can used from inside views of other projets.
 *
 * Options can be supplied
 *  - brand {String} framework or brand to use, e.g nodejitsu or opsmezzo
 *  - store {String} full path to store Square configuration
 *  - output {String} directory to store output of Square, e.g. compiled CSS/JS
 *  - import {String|Array} custom Square configuration to include in the build
 *  - dist {String} distribution filenames of generated CSS/JS
 *  - monitor {Boolean} force monitoring if true
 *
 * @Constructor
 * @param {String} origin required, absolute path to templates
 * @param {Object} options optional, see above
 * @api public
 */
function Contour(origin, options) {
  options = options || {};

  // Store options locally and force monitoring if not explicitly cancelled.
  var store = options.store
    , env = process.env.NODE_ENV || 'development'
    , monitor = options.monitor || (env === 'development' && store)
    , readable = Contour.predefine(this, Contour.predefine.READABLE);

  // Check if we got a proper path to userland templates.
  if (!origin || !fs.existsSync(origin)) {
    throw new Error('Provide base path for your template inclusion');
  }

  // Check the path provided to options[store].
  if (monitor && !fs.existsSync(path.dirname(store))) {
    throw new Error('Provide path to store Square configuration');
  }

  // Switch to required framework.
  readable('assets', new Assets(options.brand));

  // Set options and provide fallbacks.
  readable('_queue', queue);
  readable('_origin', origin);
  readable('_storage', {});
  readable('_options', {
    brand: this.assets.brand,
    defaults: mixin(defaults.nodejitsu, defaults[this.assets.brand]),
    template: path.resolve(template, this.assets.brand),
    fallback: path.resolve(template, 'nodejitsu')
  });

  // Get all default nodejitsu templates. These will be forcefully overwritten
  // by a custom brand. It creates a fall back if the custom brand does not
  // require a different template.
  fs.readdirSync(this._options.fallback).forEach(function prepareTemplates(file) {
    this.addFile(file);
  }.bind(this));

  // Get all the templates, synced so another application does not
  // have to defer their whole initialization for nodejitsu-app.
  if ('nodejitsu' !== this._options.brand) {
    fs.readdirSync(this._options.template).forEach(function prepareTemplates(file) {
      this.addFile(file);
    }.bind(this));
  }

  // Start monitoring for included templates to automatically update Square.
  if (!monitor) return;
  var Square = require('square');

  this._options.store = store;
  this._options.dist = options.dist || '{ext}/jitsu.{type}.{ext}';
  this._options.import = options.import;
  this._options.output = options.output || path.dirname(store);
  this._options.resources = path.resolve(__dirname, 'assets');

  //
  // Initialize square with log level: error, so only important stuff is shown.
  // Don't include file origins in the files as these are different per developer.
  //
  readable('_square', new Square({ 'log level': 2, comments: false }));
  this.monitor();
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

  filename = path.resolve(this._origin, filename);
  return this.addFile(filename, true, cache).call(this, data, true);
});

/**
 * Debounce function to defer the call of the supplied `fn` with `wait` ms. The
 * timer will be reset as long as the function is called.
 *
 * @param {Function} fn function to call
 * @param {Number} wait milliseconds
 * @api private
 */
Contour.readable('debounce', function debounce(fn, wait) {
  var timeout;

  return function defer() {
    var context = this
      , args = arguments
      , timestamp = Date.now()
      , result;

    function later() {
      var last = Date.now() - timestamp;
      if (last < wait) return timeout = setTimeout(later, wait - last);

      timeout = null;
      result = fn.apply(context, args);
    }

    if (!timeout) timeout = setTimeout(later, wait);
    return result;
  };
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
 * Reducer for list of files to add to the square configuration bundle.
 *
 * @param {Number} n
 * @param {Object} file representation
 * @api public
 */
Contour.readable('add', function add(n, file) {
  var current = Object.keys(this._square.scaffold.get().bundle)
    , self = this;

  /**
   * Check for presence of file in current config by doing a
   * loose check against the final part of the file path.
   *
   * @param {String} full current complete path of asset
   * @api private
   */
  function check(full) {
    return ~full.indexOf(file.source);
  }

  //
  // Check for already included files, done against partial path
  // to prevent duplicate inclusions via symlinked nodejitsu-app.
  //
  if(current.filter(check).length) return false;
  file.source = path.resolve(file.base || self._options.resources, file.source);

  //
  // Update the configuration of the build file if required.
  //
  if (file.configuration && file.configuration.plugins) {
    self._square.scaffold.plugins(file.configuration.plugins);
  }

  return self._square.scaffold.add(file) ? n + 1 : n;
});

/**
 * This will spin up square monitoring and scaffolding to provide
 * CSS and/or JS compiled and minified at the options.store location.
 *
 * @api public
 */
Contour.readable('monitor', function monitor() {
  var file = path.resolve(this._options.store)
    , extend = this._options.import
    , self = this
    , save;

  /**
   * Add assets to the Square configuration.
   *
   * @param {Array} files collection of assets
   * @param {Function} callback optional callback for use in async
   * @api private
   */
  function addAssets(files, callback) {
    var added = files.reduce(self.add.bind(self), 0);
    return callback ? process.nextTick(callback) : added;
  }

  /**
   * On exists make sure we save the file.
   *
   * @api private
   */
  function finalize() {
    self.live.destroy();
    self._square.scaffold.save(function results(result) {
      console.log(result);
      process.exit();
    });
  }

  //
  // Scaffold a configuration file and pass it to the square parser. If file
  // points to an actual scaffolded configuration that is loaded beforehand.
  //
  this._square.scaffold.init(file);

  //
  // Default Square configuration options.
  //
  var config = {
    storage: ['disk'],
    plugins: { minify: {} },
    dist: path.resolve(this._options.output, this._options.dist)
  };

  // Check if custom build files were provided with additional assets.
  // These will be imported gracefully by Square.
  if (extend) {
    if (!Array.isArray(extend)) extend = [ extend ];

    extend.forEach(function loopImports(imported) {
      var base = path.dirname(path.resolve(imported))
        , files = [];

      imported = require(path.join(path.dirname(file), imported));
      config = mixin(config, imported.configuration);

      Object.keys(imported.bundle).forEach(function loopBundle(key) {
        var ext = 'pre:' + path.extname(key).slice(1);
        imported.bundle[key][ext] = imported.bundle[key][ext] || {};
        imported.bundle[key][ext].paths = self._options.resources;

        files.push({ meta: imported.bundle[key], source: key, base: base });
      });

      addAssets(files);
    });
  }

  //
  // Overwrite the default config constructed above with existing directives.
  //
  config = mixin(config, this._square.scaffold.get().configuration);
  this._square.scaffold.configuration(config);

  // Find the path to assets inside Nodejitsu-app so Square has proper paths, do
  // an initial setup and save this configuration before starting anything.
  async.waterfall([
    addAssets.bind(this, this.assets.defaults),
    this._square.scaffold.save.bind(this._square.scaffold)
  ], function initWatcher() {
    // Add default framework files to the configuration and set distribution.
    // After adding assets, start live monitoring and keep logging minimal.
    self._square.parse(file);
    self.live = new self._square.Watcher(8888, true);

    // Notify the developer if the build file changed.
    self._square.on('parsed', function structChanged() {
      console.log('[info]'.green + ' build file structure changes detected, parsing...');
    });

    // Notify the developer about file changes.
    self._square.on('refresh', function contentChanged() {
      console.log(' --'.blue + ' content changes detected, refreshing...');
    });

    // Keep track if all CSS/JS assets are added to the configuration. If assets
    // actually changed debounce the write function for a short time.
    save = self.debounce(self._square.scaffold.save, 100).bind(self._square.scaffold);
    self.on('homegrown', function morph(files) {
      // Save latest version of configuration, this will trigger rebuilds and
      // reloading of the browser. Also it will ensure relative paths are
      // correctly resolved.
      if (addAssets(files)) save();
    });

    // On exit stop watching and destroy the watcher to prevent any rebuilds
    // from occuring, finally write and update the scaffolded configuration.
    // Before listening check if there are already registered SIGINT interrupts.
    if (!process.listeners('SIGINT').length) process.once('SIGINT', finalize);

    // Notify external APIs that we are monitoring.
    self.emit('monitoring');
  });
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
    , copy, html, $;

  if (!incl) {
    if (type in source) {
      var values = source[type];
      copy = JSON.parse(JSON.stringify(values));

      // Call hook on defaults and supply data for source changes.
      if (values.hook) values.hook.call(this, data || copy);

      // Include copied defaults to prevent polution of multiple inclusions.
      data = mixin(copy, data || {}, queue.discharge(type));
      if (!('production' in data)) data.production = process.env.NODE_ENV === 'production';
    }

    // Notify an native Nodejitsu-app template was included.
    if (type in this.assets) this.emit('homegrown', this.assets[type]);
  }

  // Always add reference to this.app again.
  html = render.call(render, mixin(data || {}, { app: this }));

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
 * Expose constructor.
 */
module.exports = Contour;