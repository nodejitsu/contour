'use strict';

//
// Expose the navigation Pagelet.
//
require('./pagelet').extend({
  name: 'button',

  css: '{{brand}}/button/base.styl',
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
      icon: {
        class: 'btn-icon',
        text: 'Default'
      },
      action: {
        class: 'btn action',
        text: 'Contact us'
      }
    }
  },

  //
  // Default data for the login button, can be changed by using `set`.
  //
  data: {
    href: '/',
    type: 'plain',
    text: 'click me'
  },

  //
  // Used by Square to generate the configuration file. Weight will determine the
  // relative placement with respect to other assets.
  //
  meta: {
    description: 'Responsive header navigation',
    weight: 899
  }
}).on(module);