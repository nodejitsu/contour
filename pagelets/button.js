'use strict';

//
// Expose the button Pagelet.
//
require('./pagelet').extend({
  view: '{{brand}}/button/view.hbs',
  dependencies: [
    '{{brand}}/buttons.styl',
    '{{brand}}/icons.styl'
  ],

  //
  // Several standard types of buttons with proper classes.
  //
  collection: {
    plain: {
      class: 'btn',
      text: 'Submit'
    },
    signup: {
      class: 'btn sign',
      text: '<s class="ss-icon ss-uploadcloud"></s> Sign up',
      href: '/signup'
    },
    action: {
      class: 'action',
      text: 'Call to action'
    },
    flat: {
      class: 'action flat',
      test: 'Flat, shadowless call to action'
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

  /**
   * Define the class and text that are on the button. Called by set on default.
   *
   * @returns {Pagelet}
   * @api private
   */
  define: function define() {
    var type = this.data.type || this.defaults.type
      , collection = this.collection;

    this.data.use = collection[type].class;
    this.data.text = this.data.text || collection[type].text;
    this.data.href = this.data.href || collection[type].href;

    return this;
  }
}).on(module);