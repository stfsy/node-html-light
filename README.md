# Node HTML Light

[![Build Status](https://travis-ci.org/stfsy/node-html-light.svg)](https://travis-ci.org/stfsy/node-html-light)
[![Dependency Status](https://img.shields.io/david/stfsy/node-html-light.svg)](https://github.com/stfsy/node-html-light/blob/master/package.json)
[![DevDependency Status](https://img.shields.io/david/dev/stfsy/node-html-light.svg)](https://github.com/stfsy/node-html-light/blob/master/package.json)
[![Npm downloads](https://img.shields.io/npm/dm/node-html-light.svg)](https://www.npmjs.com/package/node-html-light)
[![Npm Version](https://img.shields.io/npm/v/node-html-light.svg)](https://www.npmjs.com/package/node-html-light)
[![Git tag](https://img.shields.io/github/tag/stfsy/node-html-light.svg)](https://github.com/stfsy/node-html-light/releases)
[![Github issues](https://img.shields.io/github/issues/stfsy/node-html-light.svg)](https://github.com/stfsy/node-html-light/issues)
[![License](https://img.shields.io/npm/l/node-html-light.svg)](https://github.com/stfsy/node-html-light/blob/master/LICENSE)

HTML Parser for NodeJS providing a lightweight object oriented interface

## Examples
### Creating a document using a file

```js
const Document = require('node-html-light').Document
const resolve = require('path').resolve

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

### Creating a Node using a File
```js
const Node = require('node-html-light').Node
const resolve = require('path').resolve

Node.fromPath(resolve('partial.html')).then((node) => {})
```
### Creating a Node using a String
```js
const Node = require('node-html-light').Node

const node = Node.fromString('<div></div>')
```
### Creating a raw Node
```js
const Node = require('node-html-light').Node
const Attributes = require('node-html-light').Attributes

const node = Node.of('meta', Attributes.of({
        'name': 'viewport',
        'theme-color': '#795548'
    })
)
```
### Finding a child Node
```js
const Node = require('node-html-light').Node
const Attribute = require('node-html-light').Attribute
const resolve = require('path').resolve

Node.fromPath(resolve('partial.html')).then((node) => {
    const content = node.find('div', Attributes.of({
        'name': 'viewport',
        'theme-color': '#795548'
    }))
})
```
## Installation

```js
npm install node-html-light --save
```

## License

This project is distributed under the MIT license.