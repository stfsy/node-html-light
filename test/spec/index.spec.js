'use strict'

const htmlManipulate = require('../../lib/index.js')
const expect = require('chai').expect

describe('HtmlManipulate', () => {

    it('should contain the document class', () => {

        expect(typeof htmlManipulate.Document).to.equal('function')
    })

    it('should contain the node class', () => {

        expect(typeof htmlManipulate.Node).to.equal('function')
    })

    it('should contain the attribute class', () => {

        expect(typeof htmlManipulate.Attr).to.equal('function')
    })
})