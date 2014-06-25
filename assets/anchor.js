'use strict';

//
// Expose the anchor Pagelet.
//
require('./pagelet').extend({
  view: '{{brand}}/anchor/view.hbs',
  js: '{{brand}}/anchor/base.js',

  //
  // Cortex.JS, the client-side framework is required to run client-side javascript
  //
  dependencies: [
    '../node_modules/cortex.js/dist/cortex.dev.js'
  ],

  //
  // Default data for the anchor hyperlink, can be changed by using `set`.
  //
  defaults: {
    href: '#',
    class: '',
    text: 'I scroll down, I hate jumping'
  }
}).on(module);