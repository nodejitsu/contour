'use strict';

//
// Required native modules.
//
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
// Defaults for Nodejitsu applications.
//
var nodejitsu = exports.nodejitsu = {}
  , npm = exports.npm = {}
  , opsmezzo = exports.opsmezzo = {};

nodejitsu.head = {
  foss: false,
  optimizely: false,
  experiment: false,
  extension: false,
  title: 'Node.js hosting, cloud products and services | Nodejitsu Inc.',
  keywords: [ 'Node.js', 'Nodejitsu', 'cloud', 'jitsu', 'Hosting', 'paas' ],
  canonical: 'https://www.nodejitsu.com/',
  stylesheets: ['https://versions.nodejitsu.com/css/jitsu.dev.css'],
  description: 'Nodejitsu provides a simple, reliable and smart Node.js hosting'
    + ' platform. We serve more than 25,000 developers and 1 million deployments',

  /**
   * Hook to set the correct canonical from the provided url. This will
   * canonicalize jitsu.com and jit.su to nodejitsu.com and limit influence of
   * query strings.
   *
   * @param {Object} data reference to data template is called with
   * @api private
   */
  hook: function canonical(data) {
    if (!('canonical' in data)) {
      data.canonical = [
        'https://',
        pkg.subdomain,
        '.nodejitsu.com',
        url.parse(data.canonical).pathname
      ].join('');
    }
  }
};

//
// Free for open source banner, available in three colors, by default the banner
// will be orange.
//
nodejitsu.foss = {
  color: 'orange'
};

nodejitsu.header = {
  navigation: [
    { name: 'Cloud', href: '/paas/' },
    { name: 'Enterprise', href: '/enterprise/' },
    { name: 'Docs', href: '/documentation/' },
    { name: 'Support', href: '/support/' },
    { name: 'Company', href: '/company/' }
  ],
  root: '',
  login: true,
  signup: false,
  logout: false
};

nodejitsu.twocolumn = {
  one: '',
  two: ''
};

nodejitsu.loader = {
  load: [],
  plain: [],
  external: [],
  apps: [ 'login' ],
  custom: []
};

nodejitsu.footer = {
  navigation: [
    {
      name: 'Company',
      links: {
        Blog: 'https://blog.nodejitsu.com',
        Careers: 'https://www.nodejitsu.com/company/careers/',
        'Service Status': 'https://status.nodejitsu.com'
      }
    },
    {
      name: 'Legal',
      links: {
        'Terms of Service': 'http://legal.nodejitsu.com/terms-of-service.html',
        'Privacy Policy': 'http://legal.nodejitsu.com/privacy.html'
      }
    },
    {
      name: 'Support',
      links: {
        Handbook: 'https://www.nodejitsu.com/documentation/',
        Support: 'https://www.nodejitsu.com/support/',
        Contact: 'https://www.nodejitsu.com/company/contact/'
      }
    }
  ],
  mailinglist: {
    action: 'http://nodejitsu.us2.list-manage.com/subscribe/post',
    u: 'e4a7e45f759ae0d449c3ba923',
    id: '31f76174d4'
  },
  social: {
    twitter: 'nodejitsu',
    github: "nodejitsu"
  },

  copyright: '&copy; Nodejitsu Inc. '+ (new Date()).getFullYear(),
  credits: false
};

nodejitsu.sidebar = {
  menu: [
    { name: 'Private Cloud', href: '/enterprise/private-cloud/' },
    { name: 'Conservatory', href: '/enterprise/conservatory/' },
    { name: 'Orchestrion', href: '/enterprise/orchestrion/' },
    { name: 'Professional Services', href: '/enterprise/professional-services/' }
  ],
  page: ''
};

nodejitsu.breadcrumb = [
  { href: '#', text: 'Section' }
];

nodejitsu.submit = {
  type: 'plain',
  collection: {
    plain: {
      class: 'btn',
      text: 'Submit'
    },
    action: {
      class: 'action',
      text: 'Call to action'
    },
    login: {
      class: 'action',
      text: 'Log in'
    },
    password: {
      class: 'action',
      text: 'Reset password'
    },
    icon: {
      class: 'btn-icon',
      text: 'Default'
    }
  }
};

nodejitsu.button = {
  type: 'plain',
  href: '',
  collection: {
    plain: {
      class: 'btn',
      text: 'Submit'
    },
    icon: {
      class: 'btn-icon',
      text: 'Default'
    },
    action: {
      class: 'btn action',
      text: 'Contact us'
    }
  }
};

