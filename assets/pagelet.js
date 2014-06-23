'use strict';

//
// Required modules.
//
var queue = require('../queue')
  , Pagelet = require('pagelet')
  , async = require('async')
  , wrapJS = require('../static/wrap')
  , pagelet;

/**
 * Return a mapping function with preset brand.
 *
 * @param {String} brand
 * @returns {Function} mapper
 * @api private
 */
function use(brand) {
  return function branding(file) {
    return file.replace('{{brand}}', brand);
  };
}

/**
 * Set a specific branch. Used by temper to fetch all the proper assets.
 *
 * @param {String} brand
 * @param {Boolean} standalone, force pagelet to standalone mode
 * @returns {Pagelet} fluent interface
 * @api private
 */
Pagelet.brand = function define(brand, standalone) {
  var prototype = this.prototype;

  //
  // Traverse the pagelet to initialize any child pagelets.
  //
  this.traverse(this.name);

  //
  // Run each of the child pagelets through this special branding function as well.
  //
  if (prototype.pagelets) Object.keys(prototype.pagelets).forEach(function loop(name) {
    prototype.pagelets[name].brand(brand);
  });

  //
  // Set the fragment such that only the template is rendered.
  //
  if (standalone) prototype.fragment = '{pagelet:template}';

  //
  // Use nodejitsu as default brand.
  //
  brand = use(brand ? brand : 'nodejitsu');
  prototype.view = brand(prototype.view);

  //
  // CSS and JS will be supplied as arrays, replace paths with brand.
  //
  if (prototype.css) prototype.css = Array.isArray(prototype.css)
    ? prototype.css.map(brand)
    : brand(prototype.css);

  if (prototype.js) prototype.js = Array.isArray(prototype.js)
    ? prototype.js.map(brand)
    : brand(prototype.js);

  prototype.dependencies = prototype.dependencies.map(brand);
  return this.optimize();
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
    data: this.prototype.mixin(data, this.prototype.data)
  }));
};

//
// Add additional functionality and expose the extended Pagelet.
//
module.exports = pagelet = Pagelet.extend({
  /**
   * Extend the default constructor to always call `initialize` by default.
   *
   * @Constructor
   * @return {Pagelet}
   * @api private
   */
  constructor: function constructor() {
    pagelet.__super__.constructor.apply(this);

    this.initialize();
    return this;
  },

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
    this.temper.require('handlebars').registerHelper(
      this.name || namespace + '-' + name,
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
    var self = this;

    return function inject(fn) {
      self.render(function parent(error, base) {
        if (error) return fn(error);
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
   * Some Pagelets require JS that needs to be wrapped with a Cortex initialization
   * script. This getter provides easy access to the content.
   *
   * @return {Object} parts of the Cortex load script.
   * @api public
   */
  get wrap() {
    return wrapJS;
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
    return this.define();
  }
});