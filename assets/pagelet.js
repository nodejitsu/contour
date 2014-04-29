'use strict';

//
// Required modules.
//
var queue = require('../queue')
  , Pagelet = require('pagelet')
  , mixin = require('utile').mixin;

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

  //
  // Use nodejitsu as default brand.
  //
  if (!brand) brand = 'nodejitsu';
  prototype.view = prototype.view.replace('{{brand}}', brand);

  //
  // CSS and JS will be supplied as arrays, replace paths with brand.
  //
  if (prototype.css) prototype.css = prototype.css.map(use(brand));
  if (prototype.js) prototype.js = prototype.js.map(use(brand));
  prototype.dependencies = prototype.dependencies.map(use(brand));

  return this;
};

/**
 * The mode the pagelet should be rendered in, if `true` then template
 * content is rendered without the containing pagelet.fragment from BigPipe.
 * This method is attached to the prototype and will be usuable by an instance.
 *
 * @returns {Pagelet}
 * @api public
 */
Pagelet.readable('standalone', {
  enumerable: false,
  get: function standalone() {
    this.fragment = '{pagelet::template}';
    return this;
  }
}, true);

//
// Add additional functionality and expose the extended Pagelet.
//
module.exports = Pagelet.extend({
  remove: true,

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
   * Enlist a client-side JS application event if closable alerts are required.
   *
   * @param {Function} done completion callback
   * @api private
   */
  get: function get(done) {
    done(undefined, mixin({}, this.data, this.queue.discharge(this.name)));
  },

  /**
   * Update the dataset for the current pagelet.
   *
   * @param {Object} data properties
   * @api public
   */
  set: function set(data) {
    mixin(this.data, data);
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
    this.temper.require('handlebars').registerHelper(name, fn);
    return this;
  },

  /**
   * Default init function to allow render can call it, can be overridden.
   *
   * @api private
   */
  initialize: function initialize() {}
});