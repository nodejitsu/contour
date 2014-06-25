'use strict';

//
// Expose the tooltip Pagelet.
//
require('./pagelet').extend({
  js: '{{brand}}/tooltip/base.js',
  css: '{{brand}}/tooltip/base.styl',
  view: '{{brand}}/tooltip/view.hbs',

  //
  // Cortex.JS, the client-side framework is required to run client-side javascript
  //
  dependencies: [
    '../node_modules/cortex.js/dist/cortex.dev.js'
  ],

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

  /**
   * Called after Pagelet construction, enlist client-side JS tooltip,
   * It will be added to the loader pagelet `data.apps`.
   *
   * @api private
   */
  initialize: function initialize() {
    this.queue.enlist('loader', { apps: [ 'tooltip' ] });

    return this;
  }
}).on(module);