'use strict';

//
// Expose the anchor Pagelet.
//
require('./pagelet').extend({
  view: '{{brand}}/anchor/view.hbs',
  js: '{{brand}}/anchor/base.js',

  //
  // Default data for the anchor hyperlink, can be changed by using `set`.
  //
  defaults: {
    href: '#',
    class: '',
    text: 'I scroll down, I hate jumping'
  }
}).on(module);