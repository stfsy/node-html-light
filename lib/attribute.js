'use strict'

/**
 * @class
 * @memberof node-html-light
 */
class Attribute {

    /**
     * Wrap an Attribute to get access to utility functions
     * @param {String} [key=undefined] key key of the attribute
     * @param {String} [value=undefined] value value of the attribute
     * @returns {Attribute} a new Attribute
     */
    static of(key, value) {

        return new Attribute(key, value)
    }

    /**
     * @constructor
     * @private
     * @description <b>Do not use this method directly. Use one of the static helper methods instead.</b
     * @param {string} [key=undefined] key attributes key
     * @param {string} [value=undefined] value attributes value
     * @returns {Attribute} a new Attribute
     */
    constructor(key, value) {
        this.key = key
        this.value = value
    }
}

module.exports = Attribute