'use strict';

/**
 * Client side validation of credit cards.
 *
 * @constructor
 */
Cortex.app('Creditcard', Cortex.View.extend({
  selector: '.creditcard',

  /**
   * Should input be validated?
   *
   * @type {Boolean}
   */
  validate: false,

  /**
   * Delegate the events.
   *
   * @type {Object}
   */
  delegate: {
    'keyup input[name="full_number"]': 'number',
    'blur input[name="full_number"]': 'number',
    'keyup input[name="cvv"]': 'cvv',
    'blur input[name="cvv"]': 'cvv',
    'change select': 'date'
  },

  /**
   * Import the credit card library and store a reference in lib.
   *
   * @api private
   */
  initialize: function initialize() {
    var creditcard;
    // [square] @import "creditcard/index.js"
    this.lib = creditcard;

    //
    // Create references to elements.
    //
    this.number = this.$('input[name="full_number"]');
    this.cvv = this.$('input[name="cvv"]');
    this.year = this.$('select[name="expiration_year"]');
    this.month = this.$('select[name="expiration_month"]');
    this.card = this.$('.card');

    //
    // Is validation required?
    //
    this.validate = !!this.$el.get('validate');
  },

  /**
   * Only allow numbers in the number field.
   *
   * @api private
   */
  digit: function digit(event) {
    var element = event.element
      , code = event.keyCode || event.which
      , result;

    result = (code >= 48 && code <= 57) || code === 8 || code === 46;
    if (!result) event.preventDefault();

    return {
      allowed: result,
      code: code,
      removal: code === 8 || code === 48
    };
  },

  /**
   * On date changes, year or month, check expiration date.
   *
   * @param {Event} event
   * @api private
   */
  date: function date(event) {
    var result = this.lib.expiry(this.month.get('value'), this.year.get('value'))
      , className = result ? 'valid' : 'invalid';

    //
    // Update both select boxes.
    //
    this.month.removeClass('invalid').addClass(className);
    this.year.removeClass('invalid').addClass(className);
  },

  /**
   * On credit card number changes, add spaces and check validaty.
   *
   * @param {Event} event
   * @api private
   */
  number: function number(event) {
    var element = event.element
      , value = element.value
      , key = this.digit(event)
      , valid;

    //
    // Input must be numerical.
    //
    if (!key.allowed && event.type !== 'blur') return;

    //
    // Always format if the event is of type blur. This will ensure the input
    // box does not stay red on blur if formatted value is valid.
    //
    if (event.type === 'blur') this.number.set('value', this.lib.format(value));

    //
    // Check if the number is valid.
    //
    if (value.replace(/\D/g, '').length >= 16 || key.removal) {
      valid = this.lib.validate(value);

      //
      // Show card type or hide if invalid.
      //
      this.card[valid ? 'removeClass' : 'addClass']('gone');
      this.card.find('strong').set('innerHTML', this.lib.cardscheme(value));

      if (this.validate) {
        //
        // Check against testnumbers in production mode. Valid should be checked
        // as well, otherwise an incomplete credit card number would be valid.
        //
        if (this.production) {
          valid = valid && !~this.lib.testnumbers.indexOf(+value.replace(/\D/g, ''));
        }

        //
        // Update the styling of the input.
        //
        this.number.set('className', valid ? 'valid' : 'invalid');
      }
    }

    //
    // Add spaces for each block of 4 characters.
    //
    this.number.set('value', this.lib.format(value));
  },

  /**
   * On cvv changes check the content and validate.
   *
   * @param {Event} event
   * @api private
   */
  cvv: function cvv(event) {
    var element = event.element
      , value = element.value
      , key = this.digit(event);

    //
    // Input must be numerical.
    //
    if (!key.allowed && event.type !== 'blur') return;

    //
    // Check if the number is valid.
    //
    if (this.validate && (value.length >= 3 || key.removal)) {
      this.cvv.set(
        'className',
        this.lib.parse(this.number.get('value')).cvv === value.length ? 'valid' : 'invalid'
      );
    }
  }
}), { once: 'creditcard' });
