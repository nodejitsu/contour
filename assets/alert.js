'use strict';

//
// Expose the alert Pagelet.
//
require('./pagelet').extend({
  js: '{{brand}}/alert/base.js',
  css: '{{brand}}/alert/base.styl',
  view: '{{brand}}/alert/view.hbs',

  //
  // Default data for alert notificiation, can be changed by using `set`.
  //
  data: {
    closable: false,
    type: 'notice',
    text: ''
  },

  //
  // If closable enlist client-side JS Alert, which will be added to the loader pagelet.
  //
  initialize: function initialize() {
    if (this.data.closable) this.queue.enlist('loader', { custom: [ 'alert' ] });
  }
}).on(module);