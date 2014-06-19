'use strict';

//
// Expose the pills Pagelet.
//
require('./pagelet').extend({
  //
  // Brand is replaced by Contour when the Pagelet is fetched from assets.
  //
  js: '{{brand}}/pills/base.js',
  css: '{{brand}}/pills/base.styl',
  view: '{{brand}}/pills/view.hbs',

  //
  // Default data for the pills, can be changed by using `set`.
  //
  defaults: {
    page: 'individual-plans',
    navigation: [
      {
        name: 'Individual plans',
        page: 'individual-plans'
      },
      {
        name: 'Business plans',
        page: 'business-plans'
      }
    ],
  },

  /**
   * Handblebar helper to generate each pill. The base is defined by
   * the active page and should match the page defined in the navigation.
   *
   * @param {Object} options
   * @return {String} generated template
   * @api private
   */
  links: function links(options) {
    var page = this.page;

    return this.navigation.reduce(function reduce(menu, item) {
      if (page === item.page) item.class = (item.class || '') + ' active';

      if (item.class) item.class = ' class="' + item.class + '"';
      if (item.swap) item.swap = ' data-swap="' + item.swap.hide + '@' + item.swap.show + '"';
      if (item.effect) item.effect = ' data-effect="' + item.effect + '"';

      item.href = item.href || '#';
      return menu + options.fn(item);
    }, '');
  },

  /**
   * Called after Pagelet construction, register handlebar helpers.
   *
   * @api private
   */
  initialize: function initialize() {
    this.queue.enlist('loader', { apps: [ 'pills' ] });
    return this.use('pills', 'links', this.links);
  }
}).on(module);