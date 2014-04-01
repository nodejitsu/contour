//
// Expose nodejitsu pills styles.
//
exports.nodejitsu = [
  {
    source: 'stylus/pills.styl',
    meta: {
      description: 'Navigation pills style',
      weight: 890
    }
  },
  {
    source: 'js/pills.js',
    configuration: {
      plugins: {
        wrap: {
          header: '("Cortex" in this ? Cortex : (Cortex = [])).push("jitsu", function (Cortex) {',
          footer: '$("#loader").get("apps").split(",").forEach(function (n) { Cortex.active.emit(n); });})',
          leaks: false
        }
      }
    },
    meta: {
      description: 'Cortex app for dynamic pill controls',
      weight: 998
    }
  }
];

//
// Expose npm pills styles.
//
exports.npm = [
  {
    source: 'npm/stylus/pills.styl',
    meta: {
      description: 'Navigation pills style',
      weight: 890
    }
  },
  {
    source: 'js/pills.js',
    meta: {
      description: 'Cortex app for dynamic pill controls',
      weight: 998
    }
  }
];

//
// Expose opsmezzo pills styles
// TODO: needs to be implemented
//
exports.opsmezzo = [];
