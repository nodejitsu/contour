//
// Expose nodejitsu alert box styles.
//
exports.nodejitsu = [
  {
    source: 'stylus/alert.styl',
    meta: {
      description: 'Alert box styles',
      weight: 888
    }
  },
  {
    source: 'js/alert.js',
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
     description: 'Makes alerts closable by the visitor',
     weight: 997
    }
  }
];

//
// Expose opsmezzo alert box styles
// TODO: needs to be implemented
//
exports.opsmezzo = [];
