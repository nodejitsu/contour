'use strict';

//
// Expose the Free for Open Source Pagelet.
//
require('./pagelet').extend({
  css: '{{brand}}/foss/base.styl',
  view: '{{brand}}/foss/view.hbs',

  //
  // Default background color for foss banner.
  //
  data: {
    color: 'orange'
  }
}).on(module);