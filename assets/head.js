'use strict';

var url = require('url')
  , fs = require('fs');

//
// Find the path to root. The mainModule isn't always defined,
// so merge it with the current working dir
//
var pkg = require((
  process.mainModule ? process.mainModule.paths : []
).concat(process.cwd()).map(function addPackageJSON(path) {
  return path + (~path.indexOf('node_modules') ? '/..' : '') + '/package.json';
}).filter(fs.existsSync)[0]);

//
// Expose the head Pagelet.
//
require('./pagelet').extend({
  view: '{{brand}}/head/view.hbs',

  //
  // Default data for alert notificiation, can be changed by using `set`.
  //
  defaults: {
    optimizely: false,
    extension: false,
    title: 'Node.js hosting, cloud products and services | Nodejitsu Inc.',
    keywords: [ 'Node.js', 'Nodejitsu', 'cloud', 'jitsu', 'Hosting', 'paas' ],
    canonical: 'https://www.nodejitsu.com/',
    stylesheets: ['https://versions.nodejitsu.com/css/jitsu.dev.css'],
    description: 'Nodejitsu provides a simple, reliable and smart Node.js hosting'
      + ' platform. We serve more than 25,000 developers and 1 million deployments'
  },

  //
  // Enlist the client side JS app Alert, which will be added if loader is called.
  //
  initialize: function initialize() {
    //
    // Always set a canonical reference on the data.
    //
    if (!('canonical' in this.data)) {
      this.data.canonical = [
        'https://',
        pkg.subdomain,
        '.nodejitsu.com',
        url.parse(this.data.canonical).pathname
      ].join('');
    }
  }
}).on(module);