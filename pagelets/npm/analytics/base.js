/*globals pipe,ga,analytics*/
'use strict';

//
// Initialization based on the used analytics tool.
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