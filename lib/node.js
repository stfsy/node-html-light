'use strict'

const htmlParser = require('htmlparser2')
const domUtils = htmlParser.DomUtils
const domSerializer = require('dom-serializer')
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
    /** */
    static get TYPE_SCRIPT() {
        return 'script'
    }

    /** */
    static get TYPE_STYLE() {
        return 'style'
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

        const parsed = htmlParser.parseDocument(string, {
            recognizeCDATA: false,
            recognizeSelfClosing: true,
            lowerCaseAttributeNames: false,
            lowerCaseTags: false,
            xmlMode: false,
            decodeEntities: false
        }).children

        if (parsed.length > 1) {

            return parsed.map(string => new Node(string))
        } else if (parsed.length === 1) {

            return new Node(parsed[0])
        }

        return new Node(parsed)
    }

    /**
     * Creates a new Node with name and attributes
     * @param {Object} tag the nodes name or a pojo that will be wrapped
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
            case Node.TYPE_SCRIPT: {
                node.type = Node.TYPE_SCRIPT
                break
            }

            default: {
                node.type = Node.TYPE_TAG
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
     * Returns the type of this node
     * @see node-html-light.Node.TYPE_COMMENT
     * @see node-html-light.Node.TYPE_TAG
     * @see node-html-light.Node.TYPE_TEXT
     * @returns {string}
     */
    get type() {
        return this.get().type
    }

    /**
     * Returns the parent node of this node
     * @returns {Node}
     */
    get parent() {
        return this._wrapOrNull(this.get().parent)
    }

    /**
     * 
     * @returns {Array<Node>}
     */
    get children() {
        return this.get().children.map(child => new Node(child))
    }

    /**
     * Returns the previous sibling of the current node
     * @returns {Node}
     */
    get previousSibling() {
        let previous = this.get().previousSibling
        while (previous && previous.type !== Node.TYPE_TAG) {
            previous = previous.previousSibling
        }
        return this._wrapOrNull(previous)
    }

    /**
    * Returns the next sibling of the current node
    * @returns {Node}
    */
    get nextSibling() {
        let next = this.get().next
        while (next && next.type !== Node.TYPE_TAG) {
            next = next.next
        }
        return this._wrapOrNull(next)
    }

    /**
     * @private
     */
    _wrapOrNull(rawElement) {
        if (rawElement) {
            return new Node(rawElement)
        }

        return null
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
            const type = name === Node.TYPE_SCRIPT ? Node.TYPE_SCRIPT : Node.TYPE_TAG

            element = {
                type, name
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

        return elements.map((el) => Node.of(el))
    }

    /**
      * Search a node and its children for nodes passing a test function.
      * @param {Function} callback the callback returns true for elements that should be in the returned array
      * @param {Number} [limit=Infinity] limit the max number of results
      * @returns {Array<Node>}
    */
    filter(callback, limit = Infinity) {
        return domUtils.filter(callback, this._element, true, limit).map(el => Node.of(el))
    }

    /**
    * Search a node and its children by type for nodes passing a test function.
    * @param {Function} callback the callback returns true for elements that should be in the returned array
    * @param {Array<String>} types for these types the callback will be fired @see i.e. Node.TYPE_TAG
    * @param {Number} [limit=Infinity] limit the max number of results
    * @returns {Array<Node>}
    */
    filterByType(callback, types, limit = Infinity) {
        return this.filter((node) => {
            if (types.includes(node.type)) {
                callback(node)
            }
        }, limit)
    }

    /**
      * Removes a child node
      * @param {Node|Array<Node>} child the child node to remove
      * @returns {this}
      */
    removeChild(child) {
        if (Array.isArray(child)) {
            child.forEach(element => domUtils.removeElement(element.get()))
        } else {
            domUtils.removeElement(child.get())
        }
    }

    /**
      * Appends a node to this node's children
      * @param {Node} newChild the node to be appended
      */
    appendChild(newChild) {
        domUtils.appendChild(this._element, newChild.get())
    }

    /**
      * Insert a new child element before an existing child
      * @param {Node} newChild the new Child to be inserted
      * @param {Node} existingChild the existing Child
      */
    appendChildBefore(newChild, existingChild) {
        domUtils.prepend(existingChild.get(), newChild.get())
    }

    /**
      * Insert a new child element after an existing child
      * @param {Node} newChild the new Child to be inserted
      * @param {Node} existingChild the existing Child
      */
    appendChildAfter(newChild, existingChild) {
        domUtils.append(existingChild.get(), newChild.get())
    }

    /**
      * Replaces a child element with a new child
      * @param {Node} newChild the new Child
      * @param {Node} existingChild the existing Child to be replaced
      */
    replaceChild(newChild, existingChild) {
        domUtils.replaceElement(existingChild.get(), newChild.get())
    }

    /**
    * Returns the stringified version of this document
    * @returns {string} 
    */
    toHtml() {
        return domSerializer.default(this._element, {
            decodeEntities: false,
            selfClosingTags: false,
            emptyAttrs: false,
            xmlMode: false
        })
    }
}

module.exports = Node