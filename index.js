'use strict';

const platform = require('electron-platform');
const pkgJson = require('./package.json');

let protocols;
let name = `__electron_protocols__`;
let msg = `Failed to require ${pkgJson.name}@${pkgJson.version}:
  A different version of ${pkgJson.name} already running in the process, we will redirect to it.
  Please make sure your dependencies use the same version of ${pkgJson.name}.`;

if ( platform.isMainProcess ) {
  if (global[name]) {
    console.warn(msg);
    protocols = global[name];
  } else {
    protocols = require('./lib/protocols-main');
  }
} else {
  if (window[name]) {
    console.warn(msg);
    protocols = window[name];
  } else {
    protocols = require('./lib/protocols-renderer');
  }
}

// ==========================
// exports
// ==========================

module.exports = protocols;
