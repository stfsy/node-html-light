'use strict'

const Attribute = require('./attribute')

const htmlParser = require('htmlparser2')
const domUtils = htmlParser.DomUtils
const fs = require('fs-promise')

/**
 * @class
 * @memberof node-html-light
 */
class Node {

    /**
    * Creates a new document of a files contents
    * @param {string} path path to a file
    * @returns {Node} a new document
    */
    static fromPath(path) {
        return fs.readFile(path, { encoding: 'utf-8' }).then((contents) => {
            return Node.fromString(contents)
        })
    }

    /**
     * Parses a html string into a node object
     * @param {string} string a html string
     * @returns {Node} a new Node
     */
    static fromString(string) {

        const parsed = htmlParser.parseDOM(string)

        if (parsed.length > 1) {

            return parsed.map(string => new Node(string))
        } else if (parsed.length === 1) {

            return new Node(parsed[0])
        }

        return new Node(parsed)
    }

    /**
     * Creates a new Node with name and attributes
     * @param {string} tag the nodes name
     * @param {Array.<Attribute>} [attrs=empty] attrs an array of attributes
     * @returns {Node} a new Node
     */
    static create(tag, attrs) {
        const node = {
            name: tag,
            children: [],
            attribs: {}
        }

        switch (tag) {
            case 'script': {
                node.type = 'script'
                break
            }

            default: {
                node.type = 'tag'
                break
            }
        }

        return new Node(node, attrs)
    }

    /**
     * @constructor
     * @private
     * @description <b>Do not use this method directly. Use one of the static helper methods instead.</b>
     * @param {Object} elem object containing the nodes properties
     * @param {Array<Attribute>} [attrs=empty] attrs an array of attributes
     * @returns {Node} a new Node
     */
    constructor(elem, attrs) {
        this._element = elem

        if (attrs) {
            /* istanbul ignore else */
            if (!this._element.attribs) {
                this._element.attribs = {}
            }

            attrs.forEach((attr) => {
                this._element.attribs[attr.key] = attr.value
            })
        }
    }

    /**
     * Returns the raw representation of this node
     * @private
     * @deprecated
     * @returns {Object} htmlparser2's representation of a html node
     */
    get() {

        return this._element
    }

    /**
     * Returns the name of this node
     * @returns {string}
     */
    name() {

        return this.get().name
    }

    /**
      * Returns the attribute for the given key
      * @returns {Attribute}
      */
    attribute(key) {
        const attributes = this.get().attribs

        return new Attribute(key, attributes[key])
    }

    /**
       * Returns all attributes of this node
       * @returns {Array.<Attribute>}
       */
    attributes() {
        const attributes = this.get().attribs
        const array = []

        for (let key in attributes) {
            array.push(new Attribute(key, attributes[key]))
        }

        return array
    }

    /**
      * Returns an array of nodes matching tag name and attributes
      * @param {string} tag the tag to look for
      * @param {Array<Attribute>} [attrs=empty] attrs an array of attributes
      * @param {Number} [limit=Infinity] limit the max number of results
      * @returns {Array<Node>}
      */
    find(tag, attrs, limit) {
        const elements = domUtils.filter((element) => {
            let found = true

            if (attrs) {
                found = attrs.find((attr) => {
                    return element.attribs[attr.key] === attr.value
                })
            }

            return found && element.name === tag
        }, this._element, true, limit)

        return elements.map((element) => new Node(element))
    }

    /**
      * Removes the first child node with matching tag name and attributes
      * @param {string} tag the tag to look for
      * @param {Array<Attribute>} [attrs=empty] attrs an array of attributes
      * @returns {this}
      */
    removeFirst(tag, attrs) {
        const elements = domUtils.filter((element) => {

            let found = true

            if (attrs) {
                found = attrs.find((attr) => {
                    return element.attribs[attr.key] === attr.value
                })
            }

            return found && element.name === tag
        }, this._element, true, 1)

        domUtils.removeElement(elements[0])

        return this
    }

    /**
      * Removes all child nodes with matching tag name and attributes
      * @param {string} tag the tag to look for
      * @param {Array<Attribute>} [attrs=empty] attrs an array of attributes
      * @returns {this}
      */
    removeAll(tag, attrs) {
        const elements = domUtils.filter((element) => {

            let found = true

            if (attrs) {
                found = attrs.find((attr) => {
                    return element.attribs[attr.key] === attr.value
                })
            }

            return found && element.name === tag
        }, this._element, true)

        elements.forEach((element) => {
            domUtils.removeElement(element)
        })

        return this
    }

    /**
      * Appends a node to this node's children
      * @param {Node} node the node to be appended
      * @returns {this}
      */
    appendChild(node) {
        domUtils.appendChild(this._element, node.get())

        return this
    }

    /**
      * Replaces a child element with a new child
      * @param {Node} newChild the new Child
      * @param {Node} oldChild the old Child to be replaced
      * @returns {this}
      */
    replaceChild(newChild, oldChild) {
        domUtils.replaceElement(oldChild.get(), newChild.get())

        return this
    }

    /**
    * Returns the stringified version of this document
    * @returns {string} 
    */
    toHtml() {

        return domUtils.getOuterHTML(this._element)
    }
}

module.exports = Node