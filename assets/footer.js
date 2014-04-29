'use strict';

//
// Expose the footer Pagelet.
//
module.exports = require('./pagelet').extend({
  name: 'footer',

  //
  // Brand is replaced by Contour when the Pagelet is fetched from assets.
  //
  css: [ '{{brand}}/footer/base.styl' ],
  view: '{{brand}}/footer/view.hbs',

  dependencies: [
    '{{brand}}/core.styl'
  ],

  //
  // Both the login functionality and signup button are optional, see data.
  //
  pagelets: {
  },

  //
  // Default data for the footer, can be changed by using `set`.
  //
  data: {
  },

  //
  // Used by Square to generate the configuration file. Weight will determine the
  // relative placement with respect to other assets.
  //
  meta: {
    description: 'Responsive footer element',
    weight: 898
  },

  /**
   * Handblebar helper to generate the navigation entries. The maximum number of
   * columns that can be generated is 5.
   *
   * @param {Object} options
   * @api private
   */
  nav: function nav(options) {
    var base = this.base;
    return this.navigation.reduce(function reduce(menu, item) {
      item.active = ~base.indexOf(item.base || item.href.split('/').filter(String).shift())
        ? ' class="active"'
        : '';

      return menu + options.fn(item);
    }, '');
  },

  /**
   * Called after Pagelet construction, register handlebar helpers.
   *
   * @api private
   */
  initialize: function initialize() {
    this.use('nav', this.nav);
  }
}).on(module);