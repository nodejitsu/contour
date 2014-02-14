//
// Expose nodejitsu analytics integration.
//
exports.nodejitsu = [
  {
    source: 'js/analytics.js',
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
     description: 'Initialize analytics trackers like GA and segment.io',
     weight: 996
    }
  }
];

//
// Expose opsmezzo analytics integration.
// TODO: needs to be implemented
//
exports.opsmezzo = [];
