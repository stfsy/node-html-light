'use strict'

const htmlParser = require('htmlparser2')

const expect = require('chai').expect
const resolve = require('path').resolve

describe('HtmlParser', () => {

    it('should an object containing the correct tag name and attribute', () => {

        const parsed = htmlParser.parseDOM('<script src="helloworld.js"></script>')[0]

        expect(parsed.name).to.equal('script')
        expect(parsed.attribs).to.be.a('object')
        expect(parsed.attribs.src).to.equal('helloworld.js')
    })

    it('should an object containing the correct tag name and attributes', () => {

        const parsed = htmlParser.parseDOM('<meta name="viewport" content="width=device-width, user-scalable=no">')[0]

        expect(parsed.name).to.equal('meta')
        expect(parsed.attribs).to.be.a('object')
        expect(parsed.attribs.name).to.equal('viewport')
        expect(parsed.attribs.content).to.equal('width=device-width, user-scalable=no')
    })

    it('should have zero child elements', () => {

        const parsed = htmlParser.parseDOM('<div></div>')[0]

        expect(parsed.name).to.equal('div')
        expect(parsed.children[0]).to.be.equal(undefined)
    })

    it('should have one child element', () => {

        const parsed = htmlParser.parseDOM('<div><p></p></div>')[0]

        expect(parsed.name).to.equal('div')
        expect(parsed.type).to.equal('tag')
        expect(parsed.children[0].name).to.equal('p')
    })

    it('should create a link element', () => {

        const parsed = htmlParser.parseDOM('<link>')[0]

        expect(parsed.name).to.equal('link')
        expect(parsed.type).to.equal('tag')
    })

    it('should create a script element', () => {

        const parsed = htmlParser.parseDOM('<script></script>')[0]

        expect(parsed.name).to.equal('script')
        expect(parsed.type).to.equal('script')
    })

    it('should create a text element', () => {

        const parsed = htmlParser.parseDOM('ABCDEFGH')[0]

        expect(parsed.data).to.equal('ABCDEFGH')
        expect(parsed.type).to.equal('text')
    })
})