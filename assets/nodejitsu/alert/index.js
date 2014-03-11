'use strict';
var Temper = require('temper');
module.exports = require('pagelet').extend({
  name: 'alert',

  //
  // Reference to the CSS/JS and view.
  //
  js: 'alert.js',
  css: 'alert.styl',
  view: 'view.ejs',

  //
  // Defaults for certain properties of the template.
  //
  closable: false,
  type: 'notice',
  text: '',

  /**
   * Enlist a client-side JS application event if closable alerts are required.
   *
   * @param {Object} data reference to data template is called with
   * @api private
   */
  initialize: function initialize(data) {
    if (data.closable) this._queue.enlist('loader', { custom: [ 'alert' ] });
  }
}).on(module).optimize(new Temper);