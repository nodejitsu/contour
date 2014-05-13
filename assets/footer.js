'use strict';

//
// Expose the footer Pagelet.
//
require('./pagelet').extend({
  name: 'footer',

  //
  // Brand is replaced by Contour when the Pagelet is fetched from assets.
  //
  css: '{{brand}}/footer/base.styl',
  view: '{{brand}}/footer/view.hbs',

  dependencies: [
    '{{brand}}/grid.styl',
    '{{brand}}/icons.styl',
    '{{brand}}/typography.styl'
  ],

  //
  // Both the login functionality and signup button are optional, see data.
  //
  pagelets: {},

  //
  // Default data for the footer, can be changed by using `set`.
  //
  data: {
    logo: true,
    copyright: new Date().getFullYear() + ' - Design by Nodejitsu Inc.',
    social: {
      twitter: 'nodejitsu',
      github: 'nodejitsu'
    },

    //
    // List of navigation links per column.
    //
    navigation: [
      {
        name: 'Company',
        links: [
          { text: 'Nodejitsu.com', target: '_blank', href: 'https://www.nodejitsu.com/' }
        ]
      },
      {
        name: 'Community',
        links: [
          { text: 'Blog', target: '_blank', href: 'https://blog.nodejitsu.com/' }
        ]
      },
      {
        name: 'Resources',
        links: [
          { text: 'Service Status', target: '_blank', href: 'https://status.nodejitsu.com/' }
        ]
      }
    ]
  },

  //
  // Used by Square to generate the configuration file. Weight will determine the
  // relative placement with respect to other assets.
  //
  meta: {
    description: 'Responsive footer element',
    weight: 898
  }
}).on(module);