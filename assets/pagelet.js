'use strict';

//
// Required modules.
//
var queue = require('../queue')
  , Pagelet = require('pagelet')
  , pagelet;

/**
 * Return a mapping function with preset brand.
 *
 * @param {String} brand
 * @returns {Function} mapper
 * @api private
 */
function use(brand) {
  return function branding(file) {
    return file.replace('{{brand}}', brand);
  };
}

/**
 * Register a default each helper for handblebars via Temper.
 *
 * @param {Object} context collection of objects
 * @param {Object} options
 * @returns {String}
 * @api public
 */
Pagelet.temper.require('handlebars').registerHelper('each', function each(context, options) {
  if (!Array.isArray(context)) return '';

  return context.reduce(function reduce(memo, stack) {
    return memo + options.fn(stack);
  }, '');
});

/**
 * Set a specific branch. Used by temper to fetch all the proper assets.
 *
 * @param {String} brand
 * @param {Boolean} standalone, force pagelet to standalone mode
 * @returns {Pagelet} fluent interface
 * @api private
 */
Pagelet.brand = function define(brand, standalone) {
  var prototype = this.prototype;

  //
  // Traverse the pagelet to initialize any child pagelets.
  //
  this.traverse(this.name);

  //
  // Run each of the child pagelets through this special branding function as well.
  //
  if (prototype.pagelets) Object.keys(prototype.pagelets).forEach(function loop(name) {
    prototype.pagelets[name].brand(brand);
  });

  //
  // Set the fragment such that only the template is rendered.
  //
  if (standalone) prototype.fragment = '{pagelet:template}';

  //
  // Use nodejitsu as default brand.
  //
  brand = use(brand ? brand : 'nodejitsu');
  prototype.view = brand(prototype.view);

  //
  // CSS and JS will be supplied as arrays, replace paths with brand.
  //
  if (prototype.css) prototype.css = Array.isArray(prototype.css)
    ? prototype.css.map(brand)
    : brand(prototype.css);

  if (prototype.js) prototype.js = Array.isArray(prototype.js)
    ? prototype.js.map(brand)
    : brand(prototype.js);

  prototype.dependencies = prototype.dependencies.map(brand);
  return this.optimize();
};

/**
 * Fetch some values of the Pagelets' original prototype.
 *
 * @param {String} key prototype key
 * @return {Mixed} value
 */
Pagelet.fetch = function fetch(key) {
  return this.prototype[key];
};

/**
 * Some Pagelets require JS that needs to be wrapped with a Cortex initialization
 * script. This getter provides easy access to the content.
 *
 * @return {Object} parts of the Cortex load script.
 * @api public
 */
Pagelet.readable('wrap', {
  enumerable: false,
  get: function wrap() {
    return require('../static/wrap');
  }
});

//
// Add additional functionality and expose the extended Pagelet.
//
module.exports = pagelet = Pagelet.extend({
  /**
   * Extend the default constructor to always call `initialize` by default.
   *
   * @Constructor
   * @return {Pagelet}
   * @api private
   */
  constructor: function constructor() {
    pagelet.__super__.constructor.apply(this);

    this.initialize();
    return this;
  },

  /**
   * Set empty name, such that recursive Pagelets will have their name properly set
   * to the key of the object that references them.
   *
   * @type {String}
   * @api public
   */
  name: '',

  /**
   * Reference to the queue singleton.
   *
   * @type {Queue}
   * @api private
   */
  queue: queue,

  /**
   * Default data for the template.
   *
   * @type {Object}
   * @api public
   */
  data: {},

  /**
   * Data that will be used for rendering but is unlikely to be changed.
   *
   * @type {Object}
   * @api public
   */
  defaults: {},

  /**
   * Provide data to the template render method. Can be called sync and async.
   *
   * @param {Function} done completion callback
   * @api private
   */
  get: function get(done) {
    done(undefined, this.mixin({}, this.defaults, this.data, this.merge(
      this.data,
      this.queue.discharge(this.name)
    )));
  },

  /**
   * Update the dataset for the current pagelet.
   *
   * @param {Object} data properties
   * @api public
   */
  set: function set(data) {
    if ('object' !== typeof data) return this;
    this.mixin(this.data, data);

    return this;
  },

  /**
   * Register provided helper with handlebars.
   *
   * @param {String} namespace Name of the Pagelet the helper was registered from.
   * @param {String} name Registered name
   * @param {Function} fn Handlebars helper
   * @api public
   */
  use: function use(namespace, name, fn) {
    this.temper.require('handlebars').registerHelper(
      this.name || namespace + '-' + name,
      fn
    );

    return this;
  },

  /**
   * Give the default pagelet an empty initialize, so its always callable.
   *
   * @returns {Pagelet}
   * @api public
   */
  initialize: function initialize() {
    return this;
  }
});