'use strict'

/**
 * @class
 * @memberof node-html-light
 */
class Attribute {

    /**
     * @constructor
     * @param {string} key attributes key
     * @param {string} [value=undefined] value attributes value
     * @returns {Attribute} a new Attribute
     */
    constructor(key, value) {
        this.key = key
        this.value = value
    }
}

module.exports = Attribute