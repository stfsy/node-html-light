'use strict'

const Attribute = require('./attribute')

/**
 * @class
 * @memberof node-html-light
 */
class Attributes {

    /**
     * Wrap a set of Nodes to get access to utility functions
     * @param {Object} [elems=null] elems an object
     * @returns {Array<Attribute>} a new array of attributes
     */
    static of(elems) {

        let array = []

        if (!elems) {
            return array
        }

        for (let key in elems) {
            array.push(Attribute.of(key, elems[key]))
        }

        return array
    }
}

module.exports = Attributes