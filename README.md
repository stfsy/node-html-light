# Node HTML Light

[![Build Status](https://travis-ci.org/stfsy/node-html-light.svg)](https://travis-ci.org/stfsy/node-html-light)
[![Dependency Status](https://img.shields.io/david/stfsy/node-html-light.svg)](https://github.com/stfsy/node-html-light/blob/master/package.json)
[![DevDependency Status](https://img.shields.io/david/dev/stfsy/node-html-light.svg)](https://github.com/stfsy/node-html-light/blob/master/package.json)
[![Npm downloads](https://img.shields.io/npm/dm/node-html-light.svg)](https://www.npmjs.com/package/node-html-light)
[![Npm Version](https://img.shields.io/npm/v/node-html-light.svg)](https://www.npmjs.com/package/node-html-light)
[![Git tag](https://img.shields.io/github/tag/stfsy/node-html-light.svg)](https://github.com/stfsy/node-html-light/releases)
[![Github issues](https://img.shields.io/github/issues/stfsy/node-html-light.svg)](https://github.com/stfsy/node-html-light/issues)
[![License](https://img.shields.io/npm/l/node-html-light.svg)](https://github.com/stfsy/node-html-light/blob/master/LICENSE)

Wrapper around htmlparser2 providing a more object oriented interface

## Example

```js
const Document = require('node-html-light').Document
const path = require('path').resolve

Document.fromPath(resolve('index.html')).then((document) => {
    const head = document.head()
    const body = document.body()

    // find child elements
    // append child elements
    // remove child elements
    // replace child elements

    return document.toHtml()
}).then((html) => {
    // ..
})

```

## Installation

```js
npm install node-html-light --save
```