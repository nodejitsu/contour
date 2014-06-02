'use strict';

//
// Expose the navigation Pagelet.
//
require('./button').extend({
  name: 'submit',

  view: '{{brand}}/submit/view.hbs'
}).on(module);