'use strict';

/**
 * Make alerts closable by the user.
 *
 * @constructor
 */
Cortex.app('Alert', Cortex.View.extend({
    selector: '.alert'

    /**
     * Delegate the events.
     *
     * @type {Object}
     */
  , delegate: {
        'click .close': 'close'
    }

    /**
     * Close the parent alert by adding .gone
     *
     * @param {Event} e
     * @api private
     */
  , close: function close(e) {
      if ('preventDefault' in e) e.preventDefault();

      $(e.element).parent().addClass('gone');
    }
}), { once: 'alert' });
