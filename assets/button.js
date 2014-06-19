'use strict';

//
// Expose the button Pagelet.
//
require('./pagelet').extend({
  css: 'base/buttons.styl',
  view: '{{brand}}/button/view.hbs',

  //
  // Several standard types of buttons with proper classes.
  //
  collection: {
    plain: {
      class: 'btn',
      text: 'Submit'
    },
    action: {
      class: 'action',
      text: 'Call to action'
    },
    login: {
      class: 'action',
      text: 'Log in'
    },
    password: {
      class: 'action',
      text: 'Reset password'
    },
    icon: {
      class: 'btn-icon',
      text: 'Default'
    }
  },

  //
  // Default data for the login button, can be changed by using `set`.
  //
  defaults: {
    href: '/',
    type: 'plain'
  },

  //
  // Provide some defaults to the data based on the standard collection.
  //
  initialize: function initialize() {
    var type = this.data.type || this.defaults.type
      , collection = this.collection;

    this.data.use = collection[type].class;
    this.data.text = this.data.text || collection[type].text;
  }
}).on(module);