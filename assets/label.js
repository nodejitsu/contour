'use strict';

//
// Expose the label Pagelet.
//
module.exports = require('./pagelet').extend({
  css: '{{brand}}/label/base.styl',
  view: '{{brand}}/label/view.hbs',

  //
  // Default data for labels, can be changed by using `set`.
  //
  defaults: {
    type: 'notice',
    text: ''
  }
}).on(module);