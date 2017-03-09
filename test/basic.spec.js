'use strict';

const path = require('path');
const electron = require('electron');
const {Application} = require('spectron');
const assert = require('assert');

describe('basic', function () {
  this.timeout(0);
  let app = null;
  let appPath = path.join(__dirname, 'fixtures', 'app');

  before(function () {
    app = new Application({
      path: electron,
      args: [appPath]
    });
    return app.start();
  });

  after(function () {
    if (app && app.isRunning()) {
      return app.stop();
    }
  });

  it('should be ok', function () {
    return app.client
      .waitUntilWindowLoaded()
      .getRenderProcessLogs()
      .then(function (logs) {
        assert.equal(logs.length, 6);
        assert.ok(logs[0].message.indexOf(appPath) !== -1);
        assert.ok(logs[1].message.indexOf(path.join(appPath,'foo/bar/foobar.js')) !== -1);
        assert.ok(logs[2].message.indexOf('http://github.com') !== -1);
        assert.ok(logs[3].message.indexOf('https://github.com') !== -1);
        assert.ok(logs[4].message.indexOf('file://foo/bar/foobar.js') !== -1);
        assert.ok(logs[5].message.indexOf('null') !== -1);

        return app.electron.remote.getGlobal('results')
          .then(function (results) {
            assert.equal(results.length, 6);
            assert.equal(results[0], appPath);
            assert.equal(results[1], path.join(appPath,'foo/bar/foobar.js'));
            assert.equal(results[2], 'http://github.com');
            assert.equal(results[3], 'https://github.com');
            assert.equal(results[4], 'file://foo/bar/foobar.js');
            assert.equal(results[5], 'null');
          });
      });
  });
});

describe('app-ready', function () {
  this.timeout(0);
  let app = null;
  let appPath = path.join(__dirname, 'fixtures', 'app-ready');

  before(function () {
    app = new Application({
      path: electron,
      args: [appPath]
    });
    return app.start();
  });

  after(function () {
    if (app && app.isRunning()) {
      return app.stop();
    }
  });

  it('should be ok', function () {
    return app.client
      .waitUntilWindowLoaded()
      .getRenderProcessLogs()
      .then(function (logs) {
        assert.equal(logs.length, 5);
        assert.ok(logs[0].message.indexOf('null') !== -1);
        assert.ok(logs[1].message.indexOf('null') !== -1);
        assert.ok(logs[2].message.indexOf('http://github.com') !== -1);
        assert.ok(logs[3].message.indexOf('https://github.com') !== -1);
        assert.ok(logs[4].message.indexOf('file://foo/bar/foobar.js') !== -1);

        return app.electron.remote.getGlobal('results')
          .then(function (results) {
            assert.equal(results.length, 5);
            assert.equal(results[0], 'null');
            assert.equal(results[1], 'null');
            assert.equal(results[2], 'http://github.com');
            assert.equal(results[3], 'https://github.com');
            assert.equal(results[4], 'file://foo/bar/foobar.js');
          });
      });
  });
});

describe('protocol-failed', function () {
  this.timeout(0);
  let app = null;
  let appPath = path.join(__dirname, 'fixtures', 'protocol-failed');

  before(function () {
    app = new Application({
      path: electron,
      args: [appPath]
    });
    return app.start();
  });

  after(function () {
    if (app && app.isRunning()) {
      return app.stop();
    }
  });

  it('should be ok', function () {
    return app.client
      .waitUntilTextExists('.label', 'Ready')
      .getRenderProcessLogs()
      .then(function (logs) {
        assert.equal(logs.length, 5);
        assert.ok(logs[0].message.indexOf(path.join(appPath,'foo/foobar.js')) !== -1);
        assert.ok(logs[1].message.indexOf('null') !== -1);
        assert.ok(logs[2].message.indexOf('status = 200, responseText = Hello World!\\n') !== -1);
        assert.ok(logs[3].message.indexOf('net::ERR_FILE_NOT_FOUND') !== -1);
        assert.ok(logs[4].message.indexOf('status = 0, responseText = ') !== -1);

        return app.electron.remote.getGlobal('results')
          .then(function (results) {
            assert.equal(results.length, 2);
            assert.equal(results[0], path.join(appPath,'foo/foobar.js'));
            assert.equal(results[1], 'null');
          });
      });
  });
});

