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
  // Default data for the navigation, can be changed by using `set`.
  //
  defaults: {
    layout: 'horizontal',
    domain: 'https://www.nodejitsu.com',
    facebook: true,
    hackernews: true,
    twitter: true
  },

  //
  // List of reference to different share button scripts.
  //
  href: {
    twitter: '//platform.twitter.com/widgets.js',
    facebook: '//connect.facebook.net/en_US/all.js#xfbml=1',
    hackernews: '//hnbutton.appspot.com/static/hn.min.js'
  },

  /**
   * Define what external JS script should be loaded.
   *
   * @return {Pagelet}
   * @api private
   */
  define: function define() {
    var defaults = this.defaults
      , href = this.href
      , data = this.data
      , def = [];

    //
    // Check what social media to load, if none provided load defaults in `load`.
    //
    Object.keys(href).forEach(function checkDefaults(key) {
      var load = data[key] || defaults[key];
      if (load && !~def.indexOf(href[key])) def.push(href[key]);
    });

    this.queue.enlist('loader', { external: def });
    return this;
  }
}).on(module);