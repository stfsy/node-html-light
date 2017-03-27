'use strict'

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
    get name() {
        return this.get().name
    }

    /**
     * Returns the parent node of this node
     * @returns {Node}
     */
    get parent() {
        return new Node(this.get().parent)
    }

    /**
       * Returns all attributes of this node. The returned object is live, so you can add or remove attributes as you wish
       * @returns {Object}
       */
    get attributes() {
        return this.get().attribs
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
    }

    /**
      * Appends a node to this node's children
      * @param {Node} newChild the node to be appended
      * @returns {this}
      */
    appendChild(newChild) {
        domUtils.appendChild(this._element, newChild.get())
    }

    /**
      * Insert a new child element before an existing child
      * @param {Node} newChild the new Child to be inserted
      * @param {Node} existingChild the existing Child
      * @returns {this}
      */
    appendChildBefore(newChild, existingChild) {
        domUtils.prepend(existingChild.get(), newChild.get())
    }

    /**
      * Insert a new child element after an existing child
      * @param {Node} newChild the new Child to be inserted
      * @param {Node} existingChild the existing Child
      * @returns {this}
      */
    appendChildAfter(newChild, existingChild) {
        domUtils.append(existingChild.get(), newChild.get())
    }

    /**
      * Replaces a child element with a new child
      * @param {Node} newChild the new Child
      * @param {Node} existingChild the existing Child to be replaced
      * @returns {this}
      */
    replaceChild(newChild, existingChild) {
        domUtils.replaceElement(existingChild.get(), newChild.get())
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