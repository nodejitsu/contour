'use strict';

/**
 * Smoothly animated scroll to anchor links.
 *
 * @constructor
 */
Cortex.app('Anchor', Cortex.View.extend({
  selector: '[data-scroll]',

  /**
   * Speed to run the scroll at.
   *
   * @type {Number}
   */
  speed: 40,

  /**
   * Delegate the events.
   *
   * @type {Object}
   */
  delegate: {
    'click': 'scroll'
  },

  /**
   * Scroll to the target of data-scroll.
   *
   * @param {Event} e
   * @api private
   */
  scroll: function scroll(e) {
    var attr = e.element.attributes;

    if (!(attr || attr.href)) return;
    var target = $(attr.href.value).plain(0);

    if (!target) return;
    e.preventDefault();

    //
    // Store the current window top Y and difference.
    //
    this.y = document.body.scrollTop;
    this.target = target.offsetTop;
    this.direction = this.target > this.y ? 1 : -1;
    this.delta = Math.abs(this.y - this.target);

    //
    // Start the animation.
    //
    this.animated = setInterval(this.animate.bind(this), 10);
  },

  /**
   * Calculations for the animation.
   *
   * @api private
   */
  animate: function animate() {
    var diff = this.speed;

    //
    // If we're getting close to the endpoint stop at 0.
    //
    if (this.delta < diff) {
      clearInterval(this.animated);
      diff = this.delta;
    }

    //
    // Keep track of how much is scrolled.
    //
    this.delta = this.delta - diff;
    this.y = this.y + diff * this.direction;

    //
    // Animate the scroll position.
    //
    window.scrollTo(0, this.y);
  }
}), { once: 'anchor' });
