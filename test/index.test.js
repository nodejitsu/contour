describe('scaffold', function () {
  'use strict';

  var Scaffold = require('../index')
    , Square = require('square')
    , common = require('./common')
    , expect = common.expect
    , sinon = common.sinon
    , fs = require('fs')
    , ejs = require('ejs')
    , path = require('path')
    , async = require('async');

  it('is exposed as constructor', function () {
    expect(Scaffold).to.be.a('function');
  });

  it('imports custom Square configuration', function (done) {
    // First store our import relative to /tmp/square.json else eson can't handle it
    fs.createReadStream(__dirname + '/fixtures/import.json')
      .pipe(fs.createWriteStream('/tmp/import.json'))
      .on('close', function () {

      var scaffold = new Scaffold('./test/fixtures/scaffold', {
        store: '/tmp/custom.json',
        import: 'import.json',
        monitor: true
      });

      setTimeout(function () {
        var result = scaffold._square.package.configuration.dist;
        expect(result).to.have.property('dev', 'test');
        expect(result).to.have.property('min', 'test');

        scaffold.live.adaptable.once('close', function () {
          scaffold.live.destroy();
          fs.unlink('/tmp/custom.json', done);
        });

        scaffold.live.adaptable.close();
      }, 300);
    });
  });

  it('provides a debouncer for deferred calls to refresh', function (done) {
    var scaffold = new Scaffold('./', { store: common.file }),
        i, timer, fn = scaffold.debounce(scaffold.emit.bind(scaffold, 'debounce'), 100);

    function loop() {
      i = i || 1;
      if (i++ > 4) clearInterval(timer);
      fn();
    }

    expect(scaffold).to.have.property('debounce');
    expect(scaffold.debounce).to.be.a('function');
    expect(scaffold.debounce(loop, 20)).to.be.a('function');
    scaffold.once('debounce', done);

    timer = setInterval(loop, 20);
  });

  it('imports allows multiple custom Square configuration as array', function (done) {
    // First store our import relative to /tmp/square.json else eson can't handle it
    fs.createReadStream(__dirname + '/fixtures/import.json')
      .pipe(fs.createWriteStream('/tmp/import.json'))
      .on('close', function () {

      var scaffold = new Scaffold('./test/fixtures/scaffold', {
        store: '/tmp/custom.json',
        import: [ 'import.json', 'import.json' ],
        monitor: true
      });

      setTimeout(function () {
        var result = scaffold._square.package.configuration.dist;
        expect(result).to.have.property('dev', 'test');
        expect(result).to.have.property('min', 'test');

        scaffold.live.adaptable.once('close', function () {
          scaffold.live.destroy();
          fs.unlink('/tmp/custom.json', done);
        });

        scaffold.live.adaptable.close();
      }, 300);
    });
  });

  describe('Constructor', function () {
    var key = path.resolve('scaffold/index.js')
      , scaffold
      , monitor;

    // Required to allow one test to change NODE_ENV to production
    beforeEach(function () {
      delete require.cache[key];
      process.env.NODE_ENV = 'testing';

      Scaffold = require('../');
      monitor = sinon.stub(Scaffold.prototype, 'monitor');
      scaffold = new Scaffold('./', { store: common.file, monitor: true });
    });

    afterEach(function () {
      monitor.restore();
      scaffold = null;
    });

    it('requires base path to templates of project', function () {
      var missing = function () { var scaffold = new Scaffold; };
      var incorrect = function () { var scaffold = new Scaffold('random/path'); };

      expect(missing).to.throw('Provide base path for your template inclusion');
      expect(incorrect).to.throw('Provide base path for your template inclusion');
    });

    it('will call #monitor if store option is provided', function () {
      expect(monitor).to.be.called.once;
    });

    it('will not call #monitor if environment is set to production', function () {
      delete require.cache[key];
      var env = process.env.NODE_ENV;
      process.env.NODE_ENV = 'production';

      monitor.restore();
      monitor = sinon.stub(Scaffold.prototype, 'monitor');

      var scaffold = new Scaffold('./', { store: common.file });

      expect(monitor.called).to.be.false;
      process.env.NODE_ENV = env;
    });

    it('will construct and expose square if monitoring', function () {
      expect(scaffold).to.have.property('_square');
    });

    it('creates app methods by templates names and chosen brand', function () {
      var files = fs.readdirSync('templates/nodejitsu');

      files.forEach(function checkFunction(file) {
        expect(scaffold.app).to.have.property(path.basename(file, '.ejs'));
      });
    });

    it('switching brand will load alternate templates', function () {
      var brand = 'opsmezzo',
          files = fs.readdirSync('templates/' + brand);

      scaffold = new Scaffold('./', { store: common.file, brand: brand });

      files.forEach(function checkFunction(file) {
        expect(scaffold.app).to.have.property(path.basename(file, '.ejs'));
      });
    });

    it('adds #include and #markdown to app methods', function () {
      expect(scaffold.app).to.have.property('include');
      expect(scaffold.app).to.have.property('markdown');
      expect(scaffold.app.include).to.be.a('function');
      expect(scaffold.app.markdown).to.be.a('function');
    });

    it('exposes options by property', function () {
      var brand = 'opsmezzo',
          output = '/tmp',
          file = common.file,
          scaffold = new Scaffold('./', {
            store: file,
            brand: brand,
            output: output,
            monitor: true
          });

      expect(scaffold._options).to.have.property('brand', brand);
      expect(scaffold._options).to.have.property('template', path.resolve('templates', brand));
      expect(scaffold._options).to.have.property('store', file);
      expect(scaffold._options).to.have.property('output', output);
    });

    it('Square output directory defaults to dirname of store', function () {
      expect(scaffold._options).to.have.property('output', path.dirname(common.file));
    });
  });

  describe('#addFile', function () {
    var scaffold = new Scaffold('./', { store: common.file });
    scaffold.addFile('../../test/fixtures/scaffold/addFile.ejs');

    it('uses filename as function name', function () {
      expect(scaffold.app).to.have.property('addFile');
    });

    it('returns compiled ejs function and adds function to app stack', function () {
      expect(scaffold.app.addFile).to.be.a('function');
      expect(scaffold.app.addFile({})).to.equal('<strong>Some small test template</strong>\n');
    });

    it('does not store compiled template of custom inclusion', function () {
      scaffold.addFile('../../test/fixtures/scaffold/main.ejs', true);

      expect(scaffold.app).to.not.have.property('main');
      expect(scaffold.app).to.have.property('addFile');
    });

    it('returns early if the compiled template was already generated', function () {
      var compile = sinon.spy(ejs, 'compile');

      scaffold.addFile('../../test/fixtures/scaffold/addFile.ejs');
      expect(compile).to.not.be.called;

      compile.restore();
    });

    it('does not return early if the template is custom', function () {
      var compile = sinon.spy(ejs, 'compile');

      scaffold.addFile('../../test/fixtures/scaffold/main.ejs', true);
      expect(compile).to.be.calledOnce;

      compile.restore();
    });
  });

  describe('#supplier', function () {
    var scaffold = new Scaffold('./test/fixtures/scaffold', { store: common.file }),
        fn = ejs.compile(fs.readFileSync(__dirname + '/../templates/nodejitsu/submit.ejs', 'utf-8'));

    it('calls compiled ejs function and merges in default data', function () {
      var called = false,
          data = scaffold.supplier('submit', function (data) { called = true; return data; }, {});

      expect(called).to.be.true;
      expect(data).to.have.property('collection');
      expect(data).to.have.property('type', 'plain');
    });

    it('always adds data.app so nested app#template calls are possible', function () {
      scaffold.addFile('../../test/fixtures/scaffold/chainclude.ejs');
      expect(scaffold.app.chainclude({})).to.equal('<strong>Some small test template</strong>\n\n');
    });

    it('calls hook if supplied to defaults, cannot be overwritten', function () {
      var test = false,
          social = ejs.compile(fs.readFileSync('templates/nodejitsu/social.ejs', 'utf-8')),
          hook = sinon.spy(scaffold._options.defaults.social, 'hook');

      scaffold.supplier('social', social, { hook: function () { test = true; }});

      expect(test).to.be.false;
      expect(hook).to.be.calledOnce;

      hook.restore();
    });

    it('emits homegrown if template has assets', function () {
      var emit = sinon.spy(scaffold, 'emit'),
          html = scaffold.supplier('submit', fn, {});

      expect(emit).to.be.calledOnce;
      expect(emit.calledWith('homegrown')).to.be.true;
      emit.restore();
    });

    it('returns rendered content', function () {
      var html = scaffold.supplier('submit', fn, {});

      expect(html).to.equal(
        '<button type="submit" name="submit-btn" class="call-to btn">\n  Submit\n</button>\n'
      );
    });

    it('can add data-attributes by using selectors', function () {
      var html = scaffold.supplier('submit', fn, {
        attributes: {
          'button': {
            type: 'test'
          }
        }
      });

      expect(html).to.equal(
        '<button type="submit" name="submit-btn" class="call-to btn" data-type="test">\n  Submit\n</button>\n'
      );
    });
  });

  describe('#include', function () {
    var scaffold = new Scaffold('./test/fixtures/scaffold'),
        add = sinon.stub(scaffold, 'addFile').returns(function () {}),
        dir = 'test/fixtures/scaffold',
        file = 'main.ejs';

    it('resolves to path to origin + filename', function () {
      var resolve = sinon.spy(path, 'resolve');

      scaffold.include(dir, file);
      expect(resolve).to.be.calledOnce;
      expect(resolve.calledWith(dir, file)).to.be.true;

      resolve.restore();
    });

    it('adds ejs as default extension to filename', function () {
      var resolve = sinon.spy(path, 'resolve');

      file = 'main';
      scaffold.include(dir, file);
      expect(resolve).to.be.calledOnce;
      expect(resolve.calledWith(dir, file + '.ejs')).to.be.true;

      resolve.restore();
    });

    it('returns file content', function () {
      add.restore();
      expect(scaffold.include(dir, file)).to.equal('<h2 id="some-header">Some header</h2>\n<p>and content to wrap in a paragraph</p>\n\n');
    });
  });

  describe('#markdown', function () {
    it('calls #include and markdown after', function () {
      var scaffold = new Scaffold('./test/fixtures/scaffold'),
          inc = sinon.spy(scaffold.app, 'include');

      scaffold.addFile('../../test/fixtures/scaffold/main.ejs');
      scaffold.app.main({});
      expect(inc).to.be.calledOnce;

      inc.restore();
    });

    it('returns file content', function () {
      var scaffold = new Scaffold('./test/fixtures/scaffold');
      scaffold.addFile('../../test/fixtures/scaffold/main.ejs');

      expect(scaffold.app.main({})).to.equal(
        '<h2 id="some-header">Some header</h2>\n<p>and content to wrap in a paragraph</p>\n\n'
      );
    });
  });

  describe('#getFileContent', function () {
    it('reads content of file as utf-8', function () {
      var scaffold = new Scaffold('./test/fixtures/scaffold'),
          main = path.resolve(__dirname, 'fixtures/scaffold/main.ejs');

      scaffold.getFileContent(main);
      expect(scaffold._storage).to.have.property(main);
    });

    it('caches the file content in _storage', function () {
      var scaffold = new Scaffold('./test/fixtures/scaffold'),
          main = path.resolve(__dirname, 'fixtures/scaffold/main.ejs'),
          inc = sinon.spy(fs, 'readFileSync');

      scaffold.getFileContent(main);
      scaffold.getFileContent(main, true);

      expect(inc).to.be.calledOnce;
      inc.restore();
    });
  });

  describe('#monitor', function () {
    var scaffold, file;

    beforeEach(function () {
      file = common.file;
      scaffold = new Scaffold('./test/fixtures/scaffold', { store: file });

      scaffold._square = new Square({ 'log level': 2, comments: false });
      scaffold._options = {
        dist: 'test.{type}.{ext}',
        store: file,
        output: '/tmp'
      };
    });

    afterEach(function () {
      file = null;
      scaffold = null;
    });

    it('initializes square scaffold and calls configuration', function (done) {
      var square = sinon.spy(scaffold._square.scaffold, 'init'),
          conf = sinon.spy(scaffold._square.scaffold, 'configuration');

      scaffold.once('monitoring', function () {
        expect(square).to.be.calledOnce;
        expect(square.calledWith(file)).to.be.true;
        expect(square.returned(scaffold._square.scaffold)).to.be.true;
        expect(conf).to.be.calledOnce;
        expect(conf.calledWith({
          storage: ['disk'],
          plugins: { minify: {} },
          dist: path.resolve(path.dirname(file), 'test.{type}.{ext}')
        }));

        square.restore();
        conf.restore();
        done();
      });

      scaffold.monitor();
    });

    it('calls Square parse and constructs Watcher', function (done) {
      var parse = sinon.stub(scaffold._square, 'parse'),
          watch = sinon.stub(scaffold._square, 'Watcher');

      scaffold.once('monitoring', function () {
        expect(watch.calledWithNew()).to.be.true;
        expect(parse).to.be.calledOnce;
        expect(parse.calledWith(file)).to.be.true;

        parse.restore();
        watch.restore();
        done();
      });

      scaffold.monitor();
    });

    it('starts listening to homegrown and SIGINT emits', function (done) {
      scaffold.once('monitoring', function () {
        expect(process._events).to.have.property('SIGINT');
        expect(process._events.SIGINT).to.be.a('function');
        expect(process._events.SIGINT).to.have.property('listener');
        done();
      });

      scaffold.monitor();
    });
  });

  describe('has templates which include', function () {
    var scaffold = new Scaffold('./test/fixtures/scaffold');

    describe('analytics: segment.io and/or google analytics', function () {
      it('that does no initialization only script inclusion', function () {
        var result = scaffold.app.analytics();
        expect(result).to.include('//www.google-analytics.com/analytics.js');
        expect(result).to.not.include('nodejitsu.com');
      });

      it('is initialized to localhost if development', function () {
        // UA-24971485-6 is the localhost dev account in GA.
        var result = scaffold.app.analytics({ ids: { ga: ['UA-123823-12'] }});
        expect(result).to.include("ga.getByName('jitsu-6').send");
        expect(result).to.include("'UA-24971485-6'");
      });

      it('that initializes segment.io to dev account if development', function () {
        // with segment.io GA is not added literally.
        var result = scaffold.app.analytics({
          ids: {
            ga: ['UA-123823-12', 'UA-123823-1'],
            segment: {key: 'ajk1230l', ga: 'UA-123823-12'}
          }
        });

        expect(result).to.not.include("cookieDomain: 'none'");
        expect(result).to.include('analytics.load("r63vj4bdi7");');
      });

      it('is initialized to nodejitsu.com by default if production', function () {
        var env = process.env.NODE_ENV;
        process.env.NODE_ENV = 'production';

        var result = scaffold.app.analytics({ ids: { ga: ['UA-123823-12'] }});

        expect(result).to.include("cookieDomain: 'nodejitsu.com'");
        expect(result).to.include("ga.getByName('jitsu-12').send");
        expect(result).to.include("'UA-123823-12'");

        process.env.NODE_ENV = env;
      });

      it('can be initialized with multiple trackers', function () {
        var env = process.env.NODE_ENV;
        process.env.NODE_ENV = 'production';

        var result = scaffold.app.analytics({ ids: { ga: ['UA-123823-12', 'UA-123823-1'] }});

        expect(result).to.include("ga.getByName('jitsu-1').send");
        expect(result).to.include("ga.getByName('jitsu-12').send");
        expect(result).to.include("'UA-123823-1'");
        expect(result).to.include("'UA-123823-12'");

        process.env.NODE_ENV = env;
      });

      it('will prioritize segment.io over google analytics', function () {
        var env = process.env.NODE_ENV;
        process.env.NODE_ENV = 'production';

        var result = scaffold.app.analytics({
          ids: {
            ga: ['UA-123823-12', 'UA-123823-1'],
            segment: {key: 'ajk1230l', ga: 'UA-123823-12'}
          }
        });

        expect(result).to.include("ga.getByName('jitsu-1').send");
        expect(result).to.include("'UA-123823-1'");
        expect(result).to.include('analytics.load("ajk1230l");');
        expect(result).to.include('"https://":"http://")+"d2dq2ahtl5zl1z.cloudfront.net/analytics.js/v1/"+e+"/analytics.min.js"');

        process.env.NODE_ENV = env;
      });

      it('will wrap GA in ready call of segment.io if the GA ID is unique', function () {
        var env = process.env.NODE_ENV;
        process.env.NODE_ENV = 'production';

        var result = scaffold.app.analytics({
          ids: {
            ga: ['UA-123823-12'],
            segment: {key: 'ajk1230l', ga: 'UA-123823-3'}
          }
        });

        expect(result).to.include("'UA-123823-12'");
        expect(result).to.include('"ga": {\n      "enabled": true,');
        expect(result).to.include("analytics.ready(function ready() {");
        expect(result).to.not.include('//www.google-analytics.com/analytics.js');
        expect(result).to.include('"https://":"http://")+"d2dq2ahtl5zl1z.cloudfront.net/analytics.js/v1/"+e+"/analytics.min.js"');

        process.env.NODE_ENV = env;
      });

      it('will also load google analytics through segment.io if tracker has mutliple IDs', function () {
        var env = process.env.NODE_ENV;
        process.env.NODE_ENV = 'production';

        var result = scaffold.app.analytics({
          production: true,
          ids: {
            ga: ['UA-123823-12', 'UA-123823-1'],
            segment: {key: 'ajk1230l', ga: 'UA-123823-1'}
          }
        });

        expect(result).to.include("'UA-123823-12'");
        expect(result).to.include('"ga": {\n      "enabled": true,');
        expect(result).to.include("analytics.ready(function ready() {");
        expect(result).to.not.include('//www.google-analytics.com/analytics.js');
        expect(result).to.include('"https://":"http://")+"d2dq2ahtl5zl1z.cloudfront.net/analytics.js/v1/"+e+"/analytics.min.js"');

        process.env.NODE_ENV = env;
      });

      it('will ignore the tracker account that is deferred to segment.io', function () {
        var env = process.env.NODE_ENV;
        process.env.NODE_ENV = 'production';

        var result = scaffold.app.analytics({
          ids: {
            ga: ['UA-123823-12', 'UA-123823-1'],
            segment: {key: 'ajk1230l', ga: 'UA-123823-12'}
          }
        });

        expect(result).to.include('"segment": {\n      "enabled": true,');
        expect(result).to.include('"ga": {\n      "enabled": true,');
        expect(result).to.not.include("ga.getByName('jitsu-12').send");
        expect(result).to.not.include("'UA-123823-12'");

        process.env.NODE_ENV = env;
      });
    });
  });
});