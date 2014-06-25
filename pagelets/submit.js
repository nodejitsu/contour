'use strict';

//
// Expose the submit button Pagelet.
//
require('./button').extend({
  view: '{{brand}}/submit/view.hbs'
}).on(module);