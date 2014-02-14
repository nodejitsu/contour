'use strict';

/**
 * Native modules.
 */
var EventEmitter = require('events').EventEmitter
  , path = require('path')
  , fs = require('fs');

/**
 * Third-party modules.
 */
var async = require('async')
  , ejs = require('ejs')
  , util = require('utile')
  , cheerio = require('cheerio')
  , md = require('marked')
  , Queue = require('./queue');

//
// Defaults.
//
var defaults = require('./defaults')
  , template = __dirname + '/templates'
  , Assets = require('./assets');

/**
 * Scaffold will register several default HTML5 templates of Nodejitsu. These
 * templates can used from inside views of other projets.
 *
 * Options can be supplied
 *  - brand {String} framework or brand to use, e.g nodejitsu or opsmezzo
 *  - store {String} full path to store Square configuration
 *  - output {String} directory to store output of Square, e.g. compiled CSS/JS
 *  - import {String|Array} custom Square configuration to include in the build
 *
 * @Constructor
 * @param {String} origin required, absolute path to templates
 * @param {Object} options optional, see above
 * @api public
 */
function Scaffold(origin, options) {
  options = options || {};

  // Store options locally and force monitoring if not explicitly cancelled.
  var store = options.store
    , env = process.env.NODE_ENV || 'development'
    , monitor = (env === 'development' || env === 'testing') && store;

  // Check if we got a proper path to userland templates.
  if (!origin || !fs.existsSync(origin)) {
    throw new Error('Provide base path for your template inclusion');
  }

  // Check the path provided to options[store].
  if (monitor && !fs.existsSync(path.dirname(store))) {
    throw new Error('Provide path to store Square configuration');
  }
  // Collection of suppliers, file inclusion and supplied origin.
  this.app = {
    include: this.include.bind(this, origin),
    markdown: this.markdown.bind(this)
  };

  // Switch to required framework.
  this.assets = new Assets(options.brand);

  // Set options and provide fallbacks.
  this._queue = new Queue;
  this._storage = {};
  this._options = {
    brand: this.assets.brand,
    defaults: util.mixin(defaults.nodejitsu, defaults[this.assets.brand]),
    template: path.resolve(template, this.assets.brand),
    fallback: path.resolve(template, 'nodejitsu')
  };

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
  if (monitor) {
    var Square = require('square');

    this._options.store = store;
    this._options.import = options.import;
    this._options.output = options.output || path.dirname(store);
    this._options.resources = path.resolve(__dirname, 'assets');

    //
    // Initialize square with log level: error, so only important stuff is shown.
    // Don't include file origins in the files as these are different per developer.
    //
    this._square = new Square({ 'log level': 2, comments: false });
    this.monitor();
  }
}

Scaffold.prototype.__proto__ = EventEmitter.prototype;

/**
 * Include a template, data will be run through #supplier.
 *
 * @param {String} origin base path of destinations app templates
 * @param {String} filename template
 * @param {Object} data additional data
 * @param {Boolean} cache cache the template compilation and lookup
 * @return {String}
 * @api public
 */
Scaffold.prototype.include = function include(origin, filename, data, cache) {
  if (!path.extname(filename)) {
    filename += '.ejs';
  }

  filename = path.resolve(origin, filename);
  return this.addFile(filename, true, cache).call(this, data, true);
};

/**
 * Debounce function to defer the call of the supplied `fn` with `wait` ms. The
 * timer will be reset as long as the function is called.
 *
 * @param {Function} fn function to call
 * @param {Number} wait milliseconds
 * @api private
 */
Scaffold.prototype.debounce = function debounce(fn, wait) {
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
};

/**
 * Run included content through markdown after ejs has done its work.
 *
 * @param {String} filename template
 * @param {Object} data additional data
 * @return {String} markdown parsed content
 * @api public
 */
Scaffold.prototype.markdown = function markdown() {
  return md(this.app.include.apply(this, arguments));
};

/**
 * This will spin up square monitoring and scaffolding to provide
 * CSS and/or JS compiled and minified at the options.store location.
 *
 * @api public
 */
