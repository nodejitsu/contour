'use strict';

//
// Expose the navigation Pagelet.
//
module.exports = require('./pagelet').extend({
  //
  // Brand is replaced by Contour when the Pagelet is fetched from assets.
  //
  view: '{{brand}}/navigation/view.hbs',
  css: '{{brand}}/navigation/base.styl',

  dependencies: [
    '{{brand}}/grid.styl',
    '{{brand}}/icons.styl',
    '{{brand}}/typography.styl'
  ],

  //
  // Both the login functionality and signup button are optional, see data.
  //
  pagelets: {
    login: require('./login'),
    loginout: require('./button').extend({
      data: {
        href: '#',
        class: 'loginout login right',
        text: '<s class="ss-icon ss-lock" role="presentation"></s> Login',
        title: 'Login with your credentials',
        attributes: {
          'a.login': {
            login: true
          }
        }
      }
    }),
    signup: require('./button').extend({
      data: {
        href: '/signup',
        class: 'right action sign',
        text: '<s class="ss-icon ss-uploadcloud"></s> sign up'
      }
    })
  },

  //
  // Default data for the navigation, can be changed by using `set`.
  //
  defaults: {
    base: 'paas',
    sub: '',
    loggedin: false,
    navigation: [
      { name: 'Cloud', href: '/paas/' },
      { name: 'Enterprise', href: '/enterprise/' },
      { name: 'Docs', href: '/documentation/' },
      { name: 'Support', href: '/support/' },
      { name: 'Company', href: '/company/' }
    ]
  },

  /**
   * Set proper key and library based on the data.type.
   *
   * @return {Pagelet}
   * @api private
   */
  define: function define() {
    if (this.data.loggedin || this.defaults.loggedin)  {
      this.pagelets.loginout = this.pagelets.loginout.extend({
        data: {
          href: '/logout',
          class: 'loginout right',
          text: '<s class="ss-icon ss-unlock" role="presentation"></s> Logout',
          title: 'Logout'
        }
      });
    }

    return this;
  },

  /**
   * Handblebar helper to generate the navigation entries. The base is defined by
   * the active page and should match the first part of the `href` route or the
   * provided menu entry `base`.
   *
   * @param {Object} options
   * @param {Boolean} page Current iteration over page or root of url
   * @return {String} generated template
   * @api private
   */
  links: function links(data, page, options) {
    if (!data || !data.length) return;

    var targets = ['self', 'blank', 'parent', 'top']
      , navigation = this;

    return data.reduce(function reduce(menu, item) {
      var url = item.href.split('/').filter(String)
        , active = url.shift();

      if (page) active = item.base || url.shift();
      item.active = ~navigation[page ? 'page' : 'base'].indexOf(active)
        ? ' class="active"'
        : '';

      item.target = item.target && ~targets.indexOf(item.target)
        ? ' target=_' + item.target
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
    return this.use('navigation', 'links', this.links);
  }
}).on(module);