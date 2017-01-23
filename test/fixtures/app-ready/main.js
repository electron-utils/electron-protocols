const {app, BrowserWindow} = require('electron');
const protocols = require('../../../index.js');

global.results = [];

let win = null;

app.on('ready', function () {
  win = new BrowserWindow({
    center: true,
    width: 400,
    height: 300
  });
  win.loadURL('file://' + __dirname + '/index.html');

  // failed to register
  protocols.register('app', protocols.basepath(app.getAppPath()));

  global.results.push(`${protocols.path('app://')}`);
  global.results.push(`${protocols.path('app://foo/bar/foobar.js')}`);
  global.results.push(`${protocols.path('http://github.com')}`);
  global.results.push(`${protocols.path('https://github.com')}`);
  global.results.push(`${protocols.path('file://foo/bar/foobar.js')}`);
});
