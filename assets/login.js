'use strict';

var submit = require('./submit');

//
// Expose the login Pagelet.
//
require('./pagelet').extend({
  js: '{{brand}}/login/base.js',
  view: '{{brand}}/login/view.hbs',

  pagelets: {
    submit: submit.extend({
      data: {
        type: 'login'
      }
    }),
    password: submit.extend({
      data: {
        type: 'password'
      }
    })
  },

  //
  // Default data for the navigation, can be changed by using `set`.
  //
  data: {
    logout: false
  },

  //
  // Used by Square to generate the configuration file. Weight will determine the
  // relative placement with respect to other assets.
  //
  meta: {
    description: 'Login, forget password and logout functionality',
    weight: 898
  }
}).on(module);