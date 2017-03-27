'use strict'

const Attribute = require('./attribute')

const htmlParser = require('htmlparser2')
const domUtils = htmlParser.DomUtils
const fs = require('fs')

/**
 * @class
 * @memberof node-html-light
 */
class Node {

    /** */
    static get TYPE_COMMENT() {
        return 'comment'
    }
    /** */
    static get TYPE_TAG() {
        return 'tag'
    }
    /** */
    static get TYPE_TEXT() {
        return 'text'
    }

    /**
    * Creates a new document of a files contents
    * @param {string} path path to a file
    * @returns {Node} a new document
    */
    static fromPath(path) {
        return new Promise((resolve, reject) => {
            fs.readFile(path, { encoding: 'utf-8' }, (error, data) => {
                if (error) {
                    reject(error)
                } else {
                    const node = Node.fromString(data)
                    resolve(node)
                }
            })
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
     * @param {string|Object} tag the nodes name or a pojo that will be wrapped
     * @param {Array.<Attribute>} [attrs=empty] attrs an array of attributes
     * @returns {Node} a new Node
     */
    static of(tag, attrs) {

        if (tag instanceof Node) {
            return tag
        } else if (typeof tag === 'object') {
            return new Node(tag, attrs)
        }

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
     * Returns the parent node of this node
     * @returns {Node}
     */
    parent() {

        return new Node(this.get().parent)
    }

    /**
      * Returns or sets the attribute for the given key and value
      * @param {string|Attribute} attr a key for getting an attribute or an attribute for setting the attribute on this node
      * @returns {Attribute}
      */
    attribute(attr) {
        const attributes = this.get().attribs

        if (typeof attr === 'string') {
            return new Attribute(attr, attributes[attr])
        } else if (typeof attr === 'object') {
            attributes[attr.key] = attr.value
        }

        return new Attribute(attr.key, attr.value)
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
      * @param {Object} element an object whos properties reflect the properties of the element we are looking for
      * @param {Array<Attribute>} [attrs=empty] attrs an array of attributes
      * @param {Number} [limit=Infinity] limit the max number of results
      * @returns {Array<Node>}
      */
    find(element, attrs, limit) {

        if (typeof element === 'string') {
            const name = element

            element = {
                type: 'tag',
                name: name
            }
        }

        const elements = domUtils.filter((el) => {
            let found = true

            found = Object.keys(element).every((key) => el[key] === element[key])

            if (found && attrs) {
                found = attrs.find((attr) => {
                    return el.attribs[attr.key] === attr.value
                })
            }

            return found
        }, this._element, true, limit)

        return elements.map((el) => new Node(el))
    }

    /**
      * Removes all child nodes with matching tag name and attributes
      * @param {string} tag the tag to look for
      * @param {Array<Attribute>} [attrs=empty] attrs an array of attributes
      * @param {Number} [limit=1] limit the max number of elements to be removed
      * @returns {this}
      */
    removeChild(tag, attrs, limit) {

        if (limit === undefined || limit === null) {
            limit = 1
        }

        const elements = domUtils.filter((element) => {

            let found = true

            if (attrs) {
                found = attrs.find((attr) => {
                    return element.attribs[attr.key] === attr.value
                })
            }

            return found && element.name === tag
        }, this._element, true, limit)

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
      * Insert a new child element before an existing child
      * @param {Node} newChild the new Child to be inserted
      * @param {Node} existingChild the existing Child
      * @returns {this}
      */
    appendChildBefore(newChild, existingChild) {
        domUtils.prepend(existingChild.get(), newChild.get())

        return this
    }

    /**
      * Insert a new child element after an existing child
      * @param {Node} newChild the new Child to be inserted
      * @param {Node} existingChild the existing Child
      * @returns {this}
      */
    appendChildAfter(newChild, existingChild) {
        domUtils.append(existingChild.get(), newChild.get())

        return this
    }

    /**
      * Replaces a child element with a new child
      * @param {Node} newChild the new Child
      * @param {Node} existingChild the existing Child to be replaced
      * @returns {this}
      */
    replaceChild(newChild, existingChild) {
        domUtils.replaceElement(oldChild.get(), existingChild.get())

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