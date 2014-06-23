'use strict';

//
// Expose the creditcard Pagelet.
//
module.exports = require('./pagelet').extend({
  //
  // Brand is replaced by Contour when the Pagelet is fetched from assets.
  //
  view: '{{brand}}/creditcard/view.hbs',
  css: '{{brand}}/creditcard/base.styl',
  js: '{{brand}}/creditcard/base.js',

  //
  // Default data for the navigation, can be changed by using `set`.
  //
  defaults: {
    production: (process.env.NODE_ENV === 'production').toString(),
    required: true,
    validate: false,
    year: (new Date).getFullYear() - 1,
    max_year: 2030,
    month: 0,
    months: [
      'January', 'February', 'March', 'April', 'May', 'June', 'July',
      'August', 'September', 'October', 'November', 'December'
    ]
  },

  /**
   * Handblebar helper to generate month dropdown select options.
   *
   * @param {Object} options
   * @return {String} generated template
   * @api private
   */
  month: function month(options) {
    var content = ''
      , month = this.month;

    while(++month <= 12) {
      content += options.fn({
        month: month,
        selected: +this.expiration_month === month ? ' selected' : '',
        fullMonth: this.months[month - 1]
      });
    }

    return content;
  },

  /**
   * Handblebar helper to generate year dropdown select options.
   *
   * @param {Object} options
   * @return {String} generated template
   * @api private
   */
  year: function year(options) {
    var content = ''
      , year = this.year;

    while(++year < this.max_year) {
      content += options.fn({
        year: year,
        selected: +this.expiration_year === year ? ' selected' : '',
      });
    }

    return content;
  },

  /**
   * Called after Pagelet construction, register handlebar helpers. Also enlist
   * the client side application Creditcard for the loader.
   *
   * @api private
   */
  initialize: function initialize() {
    this.queue.enlist('loader', { apps: [ 'creditcard' ] });

    return this
      .use('creditcard', 'month', this.month)
      .use('creditcard', 'year', this.year);
  }
}).on(module);