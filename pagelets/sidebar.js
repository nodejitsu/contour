'use strict';

//
// Expose the sidebar Pagelet.
//
require('./pagelet').extend({
  css: '{{brand}}/sidebar/base.styl',
  view: '{{brand}}/sidebar/view.hbs',

  //
  // Default data for the sidebar, can be changed by using `set`.
  //
  defaults: {
    page: '',
    menu: [
      {
        name: 'Private Cloud',
        href: '/enterprise/private-cloud/'
      },
      {
        name: 'Conservatory',
        href: '/enterprise/conservatory/'
      },
      {
        name: 'Orchestrion',
        href: '/enterprise/orchestrion/'
      },
      {
        name: 'Professional Services',
        href: '/enterprise/professional-services/'
      }
    ]
  },


  /**
   * Handblebar helper to generate the sidebar entries. The page is defined by
   * the active page and should match the first part of the `href` route or the
   * provided menu entry `page`.
   *
   * @param {Object} options
   * @return {String} generated template
   * @api private
   */
  links: function links(options) {
    var page = this.page;

    return this.menu.reduce(function reduce(menu, item) {
      var active = item.page || item.href.split('/').filter(String).pop();

      item.active = ~page.indexOf(active) ? ' class="active"' : '';
      return menu + options.fn(item);
    }, '');
  },

  /**
   * Called after Pagelet construction, register handlebar helpers.
   *
   * @api private
   */
  initialize: function initialize() {
    return this.use('sidebar', 'links', this.links);
  }
}).on(module);