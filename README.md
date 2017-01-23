# electron-protocols

[![Linux Build Status](https://travis-ci.org/electron-utils/electron-protocols.svg?branch=master)](https://travis-ci.org/electron-utils/electron-protocols)
[![Windows Build status](https://ci.appveyor.com/api/projects/status/rb2koei7jtsgnfyh?svg=true)](https://ci.appveyor.com/project/jwu/electron-protocols)
[![Dependency Status](https://david-dm.org/electron-utils/electron-protocols.svg)](https://david-dm.org/electron-utils/electron-protocols)
[![devDependency Status](https://david-dm.org/electron-utils/electron-protocols/dev-status.svg)](https://david-dm.org/electron-utils/electron-protocols#info=devDependencies)

Manage file protocols in Electron

## Install

```bash
npm install --save electron-protocols
```

Run the example:

```
npm start example
```

## Usage

**main process**

```javascript
// register a protocol in main process before app.on('ready')
const protocols = require('electron-protocols');
protocols.register('app', protocols.basepath(app.getAppPath()));
```

**renderer/main process**

```javascript
const protocols = require('electron-protocols');

// return the module in ${app.getAppPath()}/my/module.js
const myModule = require(protocols.path('app://my/module.js'));
```

Also, you are free to use protocol in html such as:

```html
  <img src="app://my/image.png" />
  <script src="app://my/script.js" />
```

## FAQ

### What is the benefit to register in renderer process?

It will speed up the search of `protocols.path` by skip calling the remote (ipc-sync) functions.

## API

### Methods

### protocols.register(protocol, fn)

  - `protocol` string
  - `fn` function

Register a protocol so that {@link Editor.url} can use it to convert an url to the filesystem path.
The `fn` accept an url Object via [url.parse](https://nodejs.org/api/url.html#url_url_parse_urlstring_parsequerystring_slashesdenotehost)

Example:

```javascript
const protocols = require('electron-protocols');
const path = require('path');

let _url2path = base => {
  return uri => {
    if ( uri.pathname ) {
      return path.join( base, uri.host, uri.pathname );
    }
    return path.join( base, uri.host );
  };
};

protocols.register('app', _url2path(app.getAppPath()));
```

### protocols.path(url)

  - `url` string

Convert a url by its protocol to a filesystem path. This function is useful when you try to get
some internal file. You can use `protocols.register` to register and map your filesystem path to url.

Example

```javascript
// it will return "{your-app-path}/foobar/foobar.js"
protocols.path('app://foobar/foobar.js');
```

### protocols.basepath(base)

  - `base` string

A function help you register protocol by `base` path you provide.

Example

```javascript
protocols.register('app', protocols.basepath(app.getAppPath()));
```

## License

MIT © 2017 Johnny Wu
