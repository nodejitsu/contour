'use strict';

//
// Required modules.
//
var queue = require('../queue')
  , Pagelet = require('pagelet')
  , mixin = require('utile').mixin;

/**
 * The mode the pagelet should be rendered in, if `true` then template
 * content is rendered without the containing pagelet.fragment from BigPipe.
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
    this.initialize();
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
   * Default init function to allow render can call it, can be overridden.
   *
   * @api private
   */
  initialize: function initialize() {}
});