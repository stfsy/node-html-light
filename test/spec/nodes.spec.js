'use strict'

const Node = require('../../lib/node')
const Nodes = require('../../lib/nodes')

const htmlParser = require('htmlparser2')
const expect = require('chai').expect

describe('Nodes', () => {

    let nodes = null

    beforeEach(() => {
        const string = `<meta charset="utf-8">
                <meta name="description" content="">
                <meta name="viewport" content="width=device-width, user-scalable=no">
                <meta name="theme-color" content="#795548">`

        const node = Node.fromString(string)
        nodes = Nodes.fromArray(node)
    })
    it('should find all four meta tags', () => {
        const metas = nodes.find({ name: 'meta', type: Node.TYPE_TAG })
        expect(metas[0].attribute('name').value).to.equal(undefined)
        expect(metas[1].attribute('name').value).to.equal('description')
        expect(metas[2].attribute('name').value).to.equal('viewport')
        expect(metas[3].attribute('name').value).to.equal('theme-color')
    })
    it('should find one meta tags', () => {
        const metas = nodes.find({ name: 'meta', type: Node.TYPE_TAG }, null, 1)
        expect(metas[0].attribute('name').value).to.equal(undefined)
    })
    it('should find two meta tags', () => {
        const metas = nodes.find({ name: 'meta', type: Node.TYPE_TAG }, null, 2)
        expect(metas[0].attribute('name').value).to.equal(undefined)
        expect(metas[1].attribute('name').value).to.equal('description')
    })
    it('should find two meta tags', () => {
        const metas = nodes.find({ name: 'meta', type: Node.TYPE_TAG }, null, 3)
        console.log(metas[0].get().attribs)
        console.log(metas[1].get().attribs)
        expect(metas[0].attribute('name').value).to.equal(undefined)
        expect(metas[1].attribute('name').value).to.equal('description')
        expect(metas[2].attribute('name').value).to.equal('viewport')
    })
    it('should return an empty array', () => {
        const metas = nodes.find({ name: 'html', type: Node.TYPE_TAG })
        expect(metas.length).to.equal(0)
    })
})