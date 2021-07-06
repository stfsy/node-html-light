'use strict'

const Node = require('../../lib/node')
const Nodes = require('../../lib/nodes')

const htmlParser = require('htmlparser2')
const expect = require('chai').expect

describe('Nodes', () => {

    let nodes = null
    let anotherNodes = null

    beforeEach(() => {
        const string = `<meta charset="utf-8">
                <meta name="description" content="">
                <meta name="viewport" content="width=device-width, user-scalable=no">
                <meta name="theme-color" content="#795548">`

        const node = Node.fromString(string)
        nodes = Nodes.of(node)
        const anotherString = `<html>
            <head></head>
            <body>
                <div>Hello World!</div>
                <div></div>
            </body>
            </html>
        `
        const anotherNode = Node.fromString(anotherString)
        anotherNodes = Nodes.of(anotherNode)
    })
    it('should find all four meta tags', () => {
        const metas = nodes.find({ name: 'meta', type: Node.TYPE_TAG })
        expect(metas[0].attributes.name).to.equal(undefined)
        expect(metas[1].attributes.name).to.equal('description')
        expect(metas[2].attributes.name).to.equal('viewport')
        expect(metas[3].attributes.name).to.equal('theme-color')
    })
    it('should find one meta tags', () => {
        const metas = nodes.find({ name: 'meta', type: Node.TYPE_TAG }, null, 1)
        expect(metas[0].attributes.name).to.equal(undefined)
    })
    it('should find two meta tags', () => {
        const metas = nodes.find({ name: 'meta', type: Node.TYPE_TAG }, null, 2)
        expect(metas[0].attributes.name).to.equal(undefined)
        expect(metas[1].attributes.name).to.equal('description')
    })
    it('should find two meta tags', () => {
        const metas = nodes.find({ name: 'meta', type: Node.TYPE_TAG }, null, 3)
        expect(metas[0].attributes.name).to.equal(undefined)
        expect(metas[1].attributes.name).to.equal('description')
        expect(metas[2].attributes.name).to.equal('viewport')
    })
    it('should return an empty array', () => {
        const metas = nodes.find({ name: 'html', type: Node.TYPE_TAG })
        expect(metas.length).to.equal(0)
    })
    it('should invoke the callback function 7 times', () => {
        let index = 0
        nodes.forEach(() => {
            index++
        }, true)
        expect(index).to.equal(4)
    })
    it('should invoke the callback with current index', () => {
        nodes.forEach((_, i) => {
            expect(i).to.not.be.undefined
        }, true)
    })
    it('should invoke the callback function 3 times', () => {
        let index = 0
        anotherNodes.forEach(() => {
            index++
        })
        expect(index).to.equal(1)
    })
    it('should invoke the callback function 5 times', () => {
        let index = 0
        anotherNodes.forEach(() => {
            index++
        }, true)
        expect(index).to.equal(6)
    })
})