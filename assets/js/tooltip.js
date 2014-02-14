'use strict';

/**
 * Generate tooltip content and place near trigger.
 *
 * @constructor
 */
Cortex.app('Tooltip', Cortex.View.extend({
  selector: '[data-tooltip]',

  /**
   * Delegate the events.
   *
   * @type {Object}
   */
  delegate: {
    'click': 'create',
    'mouseover': 'create',
    'mouseout': 'remove'
  },

  /**
   * Delay in milliseconds before the tooltip is displayed.
   *
   * @type {Number}
   */
  delay: 60,

  /**
   * Offset calculations for placement: bottom.
   *
   * @param {Object} element tooltip
   * @param {Object} source initiating element
   * @api private
   */
  placement: function (type, element, source) {
    switch(type) {
      case 'right':
        return {
          left: 10 + source.offsetWidth,
          top: (element.offsetHeight / -2) + (source.offsetHeight / 2)
        };
      case 'left':
        return {
          left: -10 - element.offsetWidth,
          top: (element.offsetHeight / -2) + (source.offsetHeight / 2)
        };
      case 'top':
        return {
          left: (element.offsetWidth / -2) + (source.offsetWidth / 2),
          top: -10 - element.offsetHeight
        };
      case 'bottom':
      default:
        return {
          left: (element.offsetWidth / -2) + (source.offsetWidth / 2),
          top: 10 + source.offsetHeight
        };
    }
  },

  /**
   * Calculate the position of the current element that acted as trigger. Used
   * for proper position of the tooltip.
   *
   * @param {Object} element
   * @return {Object} offsets top and left
   * @api private
   */
  offset: function (element) {
    var left = 0
      , top = 0;

    do {
      left += element.offsetLeft;
      top += element.offsetTop;
    } while (element = element.offsetParent);

    return {
      left: left,
      top: top
    };
  },

  /**
   * Should this event trigger the tooltip?
   *
   * @param {Event} event
   * @param {String} target compare to type of target
   * @returns {Boolean}
   * @api private
   */
  trigger: function trigger(event, target) {
    target = target || event.type;
    if (target === 'mouseout') target = 'mouseover';

    return target === $(event.element).get('data-trigger');
  },

  /**
   * Trigger rendering of the tooltip after a slight delay, less twitchy more
   * user friendly.
   *
   * @param {Event} event
   * @api public
   */
  create: function create(event) {
    if ('preventDefault' in event) event.preventDefault();

    if (!this.trigger(event)) return;
    if (this.trigger(event, 'click') && this.remove(event)) return;

    //
    // Create a new tooltip, but make sure to destroy remaining ones before.
    //
    this.timer = setTimeout(function execute() {
      this.render(event);
    }.bind(this), this.delay);
  },

  /**
   * Remove the tooltip, can only be triggered if it actually exists.
   *
   * @returns {Boolean} was tooltip removed or not
   * @api public
   */
  remove: function remove(event) {
    //
    // Current event is not set as trigger (e.g. mouse click vs. hover).
    //
    if (!this.trigger(event)) return false;
    if ('preventDefault' in event) event.preventDefault();

    clearTimeout(this.timer);
    var id = document.getElementById('tooltip');
    return id ? !!document.body.removeChild(id) : false;
  },

  /**
   * Render the tooltip.
   *
   * @param {Event} event
   * @api private
   */
  render: function render(event) {
    var tooltip = document.createElement('div')
      , element = $(event.element)
      , pos = element.get('data-placement')
      , offset = this.offset(event.element)
      , placement;

    //
    // Create the tooltip with the proper content and insert.
    //
    tooltip.id = "tooltip";
    tooltip.innerHTML = element.get('data-content');
    tooltip.className = ['animated', 'tooltip', 'fadeIn', pos].filter(Boolean).join(' ');
    document.body.appendChild(tooltip);

    //
    // Update the position of the tooltip.
    //
    placement = this.placement(pos, tooltip, event.element);
    tooltip.setAttribute('style', [
      'left:' + (offset.left + placement.left) + 'px',
      'top:' + (offset.top + placement.top) + 'px'
    ].join(';'));
  }
}), { once: 'tooltip' });
