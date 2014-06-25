'use strict';

//
// Current environment the application is running in.
//
var env = process.env.NODE_ENV || 'development';

//
// Expose the asynchronous client-side JS loader Pagelet.
//
require('./pagelet').extend({
  name: 'loader',
  view: '{{brand}}/loader/view.hbs',

  //
  // Provide some defaults for loading client-side Cortex applications.
  //
  // - apps: identifiers of the client-side applications that need to be loaded
  // - load: internal JS for which the proper environment version will be loaded.
  // - plain: external JS which will not be mapped by env/versions.
  //
  defaults: {
    production: env === 'development',
    apps: [],
    load: [],
    plain: [ '//webops.nodejitsu.com/js/ui.js' ]
  },

  /**
   * Merge the data of custom and external to load and plain.
   *
   * @returns {Pagelet}
   * @api private
   */
  define: function define() {
    var data = this.data;

    if ('custom' in data) this.merge(data.load, data.custom);
    if ('external' in data) this.merge(data.plain, data.external);

    return this;
  }
}).on(module);