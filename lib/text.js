'use strict'

/**
 * @class
 * @memberof node-html-light
 */
class Text {

    /**
     * Creates a new text node
     * @param {string} string 
     * @returns {Text} a new Text node
     */
    static of(string) {
        return new Text(string)
    }

    /**
     * @constructor
     * @param {string} text 
     * @returns {Text} a new Text node
     */
    constructor(text) {

        this._element = {

            type: 'text',
            data: text,
            next: null,
            prev: null,
            parent: null
        }
    }

    get() {
        return this._element
    }
}

module.exports = Text