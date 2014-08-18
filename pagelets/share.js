'use strict';

//
// Expose the share buttons Pagelet.
//
module.exports = require('./pagelet').extend({
  //
  // Brand is replaced by Contour when the Pagelet is fetched from assets.
  //
  view: '{{brand}}/share/view.hbs',
  css: '{{brand}}/share/base.styl',

  //
  // Regular load scripts for each share button.
  //
  js: [
    '{{brand}}/share/hackernews.js',
    '{{brand}}/share/facebook.js',
    '{{brand}}/share/twitter.js'
  ],

  //
  // Default data for the navigation, can be changed by using `set`.
  //
  defaults: {
    layout: 'horizontal',
    domain: 'https://www.nodejitsu.com',
    title: 'Node.js hosting, cloud products and services | Nodejitsu Inc.',
    via: 'nodejitsu',
    load: {
      facebook: true,
      hackernews: true,
      twitter: true
    }
  },

  //
  // References to the external share button scripts.
  //
  href: {
    twitter: '//platform.twitter.com/widgets.js',
    facebook: '//connect.facebook.net/en_US/all.js#xfbml=1',
    hackernews: '//hn-button.herokuapp.com/hn-button.js'
  },

  /**
   * Define what external JS script should be loaded.
   *
   * @return {Pagelet}
   * @api private
   */
  define: function define() {
    var defaults = this.defaults
      , data = this.data
      , load = data.load || defaults.load
      , href = this.href
      , def = [];

    //
    // Check what social media to load, if none provided load defaults in `load`.
    //
    Object.keys(load).forEach(function checkLoad(key) {
      if (!load[key] || !(key in href)) return;
      def.push(href[key]);
    });

    this.queue.enlist('loader', { plain: def });
    return this;
  }
}).on(module);