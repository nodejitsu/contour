'use strict';

//
// Expose the login Pagelet.
//
require('./pagelet').extend({
  name: 'login',

  js: [ '{{brand}}/login/base.js' ],
  css: [ '{{brand}}/login/base.styl' ],
  view: '{{brand}}/login/view.hbs',

  pagelets: {
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
  },
}).on(module);