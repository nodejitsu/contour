'use strict';

//
// Expose the navigation Pagelet.
//
module.exports = require('./pagelet').extend({
  name: 'button',

  css: [ '{{brand}}/button/base.styl' ],
  view: '{{brand}}/button/view.hbs',

  //
  // Default data for the login button, can be changed by using `set`. The
  // collection
  //
  data: {
    href: '',
    type: 'plain',
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
  // Used by Square to generate the configuration file. Weight will determine the
  // relative placement with respect to other assets.
  //
  meta: {
    description: 'Responsive header navigation',
    weight: 899
  },
}).on(module);