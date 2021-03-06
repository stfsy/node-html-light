'use strict'

const htmlParser = require('htmlparser2')
const domUtils = htmlParser.DomUtils
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

    it('should parse comments', () => {

        const parsed = htmlParser.parseDOM(`<div>
          <!-- @amy import a.html with a.b.c.d -->
          <!-- @amy import b.html forEach a.b.c.e -->
        </div>`)

        expect(parsed[0].children[1].type).to.equal('comment')
        expect(parsed[0].children[1].data).to.equal(' @amy import a.html with a.b.c.d ')
        expect(parsed[0].children[3].type).to.equal('comment')
        expect(parsed[0].children[3].data).to.equal(' @amy import b.html forEach a.b.c.e ')
    })

    it('should contain a undefined data attribute', () => {

        const parsed = htmlParser.parseDOM(`<div>
          <!-- @amy import a.html with a.b.c.d -->
          <!-- @amy import b.html forEach a.b.c.e -->
        </div>`)

        expect(parsed[0].type).to.equal('tag')
        expect(parsed[0].name).to.equal('div')
        expect(parsed[0].data).to.equal(undefined)

    })

    it('should parse text', () => {
        const parsed = htmlParser.parseDOM(`Hello`)

        expect(parsed[0].type).to.equal('text')
    })

    it('should parse parametrized text nodes', () => {
        const parsed = htmlParser.parseDOM(`{{ id }}`)

        expect(parsed[0].type).to.equal('text')
    })

    it('should parse parametrized child text nodes', () => {
        const parsed = htmlParser.parseDOM(`<div>{{ id }}</div>`)
        expect(parsed[0].children[0].type).to.equal('text')
    })


    it('should link child elements to parents', () => {
        const parsed = htmlParser.parseDOM(`<div>
          <!-- @amy import a.html with a.b.c.d -->
          <!-- @amy import b.html forEach a.b.c.e -->
        </div>`)

        expect(parsed[0].children[1].parent).to.equal(parsed[0])
        expect(parsed[0].children[2].parent).to.equal(parsed[0])
        expect(parsed[0].children[3].parent).to.equal(parsed[0])
    })

   
    it('should parse multiline comments as one node', () => {
        const comment = htmlParser.parseDOM(`<!-- @amy import b.html forEach a.b.c.e 
                    and add c.html with def
        `)

        expect(comment.length).to.equal(1)
    })

    it('should parse style elements', () => {
        const style = htmlParser.parseDOM(`<style></style>`)[0]
        expect(style.name).to.equal('style')
        expect(style.type).to.equal('style')
    })

    it('should parse script elements', () => {
        const script = htmlParser.parseDOM(`<script></script>`)[0]
        expect(script.name).to.equal('script')
        expect(script.type).to.equal('script')
    })

    it('should not encode br tags', () => {
        const html = htmlParser.parseDOM('<span><br><br></span>')[0]
        const htmlString = domUtils.getOuterHTML(html)
        expect(htmlString).to.contain('<br><br>')
    })
    it('auto opens br tags', () => {
        const html = htmlParser.parseDOM('<span><br/><br/></span>')[0]
        const htmlString = domUtils.getOuterHTML(html)
        expect(htmlString).to.contain('<br><br>')
    })
})