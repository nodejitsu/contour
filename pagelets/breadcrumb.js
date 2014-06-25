'use strict';

//
// Expose the breadcrumb Pagelet.
//
require('./pagelet').extend({
  //
  // Brand is replaced by Contour when the Pagelet is fetched from assets.
  //
  css: '{{brand}}/breadcrumb/base.styl',
  view: '{{brand}}/breadcrumb/view.hbs',

  //
  // Default data for the breadcrumbs, can be changed by using `set`.
  //
  defaults: {
    links: [
      { href: '#', text: 'Section' }
    ]
  }
}).on(module);