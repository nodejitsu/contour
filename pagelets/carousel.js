'use strict';

var url = require('url')
  , fs = require('fs');

//
// Expose the CSS Carousel Pagelet.
//
require('./pagelet').extend({
  js: '{{brand}}/carousel/base.js',
  css: '{{brand}}/carousel/base.styl',
  view: '{{brand}}/carousel/view.hbs',

  //
  // Default items for the carousel, can be changed using `set`.
  // If your number of slides is greater than 4 (not recommended) then
  // make sure to increase the `nSlides` variable in the CSS.
  //
  defaults: {
    slides: [{
      content: 'Some herioc content, <a href="#">which can contain HTML</a>',
      class: 'optional classes'
    }, {
      content: '2nd slide with different content'
    }]
  },

  /**
   * Handblebar helper to generate the panel controls,
   * both the radio buttons as well as the arrow labels.
   *
   * @param {Object} data Provided to the iterator.
   * @param {Object} options Optional.
   * @return {String} Generated template
   * @api private
   */
  controls: function controls(data, options) {
    return data.reduce(function reduce(controls, item, n) {
      return controls + options.fn({
        panel: 'panel' + n,
        checked: !n ? ' checked' : ''
      });
    }, '');
  },

  /**
   * Called after Pagelet construction, register handlebar helpers.
   *
   * @api private
   */
  initialize: function initialize() {
    return this.use('carousel', 'controls', this.controls);
  }
}).on(module);