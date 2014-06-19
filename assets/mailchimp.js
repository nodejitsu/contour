'use strict';

//
// Expose the mailchimp Pagelet.
//
require('./pagelet').extend({
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
  defaults: {
    action: 'http://nodejitsu.us2.list-manage.com/subscribe/post',
    u: 'e4a7e45f759ae0d449c3ba923',
    id: '31f76174d4'
  }
}).on(module);