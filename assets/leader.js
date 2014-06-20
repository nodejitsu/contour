'use strict';

//
// Expose the leader Pagelet.
//
require('./pagelet').extend({
  css: '{{brand}}/leader/base.styl',
  view: '{{brand}}/leader/view.hbs',

  //
  // Add default button pagelet as child.
  //
  pagelets: {
    button: require('./button')
  },

  //
  // Default data for the leader, can be changed by using `set`.
  //
  defaults: {
    title: 'Getting Started',
    text: 'Learn how to set up Nodejitsu\'s tool for app deployment and be ready for action.'
  }
}).on(module);