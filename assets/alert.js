'use strict';

//
// Expose the alert Pagelet.
//
module.exports = require('./pagelet').extend({
  name: 'alert',

  js: 'nodejitsu/alert/base.js',
  css: 'nodejitsu/alert/base.styl',
  view: 'nodejitsu/alert/view.hbs',

  //
  // Default data for alert notificiation, can be changed by using `set`.
  //
  data: {
    closable: false,
    type: 'notice',
    text: ''
  },

  //
  // Used by Square to generate the configuration file. Weight will determine the
  // relative placement with respect to other assets.
  //
  meta: {
    description: 'Closable alerts in several different colors',
    weight: 799
  },

  //
  // Enlist the client side JS app Alert, which will be added if loader is called.
  //
  initialize: function initialize() {
    if (this.data.closable) this.queue.enlist('loader', { custom: [ 'alert' ] });
  }
}).on(module);