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
    * @returns {Promise} a new promise that is resolved with the new document
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
    html() {
        return super.find('html', null, 1)[0]
    }

    /**
     * Returns the head node of this document
     * @returns {Node} 
     */
    head() {
        return super.find('head', null, 1)[0]
    }

    /**
     * Returns the body node of this document
     * @returns {Node} 
     */
    body() {
        return super.find('body', null, 1)[0]
    }
}

module.exports = Document