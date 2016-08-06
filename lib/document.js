'use strict'

const Node = require('./node')

const fs = require('fs-promise')
const htmlParser = require('htmlparser2')
const domUtils = htmlParser.DomUtils

/**
 * @class
 * @extends Node
 * @memberof node-html-light
 */
class Document extends Node {

     /**
     * Creates a new document of a files contents
     * @param {string} path path to a file
     * @returns {Document} a new document
     */
    static fromPath(path) {
        return fs.readFile(path, { encoding: 'utf-8' }).then((contents) => {
            return Document.fromString(contents)
        })
    }

     /**
     * Parses a html string into a document object
     * @param {string} string a html string
     * @returns {Document} a new document
     */
    static fromString(string) {
        return new Document(htmlParser.parseDOM(string))
    }

    /**
     * @constructor
     * @private
     * @description <b>Do not use this method directly. Use one of the static helper methods instead.</b>
     * @param {Object} elem object containing the nodes properties
     * @returns {Document} a new Document
     */
    constructor(dom) {
        super(dom)
    }

    /**
     * Returns the head node of this document
     * @returns {Node} 
     */
    head() {
        const head = domUtils.filter((element) => {
            return element.name === 'head'
        }, this._element, true, 1)

        return new Node(head[0])
    }

    /**
     * Returns the body node of this document
     * @returns {Node} 
     */
    body() {
        const body = domUtils.filter((element) => {
            return element.name === 'body'
        }, this._element, true, 1)

        return new Node(body[0])
    }
}

module.exports = Document