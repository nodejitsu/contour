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
  // On initialize the JS that is not required will be filtered out.
  //
  js: [
    'js/analytics.js',
    '../static/segment.js',
    '../static/ga.js',
  ],

  //
  // Some uncommented JS for this pagelet depends on Cortex.JS
  //
  //dependencies: [
  //  '../node_modules/cortex.js/dist/cortex.dev.js'
  //],

  //
  // Default keys, used when environment is not production.
  //
  defaults: {
    segment: 'r63vj4bdi7',
    ga: 'UA-24971485-6'
  },

  //
  // Default tracker keys and domain, no sensitive data, these can be found
  // in HTML source code.
  //
  data: {
    domain: 'nodejitsu.com',
    type: 'segment'
  },

  //
  // Data that gets sends to the client side JS.
  //
  query: [ 'type', 'domain', 'key' ],

  /**
   * Called after Pagelet construction, register handlebar helpers.
   *
   * @api private
   */
  initialize: function initialize() {
    var data = this.data;

    //
    // If not production use development keys.
    //
    if (process.env.NODE_ENV !== 'production') data.key = this.defaults[data.type];

    //
    // Remove unneeded static libraries.
    //
    this.js = this.js.filter(function filter(file) {
      return ~file.indexOf('js/analytics') || ~file.indexOf('static/' + data.type);
    });

    return this;
  }
}).on(module);