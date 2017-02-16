const {app, BrowserWindow} = require('electron');
const path = require('path');
const protocols = require('../../../index.js');

protocols.register('app', uri => {
  if ( uri.hostname === 'foo' ) {
    return path.join( app.getAppPath(), uri.hostname, uri.pathname );
  }
  return null;
});

global.results = [];

let win = null;

app.on('ready', function () {
  win = new BrowserWindow({
    center: true,
    width: 400,
    height: 300
  });
  win.loadURL('file://' + __dirname + '/index.html');

  global.results.push(`${protocols.path('app://foo/foobar.js')}`);
  global.results.push(`${protocols.path('app://bar/foobar.js')}`);
});
