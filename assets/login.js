'use strict';

var submit = require('./submit')
  , alert = require('./alert');

//
// Expose the login Pagelet.
//
require('./pagelet').extend({
  js: '{{brand}}/login/base.js',
  view: '{{brand}}/login/view.hbs',

  pagelets: {
    submit: submit.extend({ data: { type: 'login' }}),
    password: submit.extend({ data: { type: 'password' }}),
    error: alert.extend({ data: { type: 'error', class: 'error' }}),
    notice: alert.extend({ data: { type: 'notice', class: 'error gone' }}),
    success: alert.extend({ data: { type: 'success', class: 'success' }})
  },

  //
  // Default data for the navigation, can be changed by using `set`.
  //
  defaults: {
    logout: false
  }
}).on(module);