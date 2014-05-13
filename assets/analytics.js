'use strict';

var read = require('fs').readFileSync
  , path = require('path');

//
// Expose the analytics Pagelet.
//
require('./pagelet').extend({
  name: 'analytics',

  //
  // Brand is replaced by Contour when the Pagelet is fetched from assets.
  //
  view: '{{brand}}/analytics/view.hbs',
  //
  // Ignore the JS for now, until a decision between jQuery or Cortex is made.
  //
  // js: '{{brand}}/analytics/base.js',
  //
  // The JS for this pagelet depends on Cortex.JS
  //
  //dependencies: [
  //  '../node_modules/cortex.js/dist/cortex.dev.js'
  //],

  //
  // Default tracker keys and domain, no sensitive data, these can be found
  // in HTML source code.
  //
  data: {
    development: {
      segment: 'r63vj4bdi7',
      ga: 'UA-24971485-6'
    },
    staging: {
      segment: 'r63vj4bdi7',
      ga: 'UA-24971485-6'
    },
    production: {
      segment: '08scm95oit',
      ga: 'UA-24971485-11'
    },

    domain: 'nodejitsu.com',
    env: process.env.NODE_ENV || 'development',

    //
    // Snippets containing the scripts for both Segment.IO and Google Analytics.
    //
    scripts: {
      segment: read(path.join(__dirname, '../static/segment.js'), 'utf-8'),
      ga: read(path.join(__dirname, '../static/ga.js'), 'utf-8'),
    }
  },

  //
  // Used by Square to generate the configuration file. Weight will determine the
  // relative placement with respect to other assets.
  //
  meta: {
    description: 'Initialize analytics trackers like GA and segment.io',
    weight: 996,
    wrap: true
  },

  /**
   * Return the script based on the availability of keys in data. Segment.io has
   * priority by default. The service should handle GA loading.
   *
   * @returns {String} Loading script.
   * @api private
   */
  script: function script() {
    var env = this.env
      , key = 'segment' in this[env] ? 'segment' : 'ga';

    //
    // Expose the used keys on the data object (depends on environment settings).
    //
    return this.scripts[key]
      .replace('{{domain}}', this.domain)
      .replace('{{key}}', this[env][key]);
  },

  /**
   * Render configuration object with the used keys depending on
   * environment settings.
   *
   * @param {Object} options
   * @returns {String} output
   * @api private
   */
  keys: function keys(options) {
    var stack = this[this.env];
    return Object.keys(stack).map(function map(name) {
      return options.fn({ name: name, value: stack[name] });
    }).join(',');
  },

  /**
   * Called after Pagelet construction, register handlebar helpers.
   * TODO find an easy way to set data without overriding initialize entirely.
   *
   * @api private
   */
  initialize: function initialize() {
    this.use('script', this.script);
    this.use('keys', this.keys);
  }
}).on(module);