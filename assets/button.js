'use strict';

//
// Expose the navigation Pagelet.
//
require('./pagelet').extend({
  css: 'base/buttons.styl',
  view: '{{brand}}/button/view.hbs',

  //
  // Several default types of buttons with proper classes.
  //
  defaults: {
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
    }
  },

  //
  // Default data for the login button, can be changed by using `set`.
  //
  data: {
    href: '/',
    type: 'plain'
  }
}).on(module);