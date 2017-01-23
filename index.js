'use strict';

'use strict';

const platform = require('electron-platform');

let protocols;

if ( platform.isMainProcess ) {
  protocols = require('./lib/protocols-main');
} else {
  protocols = require('./lib/protocols-renderer');
}

// ==========================
// exports
// ==========================

module.exports = protocols;
