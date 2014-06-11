'use strict';

//
// Expose the mailchimp Pagelet.
//
module.exports = require('./pagelet').extend({
  css: '{{brand}}/mailchimp/base.styl',
  view: '{{brand}}/mailchimp/view.hbs',

  dependencies: [
    'base/form.styl'
  ],

  //
  // Both the login functionality and signup button are optional, see data.
  //
  pagelets: {
    submit: require('./submit').extend({
      data: {
        type: 'icon',
        class: 'right',
        text: 'subscribe'
      }
    })
  },

  //
  // Default data for mailchimp mailing list form, can be changed by using `set`.
  //
  data: {
    action: 'http://nodejitsu.us2.list-manage.com/subscribe/post',
    u: 'e4a7e45f759ae0d449c3ba923',
    id: '31f76174d4'
  },

  //
  // Used by Square to generate the configuration file. Weight will determine the
  // relative placement with respect to other assets.
  //
  meta: {
    description: 'Small form to subscribe to a mailchimp mailing list',
    weight: 699
  },
}).on(module);