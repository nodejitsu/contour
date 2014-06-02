'use strict';

var Page = require('bigpipe').Page
  , Contour = require('../../../')
  , contour = new Contour({
      brand: 'nodejitsu'
    });

Page.extend({
  path: '/',              // HTTP route we should respond to.
  view: './index.ejs',    // The base template we need to render.
  pagelets: {             // The pagelets that should be rendered.
    navigation: contour.navigation.extend({
      base: '',
      login: false,
      signup: true,       // Shows signup button, and relies on recursive pagelets
      navigation: [
        { name: 'Cloud', href: '/paas/' },
        { name: 'Company', href: '/company/' }
      ]
    }),
    footer: contour.footer
  }
}).on(module);
