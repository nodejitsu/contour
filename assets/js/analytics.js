/*globals ga,escape,analytics*/
'use strict';

/**
 * Google analytics API wrapper.
 *
 * @constructor
 */
Cortex.app('Analytics', Cortex.View.extend({
    selector: '[data-track]'

    /**
     * Log click actions
     *
     * @type {Object}
     */
  , delegate: {
      'click': 'track'
    }

    /**
     * Template to use with the tracking beacon.
     *
     * @type {Array}
     */
  , properties: [ 'category', 'label', 'revenue' ]

    /**
     * Defer analytics to the analytic integrations. If segment.io is available
     * use that and also trigger GA if multiple trackers are used.
     *
     * @api private
     */
  , track: function () {
      if (this.tracking.segment.enabled) this.segment.apply(this, arguments);
      if (this.tracking.ga.enabled) this.google.apply(this, arguments);
    }

    /**
     * Map data to properties in consequtive order.
     *
     * @param {Array} data collection
     * @api private
     */
  , map: function map(data) {
      var result = {}
        , i = this.properties.length;

      while (i--) result[this.properties[i]] = data[i];
      return result;
    }

    /**
     * Track event and send it to segment.io, mapping data to properties.
     *
     * @param {Event} e
     * @api private
     */
  , segment: function log(e) {
      var data = $(e.element).get('track').split(';');

      // Revenue only allows numbers remove it if it is not a number.
      if ('number' !== typeof data[3]) data.splice(3);
      analytics.track(data.splice(0, 1), this.map(data));
    }

    /**
     * Track the event and send beacon to all remaining trackers.
     *
     * @param {Event} e
     * @api private
     */
  , google: function google(e) {
      var trackers = this.tracking.ga.tracker;
      if (!trackers.length) return;

      ga(function done() {
        trackers.forEach(function loopTracker(tracker) {
          ga.getByName(tracker).send.apply(
            tracker,
            [ 'event' ].concat($(e.element).get('track').split(';'))
          );
        });
      });
    }

    /**
     * Do some very special A/B testing magic.
     *
     * @api private
     */
  , initialize: function initialize() {
      var query = (location.search || '').slice(1)
        , search = {}
        , qs = [];

      Cortex.forEach(query.split('&'), function parse(item) {
        var kv = item.split('=');
        search[kv[0]] = kv[1];
      });

      //
      // This fix is specificly for A/B tests
      //
      if (!search.utm_expid || !search.utm_referrer) return;
      search.utm_referrer = escape(location.protocol +'//'+ location.host + location.pathname);

      qs = Cortex.map(search, function compile(value, key) {
        return key + '=' + value;
      }).join('&');

      $('a').each(function each(node) {
        if (node.get('search')) return; // This href already has a search query

        node.set('search', qs);
      });

      $('form').each(function each(node) {
        var action = node.get('action') || '';

        if (
          !node.get('method')
        || node.get('method').toLowerCase() === 'get'
        || ~action.indexOf('?')
        ) return;

        node.set('action', action +'?'+ qs);
      });
    }
}), { once: 'analytics' });
