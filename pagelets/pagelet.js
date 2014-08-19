'use strict';

var Pagelet = require('pagelet')
  , cheerio = require('cheerio')
  , queue = require('../queue')
  , async = require('async')
  , fs = require('fs')
  , pagelet;

/**
 * Return a mapping function with preset brand, will default to nodejitsu files if
 * the requested branded file does not exist.
 *
 * @param {String} brand
 * @returns {Function} mapper
 * @api private
 */
function use(brand) {
  return function branding(file) {
    var branded = file.replace('{{brand}}', brand);
    return fs.existsSync(branded) ? branded : file.replace('{{brand}}', 'nodejitsu');
  };
}

/**
 * Set a specific branch. Used by temper to fetch all the proper assets.
 *
 * @param {String} brand
 * @param {Boolean} standalone, force pagelet to standalone mode
 * @param {Function} done Completion callback.
 * @returns {Pagelet} fluent interface
 * @api private
 */
Pagelet.brand = function define(brand, standalone, done) {
  var prototype = this.prototype
    , brander = use(brand);

  //
  // Traverse the pagelet to initialize any child pagelets.
  //
  this.traverse(this.name || this.prototype.name);
  return this.extend({
    //
    // Run each of the child pagelets through this special branding function as well.
    //
    pagelets: Object.keys(prototype.pagelets || {}).reduce(function reduce(memo, name) {
      memo[name] = prototype.pagelets[name].brand(brand, standalone);
      return memo;
    }, {}),

    //
    // Set the fragment such that only the template is rendered.
    //
    fragment: standalone ? '{pagelet:template}' : prototype.fragment,

    //
    // Use nodejitsu as default brand.
    //
    view: brander(prototype.view)
  }).optimize({ transform: function transform(Pagelet) {
    prototype = Pagelet.prototype;

    //
    // Replace paths in CSS, JS and dependencies.
    //
    prototype.css = prototype.css ? prototype.css.map(brander) : [];
    prototype.js = prototype.js ? prototype.js.map(brander) : [];
    prototype.dependencies = prototype.dependencies ? prototype.dependencies.map(brander) : [];
  }}, done);
};

/**
 * Fetch some values of the Pagelets' original prototype.
 *
 * @param {String} key prototype key
 * @return {Mixed} value
 */
Pagelet.fetch = function fetch(key) {
  return this.prototype[key];
};

/**
 * Update the dataset for the current pagelet and return a new instance.
 *
 * @param {Object} data properties
 * @api public
 */
Pagelet.set = function set(data) {
  if ('object' !== typeof data) return this;

  return new (this.extend({
    data: this.prototype.mixin({}, this.prototype.data, data)
  }));
};

//
// Add additional functionality and expose the extended Pagelet.
//
module.exports = pagelet = Pagelet.extend({
  /**
   * Set empty name, such that recursive Pagelets will have their name properly set
   * to the key of the object that references them.
   *
   * @type {String}
   * @api public
   */
  name: '',

  /**
   * Reference to the queue singleton.
   *
   * @type {Queue}
   * @api private
   */
  queue: queue,

  /**
   * Default data for the template.
   *
   * @type {Object}
   * @api public
   */
  data: {},

  /**
   * Data that will be used for rendering but is unlikely to be changed.
   *
   * @type {Object}
   * @api public
   */
  defaults: {},

  /**
   * Provide data to the template render method. Can be called sync and async.
   *
   * @param {Function} done completion callback
   * @api private
   */
  get: function get(done) {
    this.define();
    done(undefined, this.mixin({}, this.defaults, this.data, this.merge(
      this.data,
      this.queue.discharge(this.name)
    )));
  },

  /**
   * Register provided helper with handlebars.
   *
   * @param {String} namespace Name of the Pagelet the helper was registered from.
   * @param {String} name Registered name
   * @param {Function} fn Handlebars helper
   * @api public
   */
  use: function use(namespace, name, fn) {
    name = name || this.name;
    this.temper.require('handlebars').registerHelper(
      namespace + '-' + name,
      fn
    );

    return this;
  },

  /**
   * Inject rendered pagelets in the base view, which can also be a pagelet view.
   *
   * @param {Function} fn completion callback.
   * @returns {Function}
   * @api public
   */
  get inject() {
    var self = this
      , data = this.data
      , $;

    //
    // Initialize before returning inject functionality.
    //
    this.initialize();
    return function inject(fn) {
      self.render(function parent(error, base) {
        if (error) return fn(error);

        //
        // Allow data-attributes to be changed on the fly by cheerio.
        //
        if (data && data.attributes) {
          $ = cheerio.load(base);

          Object.keys(data.attributes).forEach(function loopAttributes(selector) {
            var attr = data.attributes[selector];
            Object.keys(attr).forEach(function loopDataKeys(key) {
              $(selector).attr('data-' + key, attr[key]);
            });
          });

          base = $.html();
        }

        //
        // Process all child pagelets, if any.
        //
        if (!self.pagelets) return fn(null, base);
        async.each(Object.keys(self.pagelets), function children(name, next) {
          (new self.pagelets[name]).inject(function insert(error, view) {
            if (error) return next(error);

            [
              "data-pagelet='"+ name +"'",
              'data-pagelet="'+ name +'"',
              'data-pagelet='+ name,
            ].forEach(function locate(attribute) {
              var index = base.indexOf(attribute)
                , end;

              //
              // As multiple versions of the pagelet can be included in to one single
              // page we need to search for multiple occurrences of the `data-pagelet`
              // attribute.
              //
              while (~index) {
                end = base.indexOf('>', index);

                if (~end) {
                  base = base.slice(0, end + 1) + view + base.slice(end + 1);
                  index = end + 1 + view.length;
                }

                index = base.indexOf(attribute, index + 1);
              }
            });

            next();
          });
        }, function done(error) {
          fn(error, base);
        });
      });
    };
  },

  /**
   * Hook to define some values based on defaults. Can be overriden, will be called
   * by initialize by default. If you override this function make sure to
   * return this.
   *
   * @return {Pagelet}
   * @api private
   */
  define: function define() {
    return this;
  },

  /**
   * Give the default pagelet an empty initialize, so its always callable.
   *
   * @returns {Pagelet}
   * @api public
   */
  initialize: function initialize() {
    return this;
  }
});