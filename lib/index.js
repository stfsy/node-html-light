'use strict'

const Document = require('./document')
const Node = require('./node')
const Nodes = require('./nodes')
const Attribute = require('./attribute')
const Text = require('./text')

/**
 * @namespace node-html-light
 */
module.exports = {
    Document: Document,
    Attr: Attribute,
    Node: Node,
    Nodes: Nodes,
    Text: Text
}
