'use strict';

//
// Expose the alert Pagelet.
//
require('./pagelet').extend({
  js: '{{brand}}/alert/base.js',
  css: '{{brand}}/alert/base.styl',
  view: '{{brand}}/alert/view.hbs',

  //
  // Cortex.JS, the client-side framework is required to run client-side javascript
  //
  dependencies: [
    '../node_modules/cortex.js/dist/cortex.dev.js'
  ],

  //
  // Default data for alert notificiation, can be changed by using `set`.
  //
  defaults: {
    closable: false,
    type: 'notice',
    text: ''
  },

  /**
   * Called after Pagelet construction. If closable enlist client-side JS alert,
   * It will be added to the loader pagelet `data.apps`.
   *
   * @api private
   */
  initialize: function initialize() {
    if (this.data.closable) this.queue.enlist('loader', { apps: [ 'alert' ] });
  }
}).on(module);