//
// Expose nodejitsu default styles.
//
exports.nodejitsu = [
  {
    source: 'css/utf-8.css',
    meta: {
      description: 'This is needed or our CSS will not render correctly because we using unicode content',
      weight: 999
    }
  },
  {
    source: 'css/normalize.css',
    meta: {
      description: 'The normalize CSS reset by Nicolas Gallagher',
      version: '5399ff9c0e6d60b4a96c1e388755137de52690b4',
      latest: 'https://github.com/necolas/normalize.css/blob/master/normalize.css',
      weight: 998
    }
  },
  {
    source: 'css/animate.css',
    meta: {
      description: 'CSS3 animations made easy using classNames',
      version: '305ed52cdacb6e278185e403b87103f328cca7a8',
      latest: 'https://github.com/daneden/animate.css/blob/master/animate.css',
      weight: 997
    }
  },
  {
    source: 'webfonts/ss-social.styl',
    meta: {
      description: 'Symbolset.com social font icons',
      weight: 996
    }
  },
  {
    source: 'webfonts/ss-standard.styl',
    meta: {
      description: 'Symbolset.com standard font icons',
      weight: 995
    }
  },
  {
    source: 'stylus/grid.styl',
    meta: {
      description: 'The 1140 grid system from cssgrid.net, converted to stylus',
      weight: 994
    }
  },
  {
    source: 'stylus/global.styl',
    meta: {
      description: 'Styles that need to be attached globally',
      weight: 993
    }
  },
  {
    source: 'stylus/typography.styl',
    meta: {
      description: 'General typography styling',
      weight: 992
    }
  },
  {
    source: 'stylus/form.styl',
    meta: {
      description: 'Form styling',
      weight: 991
    }
  },
  {
    source: 'stylus/tables.styl',
    meta: {
      description: 'Table styling',
      weight: 990
    }
  }
];

//
// Expose npm default styles.
//
exports.npm = [
  {
    source: 'css/utf-8.css',
    meta: {
      description: 'This is needed or our CSS will not render correctly because we using unicode content',
      weight: 999
    }
  },
  {
    source: 'css/normalize.css',
    meta: {
      description: 'The normalize CSS reset by Nicolas Gallagher',
      version: '5399ff9c0e6d60b4a96c1e388755137de52690b4',
      latest: 'https://github.com/necolas/normalize.css/blob/master/normalize.css',
      weight: 998
    }
  },
  {
    source: 'css/animate.css',
    meta: {
      description: 'CSS3 animations made easy using classNames',
      version: '305ed52cdacb6e278185e403b87103f328cca7a8',
      latest: 'https://github.com/daneden/animate.css/blob/master/animate.css',
      weight: 997
    }
  },
  {
    source: 'webfonts/ss-social.styl',
    meta: {
      description: 'Symbolset.com social font icons',
      weight: 996
    }
  },
  {
    source: 'webfonts/ss-standard.styl',
    meta: {
      description: 'Symbolset.com standard font icons',
      weight: 995
    }
  },
  {
    source: 'stylus/grid.styl',
    meta: {
      description: 'The 1140 grid system from cssgrid.net, converted to stylus',
      weight: 994
    }
  },
  {
    source: 'npm/stylus/global.styl',
    meta: {
      description: 'Styles that need to be attached globally',
      weight: 993
    }
  },
  {
    source: 'npm/stylus/typography.styl',
    meta: {
      description: 'General typography styling',
      weight: 992
    }
  },
  {
    source: 'npm/stylus/form.styl',
    meta: {
      description: 'Form styling',
      weight: 991
    }
  },
  {
    source: 'npm/stylus/tables.styl',
    meta: {
      description: 'Table styling',
      weight: 990
    }
  }
];


//
// Expose opsmezzo default styles
// TODO: needs to be implemented
//
exports.opsmezzo = [];
