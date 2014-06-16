'use strict';

//
// Expose the tooltip Pagelet.
//
require('./pagelet').extend({
  js: '{{brand}}/tooltip/base.js',
  css: '{{brand}}/tooltip/base.styl',
  view: '{{brand}}/tooltip/view.hbs',

  //
  // Tooltip defaults, the tooltip is toggled by clicking the generated hyperlink.
  // It will place the generated div below the hyperlink by default.
  //
  defaults: {
    placement: 'bottom',
    color: 'blue',
    trigger: 'mouseover',
    content: '',
  },

  //
  // Enlist client-side JS tooltip, which will be added to the loader pagelet.
  //
  initialize: function initialize() {
    this.queue.enlist('loader', { custom: [ 'tooltip' ] });
  }
}).on(module);