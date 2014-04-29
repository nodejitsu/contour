'use strict';

//
// Expose the navigation Pagelet.
//
module.exports = require('./pagelet').extend({
  name: 'navigation',

  //
  // Brand is replaced by Contour when the Pagelet is fetched from assets.
  //
  view: '{{brand}}/navigation/view.hbs',

  css: [
    '{{brand}}/navigation/base.styl'
  ],

  dependencies: [
    '{{brand}}/core.styl',
  ],

  //
  // Both the login functionality and signup button are optional, see data.
  //
  pagelets: {
    login: require('./login'),
    signup: require('./button').extend({
      data: {
        href: '/signup',
        class: 'right sign',
        text: '<s class="ss-icon ss-uploadcloud"></s> sign up'
      }
    })
  },

  //
  // Default data for the navigation, can be changed by using `set`.
  //
  data: {
    base: '',
    login: false,
    signup: false,
    navigation: [
      { name: 'Cloud', href: '/paas/' },
      { name: 'Enterprise', href: '/enterprise/' },
      { name: 'Docs', href: '/documentation/' },
      { name: 'Support', href: '/support/' },
      { name: 'Company', href: '/company/' }
    ]
  },

  //
  // Used by Square to generate the configuration file. Weight will determine the
  // relative placement with respect to other assets.
  //
  meta: {
    description: 'Responsive header navigation',
    weight: 899
  },

  /**
   * Handblebar helper to generate the navigation entries. The base is defined by
   * the active page and should match the first part of the `href` route or the
   * provided menu entry `base`.
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