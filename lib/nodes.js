'use strict'

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
    static fromArray(elems) {
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
      * @param {Object} element an object whos properties reflect the properties of the element we are looking for
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
}

module.exports = Nodes