'use strict';

//
// Required modules.
//
var queue = require('../queue')
  , Pagelet = require('pagelet');

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
 * Set a specific branch. Used by temper to fetch all the proper assets.
 *
 * @param {String} brand
 * @returns {Pagelet} fluent interface
 * @api private
 */
Pagelet.brand = function define(brand) {
  var prototype = this.prototype;

  if (prototype.pagelets) Object.keys(prototype.pagelets).forEach(function loop(name) {
    prototype.pagelets[name].brand(brand);
  });

  //
  // Use nodejitsu as default brand.
  //
  brand = use(brand ? brand : 'nodejitsu');
  prototype.view = brand(prototype.view);

  //
  // CSS and JS will be supplied as arrays, replace paths with brand.
  //
  if (prototype.css) {
    prototype.css = Array.isArray(prototype.css)
      ? prototype.css.map(brand)
      : brand(prototype.css);
  }

  if (prototype.js) {
    prototype.js = Array.isArray(prototype.js)
      ? prototype.js.map(brand)
      : brand(prototype.js);
  }

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
module.exports = Pagelet.extend({
  /**
   * Set the render mode to standalone, this will return just template content.
   * content is rendered without the containing pagelet.fragment from BigPipe.
   * This method is attached to the prototype and will be usuable by an instance.
   *
   * @returns {Pagelet}
   * @api public
   */
  get standalone() {
    this.fragment = '{pagelet::template}';

    return this;
  },

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
    var data = this.mixin(
      this.data,
      this.defaults,
      this.queue.discharge(this.name)
    );

    if ('function' !== typeof done) return data;
    done(undefined, data);
  },

  /**
   * Update the dataset for the current pagelet.
   *
   * @param {Object} data properties
   * @api public
   */
  set: function set(data) {
    this.mixin(this.data, data);
    return this;
  },

  /**
   * Register provided helper with handlebars.
   *
   * @param {String} name registered name
   * @param {Function} fn Handlebars helper
   * @api public
   */
  use: function use(name, fn) {
    this.temper.require('handlebars').registerHelper(this.name + '-' + name, fn);
    return this;
  }
});