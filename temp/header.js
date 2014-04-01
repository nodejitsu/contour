//
// Expose nodejitsu header styles.
//
exports.nodejitsu = [
  {
    source: 'stylus/navigation.styl',
    meta: {
      description: 'Styling for the navigation bar',
      weight: 894
    }
  },
  {
    source: 'stylus/modal.styl',
    meta: {
      description: 'Styling for modal windows like login',
      weight: 893
    }
  },
  {
    source: 'js/login.js',
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
      description: 'Cortex app for login',
      weight: 999
    }
  }
];

//
// Expose opsmezzo header styles
// TODO: needs to be implemented
//
exports.opsmezzo = [];
