'use strict';

//
// Required modules.
//
var merge = require('predefine').merge;

/**
 * Queue constructor.
 *
 * @Constructor
 * @api public
 */
function Queue() {
  this.store = {};
}

/**
 * Enlist data for specific template type.
 *
 * @param {String} type
 * @param {Object} data
 * @return {Queue} this
 * @api public
 */
Queue.prototype.enlist = function enlist(type, data) {
  data = merge((this.store[type] || {}), data);
  this.store[type] = data;
  return this;
};

/**
 * Discharge data, remove it from the store after use.
 *
 * @param {String} type
 * @param {Object} data
 * @return {Object} object from store
 * @api public
 */
Queue.prototype.discharge = function discharge(type) {
  if (!(type in this.store)) return {};
  var value = this.store[type];

  // Remove the content so it does not infect other templates.
  delete this.store[type];
  return value;
};

//
// Expose the constructor
//
module.exports = Queue;
