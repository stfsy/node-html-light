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

- [API](#api)
    - [Document](#document)
    - [Node](#node)
    - [Attributes](#attributes)
    - [Text](#text)
- [Examples](#examples)
    - [Create a document using a file](#create-a-document-using-a-file)
    - [Create a Node using a File](#create-a-node-using-a-file)
    - [Create a Node using a String](#create-a-node-using-a-string)
    - [Create a Node with raw data](#create-a-node-with-raw-data)
    - [Find a child Node of an existing Element](#find-a-child-node-of-an-existing-element)
- [License](#license)

### Installation

```js
npm i node-html-light --save
```

## API

### Document
#### Class methods
- static **fromPath**(path) -> [Document](#document)
- static **fromString**(string) -> [Document](#document)

#### Instance properties
- name
- parent
- attributes

#### Instance methods
- **html**() -> [Node](#node)
- **head**() -> [Node](#node)
- **body**() -> [Node](#node)
- **toHtml**() -> String

### Node
#### Class methods
- static **fromPath**(path) -> [Node](#node) | Array<[Node](#node)>
- static **fromString**(string) -> [Node](#node) | Array<[Node](#node)>
- static **of**(object | name, attrs) -> [Node](#node) | Array<[Node](#node)>

#### Instance properties
- name
- parent
- attributes

#### Instance methods
- **appendChild**(newChild) -> this
- **appendChildBefore**(newChild, oldChild) -> this
- **appendChildAfter**(newChild, oldChild) -> this
- **find**(element, attrs, limit) -> Array<[Node](#node)>
- **replaceChild**(newChild, oldChild) -> this
- **toHtml**() -> String

### Attributes
#### Class methods
- static **of**(object) -> Array<Attribute>

### Text
#### Class methods
- static **of**(string) -> [Text](#text)

## Examples
### Create a document using a file

```js
const Document = require('node-html-light').Document
const resolve = require('path').resolve

Document.fromPath(resolve('./index.html')).then((document) => {
    // head is an instance of Node
    const head = document.head()
    // body is an instance of Node
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

### Create a Node using a File
```js
const Node = require('node-html-light').Node
const resolve = require('path').resolve

Node.fromPath(resolve('partial.html')).then((node) => {})
```
### Create a Node using a String
```js
const Node = require('node-html-light').Node

const node = Node.fromString('<div></div>')
```
### Create a Node with raw data
```js
const Node = require('node-html-light').Node
const Attributes = require('node-html-light').Attributes

const node = Node.of('meta', Attributes.of({
        'name': 'viewport',
        'theme-color': '#795548'
    })
)
```
### Find a child Node of an existing Element
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

## License

This project is distributed under the MIT license.