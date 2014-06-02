'use strict';

//
// Expose the social Pagelet.
//
module.exports = require('./pagelet').extend({
  name: 'social',

  css: '{{brand}}/social/base.styl',
  view: '{{brand}}/social/view.hbs',

  dependencies: [
    'webfonts/ss-social.styl'
  ],

  //
  // Default data for social icons, can be changed by using `set`.
  //
  data: {
    twitter: 'nodejitsu',
    github: 'nodejitsu'
  },

  //
  // Used by Square to generate the configuration file. Weight will determine the
  // relative placement with respect to other assets.
  //
  meta: {
    description: 'Small icons with links to twitter and github',
    weight: 698
  },
}).on(module);