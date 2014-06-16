'use strict';

//
// Expose the footer Pagelet.
//
require('./pagelet').extend({
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
  pagelets: {
    mailchimp: require('./mailchimp'),
    social: require('./social')
  },

  //
  // Default data for the footer, can be changed by using `set`.
  //
  defaults: {
    logo: true,
    copyright: '&copy; ' + new Date().getFullYear() + ' - Design by Nodejitsu Inc.',

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
  }
}).on(module);