'use strict';

/**
 * Automatically iterate over the slider.
 *
 * @constructor
 * @api public
 */
Cortex.app('Slider', Cortex.View.extend({
    selector: '.carousel, .carousel-control'

    /**
     * The events.
     *
     * @type {Object}
     */
  , delegate: {
        'mouseover': 'stop'
      , 'mouseout': 'start'
    }

    /**
     * Detech touch devices, because we don't want to activate the slider
     * automatically for them.
     *
     * @type {Boolean}
     * @api private
     */
  , touch: !!('ontouchstart' in window) || navigator.msMaxTouchPoints

    /**
     * Reference to the setInterval.
     *
     * @type {setInterval}
     * @api private
     */
  , interval: null

    /**
     * The current panel that is open.
     *
     * @type {Number}
     * @api private
     */
  , current: 0

    /**
     * Reference to the panels
     *
     * @type {Cortex}
     * @api private
     */
  , panels: null

    /**
     * Configure the slider, figure out how many panels we have and start the
     * slider.
     */
  , initialize: function initialize() {
      this.panels = $('input[name="panel"]');
      this.start();
    }

    /**
     * Start the slider.
     *
     * @api private
     */
  , start: function start() {
      if (!this.$el.length || this.touch) return;

      var current = $('input[name="panel"]:checked').plain(0)
        , self = this;

      this.stop();
      this.interval = setInterval(function () {
        // Prevent current overflowing
        if (++self.current >= self.panels.length) self.current = 0;

        self.panels.plain(self.current).checked = true;
      }, 5000);

      // Set the correct current panel
      this.current = this.panels.plain().indexOf(current);
    }

    /**
     * Stop the slider.
     *
     * @api private
     */
  , stop: function stop() {
      clearInterval(this.interval);
    }
}), { once: 'slider' });