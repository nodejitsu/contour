//
// Expose nodejitsu tooltip styles.
//
exports.nodejitsu = [
  {
    source: 'stylus/tooltip.styl',
    meta: {
      description: 'Tooltip styles',
      weight: 886
    }
  },
  {
    source: 'js/tooltip.js',
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
     description: 'Handle tooltip generation and placement',
     weight: 995
    }
  }
];
