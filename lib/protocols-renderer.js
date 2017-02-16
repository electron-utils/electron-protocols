'use strict';

const {remote} = require('electron');
const Url = require('url');
const common = require('./common');

const _defaultProtocols = [
  'http:',
  'https:',
  'ftp:',
  'ssh:',
  'file:',
];
let _protocol2fn = {};
let _remoteProtocols = remote.getGlobal('__electron_protocols__');

/**
 * @module protocols
 */
module.exports = {
  /**
   * @method path
   * @param {string} url
   *
   * Convert a url by its protocol to a filesystem path. This function is useful when you try to
   * get some internal file. You can use {@link protocols.register} to register and map your filesystem
   * path to url.
   *
   * @example
   * ```js
   * // it will return "{your-app-path}/foobar/foobar.js"
   * protocols.path('app://foobar/foobar.js');
   * ```
   */
  path (url) {
    if ( !url ) {
      return null;
    }

    let uri = Url.parse(url);

    if ( !uri.protocol ) {
      return url;
    }

    if ( _defaultProtocols.indexOf(uri.protocol) !== -1 ) {
      return url;
    }

    let fn = _protocol2fn[uri.protocol];
    if ( fn ) {
      return fn(uri);
    }

    // use remote protocols.path
    return _remoteProtocols.path(url);
  },

  /**
   * @method register
   * @param {string} protocol
   * @param {function} fn
   *
   * Register a protocol so that {@link Editor.url} can use it to convert an url to the filesystem path.
   * The `fn` accept an url Object via [url.parse](https://nodejs.org/api/url.html#url_url_parse_urlstring_parsequerystring_slashesdenotehost)
   *
   * @example
   * ```js
   * const protocols = require('electron-protocols');
   * const path = require('path');
   *
   * let _url2path = base => {
   *   return uri => {
   *     if ( uri.pathname ) {
   *       return path.join( base, uri.host, uri.pathname );
   *     }
   *     return path.join( base, uri.host );
   *   };
   * };
   *
   * protocols.register('app', _url2path(remote.app.getAppPath()));
   * ```
   */
  register ( protocol, fn ) {
    _protocol2fn[protocol+':'] = fn;
  },

  /**
   * @method basepath
   */
  basepath: common.basepath,
};
