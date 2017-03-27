'use strict'

const Node = require('./node')

/**
 * @class
 * @memberof node-html-light
 */
class Nodes {

    /**
     * Wrap a set of Nodes to get access to utility functions
     * @param {Array<Node>} elems an array of nodes
     * @returns {Node} a new Node
     */
    static of(elems) {
        return new Nodes(elems)
    }

    /**
     * @constructor
     * @private
     * @description <b>Do not use this method directly. Use one of the static helper methods instead.</b>
     * @param {Array<Node>} elems an array of nodes
     * @returns {Nodes} a new object wrapping the given array of nodes
     */
    constructor(elems) {
        this._elements = elems
    }

    /**
      * Returns an array of nodes matching tag name and attributes
      * @param {Object} element an object whose properties reflect the properties of the element we are looking for
      * @param {Array<Attribute>} [attrs=empty] attrs an array of attributes
      * @param {Number} [limit=Infinity] limit the max number of results
      * @returns {Array<Node>}
      */
    find(element, attrs, limit) {
        let result = []

        if (limit === undefined || limit === null) {
            limit = Infinity
        }

        for (let i = 0, n = this._elements.length; i < n; i++) {
            const el = this._elements[i]
            const foundElements = el.find(element, attrs, limit)
            result = result.concat(foundElements)
            const size = foundElements.length

            if (size >= limit) {
                break
            } else {
                limit = limit - size
            }
        }

        return result
    }

    /**
      * Executes the callback function for every wrapped element and (optionally) for every wrapped elements children
      * @param {Function} callback the callback to be invoked for every element
      * @param {Boolean} [recursive=false] recursive flag to indicate if callback should be invoked for child elements, too
      */
    forEach(callback, recursive) {
        this._elements.forEach((element) => {

            // iterating recursively we have to wrap the parser nodes with our node implementation
            if (!(element instanceof Node)) {
                element = Node.create(element)
            }

            const type = element.get().type
            const whitespace = this._isWhitespace(element)
            if ( type === Node.TYPE_TAG || type === Node.TYPE_COMMENT || !whitespace) {
                callback(element)
            }

            if (recursive) {
                const children = element.get().children
                if (children && children.length) {
                    new Nodes(children).forEach(callback, recursive)
                }
            }
        })
    }

    /** @private */
    _isWhitespace(element) {
        const type = element.get().type

        if (type === 'text') {
            const text = element.get().data
            if (/^[\s\\n\\r]*$/.test(text)) {
                return true
            }
        }

        return false
    }
}

module.exports = Nodes