'use strict';

//
// Expose the navigation Pagelet.
//
module.exports = require('./pagelet').extend({
  name: 'login',

  js: 'nodejitsu/login/base.js',
  css: 'nodejitsu/login/base.styl',
  view: 'nodejitsu/login/view.hbs',

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