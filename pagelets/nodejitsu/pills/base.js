'use strict';

/**
 * Simple pill magic for content swapping.
 *
 * @constructor
 */
Cortex.app('Pills', Cortex.View.extend({
  selector: '.pills',

  /**
   * Parsed pill options.
   *
   * @type {Array}
   */
  options: [],

  /**
   * Delegate the events.
   *
   * @type {Object}
   */
  delegate: {
    'click [data-swap]': 'swap'
  },

  /**
   * Check if we need to show another tab by hash.
   *
   * @api private
   */
  initialize: function initialize() {
    var hash = window.location.hash
      , self = this;

    $('.pills a').structures.forEach(function getIDs(pill) {
      self.options.push(pill.get('data-id'));
    });

    //
    // If there already is a hash jump to the active one.
    //
    if (hash.match(new RegExp('^#(' + this.options.join('|') + ')$'))) {
      this.swap({}, hash.slice(1));
    }
  },

  /**
   * Swap the different views
   *
   * @param {Event} e
   * @param {String} to force tab by hash
   * @api private
   */
  swap: function swap(e, to) {
    if ('preventDefault' in e) e.preventDefault();

    var item = $(e.element || '[data-id="' + to + '"]');
    if (!!~item.get('className').indexOf('active')) return;

    var parent = item.parent()
      , effect = item.get('effect').split(',')
      , change = item.get('swap').split('@')
      , current = $(change[0])
      , show = $(change[1]);

    //
    // Check if the effect was actually a proper list.
    //
    if (effect.length < 2) effect = ['fadeOut', 'fadeIn'];

    current.addClass(effect[0]).removeClass(effect[1]);
    parent.find('.active').removeClass('active');
    item.addClass('active');

    setTimeout(function () {
      current.addClass('gone');

      //
      // Redraw elements if they were not visible.
      //
      if (~show.get('className').indexOf('gone')) {
        show.removeClass('gone ' + effect[0]).addClass(effect[1]);
      }

      //
      // Append hash for correct routing, will also jump to element with id=data-id
      //
      location.hash = item.get('data-id');
    }, 500);
  }
}), { once: 'pills' });
