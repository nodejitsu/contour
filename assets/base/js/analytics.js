/*globals pipe,ga,escape,analytics*/
'use strict';

//
// Used the proper initialization based on the used analytics tool.
//
pipe.once('analytics:initialize', function init(pagelet) {
  switch (pagelet.data.type) {
    case 'ga':
      ga('create', pagelet.data.key, pagelet.data.domain);
      ga('send', 'pageview');
    break;

    case 'segment':
      window.analytics.load(pagelet.data.key);
      window.analytics.page();
    break;
  }
});

///*globals ga,escape,analytics*/
//'use strict';
//
///**
// * Google analytics API wrapper.
// *
// * @constructor
// */
//Cortex.app('Analytics', Cortex.View.extend({
//    selector: '[data-track]'
//
//    /**
//     * Log click actions
//     *
//     * @type {Object}
//     */
//  , delegate: {
//      'click': 'track'
//    }
//
//    /**
//     * Template to use with the tracking beacon.
//     *
//     * @type {Array}
//     */
//  , properties: [ 'category', 'label', 'revenue' ]
//
//    /**
//     * Defer analytics to the analytic integrations. If segment.io is available
//     * use that and also trigger GA if multiple trackers are used.
//     *
//     * @api private
//     */
//  , track: function () {
//      if ('segment' in this.tracking) this.segment.apply(this, arguments);
//      if ('ga' in this.tracking) this.google.apply(this, arguments);
//    }
//
//    /**
//     * Map data to properties in consequtive order.
//     *
//     * @param {Array} data collection
//     * @api private
//     */
//  , map: function map(data) {
//      var result = {}
//        , i = this.properties.length;
//
//      while (i--) result[this.properties[i]] = data[i];
//      return result;
//    }
//
//    /**
//     * Track event and send it to segment.io, mapping data to properties.
//     *
//     * @param {Event} e
//     * @api private
//     */
//  , segment: function log(e) {
//      var data = $(e.element).get('track').split(';');
//
//      // Revenue only allows numbers remove it if it is not a number.
//      if ('number' !== typeof data[3]) data.splice(3);
//      analytics.track(data.splice(0, 1), this.map(data));
//    }
//
//    /**
//     * Track the event and send beacon to all remaining trackers.
//     *
//     * @param {Event} e
//     * @api private
//     */
//  , google: function google(e) {
//      var tracker = this.tracking.ga;
//      if (!tracker) return;
//
//      ga(function done() {
//        ga.getByName(tracker).send.apply(
//          tracker,
//          [ 'event' ].concat($(e.element).get('track').split(';'))
//        );
//      });
//    }
//}), { once: 'analytics' });
