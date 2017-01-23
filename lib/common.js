'use strict';

const path = require('path');

module.exports = {
  basepath ( base ) {
    return uri => {
      if ( uri.pathname ) {
        return path.join( base, uri.hostname, uri.pathname );
      }
      return path.join( base, uri.hostname );
    };
  }
};