Scaffold.prototype.monitor = function monitor() {
  var file = path.resolve(this._options.store)
    , extend = this._options.import
    , self = this
    , save
    , config
    , live;

  /**
   * Add assets to the Square configuration.
   *
   * @param {Array} files collection of assets
   * @param {Function} callback optional callback for use in async
   * @api private
   */
  function addAssets(files, callback) {
    var current = Object.keys(self._square.scaffold.get().bundle)
      , added = 0;

    files.forEach(function addFile(file) {
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
      file.source = path.resolve(self._options.resources, file.source);

      //
      // Update the configuration of the build file if required.
      //
      if (file.configuration && file.configuration.plugins) {
        self._square.scaffold.plugins(file.configuration.plugins);
      }

      if (self._square.scaffold.add(file)) added++;
    });

    return callback ? process.nextTick(callback) : added;
  }

  // Square configuration options.
  config = {
    storage: ['disk'],
    plugins: { minify: {} },
    dist: path.resolve(this._options.output, '{ext}/jitsu.{type}.{ext}')
  };

  // Check if custom build files were provided with additional assets.
  // These will be imported gracefully by Square.
  if (extend) {
    if (!Array.isArray(extend)) extend = [ extend ];

    config.import = [];
    extend.forEach(function loopImports(imported) {
      config.import.push('include ' + imported.replace(path.extname(imported), ''));
    });
  }

  // Scaffold a configuration file and pass it to the square parser. If file
  // points to an actual scaffolded configuration that is loaded beforehand.
  this._square.scaffold.init(file);

  // Overwrite the default config constructed above with existing directives.
  config = util.mixin(config, this._square.scaffold.get().configuration);
  this._square.scaffold.configuration(config);

  // Find the path to assets inside Nodejitsu-app so Square has proper paths, do
  // an initial setup and save this configuration before starting anything.
  async.waterfall([
    addAssets.bind(this, this.assets.defaults),
    this._square.scaffold.save
  ], function initWatcher() {
    // Add default framework files to the configuration and set distribution.
    // After adding assets, start live monitoring and keep logging minimal.
    self._square.parse(file);
    live = new self._square.Watcher(8888, true);

    // Notify the developer if the build file changed.
    self._square.on('parsed', function structChanged() {
      console.log('[info]'.green + ' build file structure changes detected, parsing...');
    });

    // Notify the developer about file changes.
    self._square.on('refresh', function contentChanged() {
      console.log(' --'.blue + ' content changes detected, refreshing...');
    });

    // Keep track if all CSS/JS assets are added to the configuration. If assets
    // actually changed debounce the write function for a short timea
    save = self.debounce(self._square.scaffold.save, 100);
    self.on('homegrown', function morph(files) {
      // Save latest version of configuration, this will trigger rebuilds and
      // reloading of the browser. Also it will ensure relative paths are
      // correctly resolved.
      if (addAssets(files)) save();
    });

    // On exit stop watching and destroy the watcher to prevent any rebuilds
    // from occuring, finally write and update the scaffolded configuration.
    process.once('SIGINT', function finalize() {
      live.destroy();

      self._square.scaffold.save(function results(result) {
        console.log(result);
        process.exit();
      });
    });

    // Notify external APIs that we are monitoring.
    self.emit('monitoring');
  });
};

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
Scaffold.prototype.addFile = function addFile(file, incl, cache) {
  var ref = this.app
    ,  type = path.basename(file)
    ,  compiled;

  // cache by default
  if (arguments.length !== 3) cache = true;

  // Set reference to template by filename.
  type = type.substr(0, type.lastIndexOf('.'));

  // Return early if we already compiled the template before.
  if (!incl && type in ref) return ref[type];

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
  if (!incl && cache) ref[type] = compiled;
  return compiled;
};

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
Scaffold.prototype.supplier = function supplier(type, render, data, incl) {
  var source = this._options.defaults
    , copy, html, $;

  if (!incl) {
    if (type in source) {
      var values = source[type];
      copy = JSON.parse(JSON.stringify(values));

      // Call hook on defaults and supply data for source changes.
      if (values.hook) values.hook.call(this, data || copy);

      // Include copied defaults to prevent polution of multiple inclusions.
      data = util.mixin(copy, data || {}, this._queue.discharge(type));
      data.production = process.env.NODE_ENV === 'production';
    }

    // Notify an native Nodejitsu-app template was included.
    if (type in this.assets) this.emit('homegrown', this.assets[type]);
  }

  // Always add reference to this.app again.
  html = render.call(render, util.mixin(data || {}, { app: this.app }));

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
};

/**
 * Get the file content used by include and cache it to storage of the instance.
 *
 * @param {String} file path
 * @return {String} file content
 * @api private
 */
Scaffold.prototype.getFileContent = function getFileContent(file, cache) {
  var store = this._storage;

  if (file in store && cache) return store[file];
  return store[file] = fs.readFileSync(file, 'utf-8');
};

/**
 * Expose constructor.
 */
module.exports = Scaffold;
