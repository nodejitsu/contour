'use strict';

//
// Expose the alert Pagelet.
//
module.exports = require('../../pagelet').extend({
  name: 'alert',

  js: 'alert.js',
  css: 'alert.styl',
  view: 'view.hbs',

  data: {
    closable: false,
    type: 'notice',
    text: ''
  },

  initialize: function initialize() {
    if (this.data.closable) this.queue.enlist('loader', { custom: [ 'alert' ] });
  }
}).on(module).optimize();