nodejitsu.alert = {
  closable: false,
  type: 'notice',
  text: '',

  /**
   * Add application initialisation to the loader
   *
   * @param {Object} data reference to data template is called with
   * @api private
   */
  hook: function infect(data) {
    // Only initialize closable alerts if required.
    if (data.closable) {
      this._queue.enlist('loader', { custom: [ 'alert' ] });
    }
  }
};

nodejitsu.pills = {
  navigation: [
    { name: 'Individual plans', page: 'individual-plans', active: true },
    { name: 'Business plans', page: 'business-plans' }
  ],
  class: '',
  page: '',

  /**
   * Hook to add additional JS to loader.plain
   *
   * @param {Object} data reference to data template is called with
   * @api private
   */
  hook: function infect(data) {
    // Only initialize pills if required.
    if ('swap' in data.navigation[0]) {
      this._queue.enlist('loader', { custom: [ 'pills' ] });
    }
  }
};

nodejitsu.leader = {
  title: 'Getting Started',
  text: 'Learn how to set up Nodejitsu\'s tool for app deployment and be ready for action.',
  button:  nodejitsu.button
};

nodejitsu.social = {
  layout: 'horizontal',
  domain: 'https://www.nodejitsu.com',
  load: [ 'twitter', 'facebook', 'hackernews' ],
  href: {
    twitter: '//platform.twitter.com/widgets.js',
    facebook: '//connect.facebook.net/en_US/all.js#xfbml=1',
    hackernews: '//hnbutton.appspot.com/static/hn.min.js'
  },

  /**
   * Hook to add additional JS to loader.plain
   *
   * @param {Object} data reference to data template is called with
   * @api private
   */
  hook: function infect(data) {
    var ref = this._options.defaults.social,
        cur = this._queue.store.loader,
        def = [];

    if (cur && cur.external) def = cur.external;

    Object.keys(ref.href).forEach(function checkDefaults(key) {
      // Check what social media to load, if none provided load defaults in `load`.
      var add = data && data.load
        ? ~data.load.indexOf(key)
        : ~ref.load.indexOf(key);

      if (add && !~def.indexOf(ref.href[key])) def.push(ref.href[key]);
    });

    // Only add the social media script if it was not already added to defaults.
    this._queue.enlist('loader', { external: def });
  }
};

//
// Tooltip defaults, the tooltip is toggled by clicking the generated hyperlink.
// It will place the generated div below the hyperlink by default.
//
nodejitsu.tooltip = {
  placement: 'bottom',
  color: 'blue',
  trigger: 'mouseover',
  content: '',

  /**
   * Add application initialisation to the loader
   *
   * @param {Object} data reference to data template is called with
   * @api private
   */
  hook: function infect(data) {
    this._queue.enlist('loader', { custom: [ 'tooltip' ] });
  }
};

//
// Creditcard template defaults, require will add HTML5 require attributes to
// each element in the form. Validate: true will trigger client side validation.
//
nodejitsu.creditcard = {
  required: true,
  data: {},
  validate: false,
  year: (new Date).getFullYear() - 1,
  max_year: 2030,
  month: 0,
  months: [
    'January', 'February', 'March', 'April', 'May', 'June', 'July',
    'August', 'September', 'October', 'November', 'December'
  ]
};

nodejitsu.analytics = {
  domain: 'nodejitsu.com',
  ids: {
    ga: [ 'UA-24971485-6' ]
  },

  /**
   * Determine inclusion logic of both GA or segment.io for logic-free template.
   *
   * @param {Object} data reference to data template is called with
   * @api private
   */
  hook: function infect(data) {
    var ids = data.ids || {};

    //
    // Switch values based on environment, safe mode in development.
    //
    if (!data.production && process.env.NODE_ENV !== 'production') {
      data.domain = 'none';
      ids.ga = [ 'UA-24971485-6' ];

      if (ids.segment) ids.segment = {
        key: 'r63vj4bdi7',
        ga: 'UA-24971485-6'
      };
    }

    //
    // Filter the GA tracker ID for the key listed at ids.segment.ga
    //
    if (ids.segment) ids.ga = ids.ga.filter(function (id) {
      return id !== ids.segment.ga;
    });

    data.segment = 'segment' in ids;
    data.multi = data.segment && ids.ga.length;
    data.ga = data.multi || !data.segment;

    this._queue.enlist('loader', { custom: [ 'analytics' ] });
  }
};
