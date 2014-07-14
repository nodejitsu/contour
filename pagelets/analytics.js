'use strict';

//
// Expose the analytics Pagelet.
//
require('./pagelet').extend({
  //
  // Brand is replaced by Contour when the Pagelet is fetched from assets.
  //
  view: '{{brand}}/analytics/view.hbs',

  //
  // Define will will filter out the analytics JS that is not required.
  //
  js: [
    '{{brand}}/analytics/base.js',
    '../static/segment.js',
    '../static/ga.js'
  ],

  //
  // Cortex.JS, the client-side framework is required to run client-side javascript
  //
  dependencies: [
    '../node_modules/cortex.js/dist/cortex.dev.js'
  ],

  //
  // Development keys, used when environment is not production.
  //
  segment: 'r63vj4bdi7',
  ga: 'UA-24971485-6',

  //
  // Data that will be provided to the client script in (BigPipe mode only).
  //
  query: ['domain', 'type', 'key'],

  //
  // Default data for analytics, can be changed by using `set`.
  //
  defaults: {
    domain: 'nodejitsu.com',
    type: 'segment'
  },

  /**
   * Set proper key and library based on the data.type.
   *
   * @return {Pagelet}
   * @api private
   */
  define: function define() {
    var type = this.data.type || this.defaults.type;

    //
    // If not production use development keys.
    //
    if (process.env.NODE_ENV !== 'production') this.data.key = this[type];

    //
    // Remove unneeded static libraries, always keep Cortex.JS
    //
    this.js = this.js.filter(function filter(file) {
      return ~file.indexOf('analytics/base.js') || ~file.indexOf('static/' + type);
    });

    return this;
  },

  /**
   * Called after Pagelet construction, queue client side JS.
   *
   * @api private
   */
  initialize: function initialize() {
    this.queue.enlist('loader', { apps: [ 'analytics' ] });
    return this;
  }
}).on(module);