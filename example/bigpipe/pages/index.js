'use strict';

var Page = require('bigpipe').Page
  , Contour = require('../../../')
  , contour = new Contour({
      brand: 'nodejitsu'
    });

//
// Reference to the contour navigation pagelet, to reuse required sub pagelets.
//
var navigation = contour.navigation;

//
// Extend a default page and provide two pagelets, the navigation and the footer.
//
Page.extend({
  path: '/',              // HTTP route we should respond to.
  view: './index.hbs',    // The base template we need to render.
  pagelets: {             // The pagelets that should be rendered.
    navigation: navigation.extend({
      pagelets: {
        signup: navigation.fetch('pagelets').signup
      },

      data: {
        base: '',
        navigation: [
          { name: 'Cloud', href: '/paas/' },
          { name: 'Company', href: '/company/' }
        ]
      }
    }),

    footer: contour.footer
  }
}).on(module);
