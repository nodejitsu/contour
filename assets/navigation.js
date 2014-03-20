'use strict';

//
// Expose the navigation Pagelet.
//
module.exports = require('./pagelet').extend({
  name: 'navigation',

  //
  // Brand is replaced by Contour when the Pagelet is fetched from assets.
  //
  css: '{{brand}}/navigation/base.styl',
  view: '{{brand}}/navigation/view.hbs',

  //
  // Both the login functionality and signup button are optional, see data.
  //
  pagelets: {
    login: require('./login'),
    signup: require('./button').extend({
      data: {
        href: '/signup',
        class: 'right sign',
        text: '<s class="ss-icon ss-uploadcloud"></s> sign up'
      }
    })
  },

  //
  // Default data for the navigation, can be changed by using `set`.
  //
  data: {
    base: '',
    login: false,
    signup: false,
    navigation: [
      { name: 'Cloud', href: '/paas/' },
      { name: 'Enterprise', href: '/enterprise/' },
      { name: 'Docs', href: '/documentation/' },
      { name: 'Support', href: '/support/' },
      { name: 'Company', href: '/company/' }
    ]
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