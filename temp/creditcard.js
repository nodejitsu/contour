//
// Expose nodejitsu creditcard styles.
//
exports.nodejitsu = [
  {
    source: 'stylus/creditcard.styl',
    meta: {
      description: 'Credit card form styles',
      weight: 887
    }
  },
  {
    source: 'js/creditcard.js',
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
     description: 'Client side validation of creditcards',
     weight: 996
    }
  }
];
