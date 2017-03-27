'use strict'

const Node = require('../../lib/node')
const Attr = require('../../lib/attribute')
const Text = require('../../lib/text')

const htmlParser = require('htmlparser2')
const expect = require('chai').expect
const resolve = require('path').resolve

describe('Node', () => {

    it('should return a single node', () => {
        const string = '<meta name="viewport" content="width=device-width, user-scalable=no">'

        const node = Node.fromString(string)

        expect(node.length).to.equal(undefined)
    })

    it('should contain a head with 4 meta child elements', (done) => {
        Node.fromPath(resolve('test/withMeta.html')).then((node) => {
            const metas = node.find({ name: 'meta', type: Node.TYPE_TAG })

            expect(metas[0].attribute('name').value).to.equal(undefined)
            expect(metas[1].attribute('name').value).to.equal('description')
            expect(metas[2].attribute('name').value).to.equal('viewport')
            expect(metas[3].attribute('name').value).to.equal('theme-color')
        }).then(done, done)
    })

    it('should return a single node', () => {
        const string = '<div><p></p><span></span><p></p></div>'

        const node = Node.fromString(string)

        expect(node.length).to.equal(undefined)
    })

    it('should return an array of nodes', () => {
        const string = [
            '<meta name="viewport" content="width=device-width, user-scalable=no">',
            '<meta name="viewport" content="width=device-width, user-scalable=no">',
            '<meta name="viewport" content="width=device-width, user-scalable=no">'
        ].join('')

        const node = Node.fromString(string)

        expect(node.length).to.equal(3)
    })

    it('should have the correct tag name', () => {
        const string = '<meta name="viewport" content="width=device-width, user-scalable=no">'
        const node = Node.fromString(string)

        expect(node.get().name).to.equal('meta')
    })

    it('should have the correct tag name', () => {
        const string = '<meta name="viewport" content="width=device-width, user-scalable=no">'
        const node = Node.fromString(string)

        expect(node.get().name).to.equal('meta')
        expect(node.get().type).to.equal('tag')
    })

    it('should have the correct tag name', () => {
        const node = Node.of('meta')

        expect(node.get().name).to.equal('meta')
        expect(node.get().type).to.equal('tag')
    })

    it('should create div tag with a text child node', () => {
        const parsed = htmlParser.parseDOM(`<div>{{ id }}</div>`)
        const node = Node.of(parsed[0])
        expect(node.name).to.equal('div')
        expect(node.get().children[0].data).to.equal('{{ id }}')
        expect(node.get().children[0].type).to.equal('text')
    })

    it('should have the correct tag name and type', () => {
        const string = '<script></script>'
        const node = Node.fromString(string)

        expect(node.get().name).to.equal('script')
        expect(node.get().type).to.equal('script')
    })

    it('should have the correct tag name and type', () => {
        const node = Node.of('script')

        expect(node.get().name).to.equal('script')
        expect(node.get().type).to.equal('script')
    })

    it('should have the correct tag name and attributes', () => {
        const node = new Node({ name: 'meta' }, [
            new Attr('name', 'viewport'),
            new Attr('content', 'width=device-width, user-scalable=no')
        ])

        expect(node.get().name).to.equal('meta')
        expect(node.get().attribs.name).to.equal('viewport')
        expect(node.get().attribs.content).to.equal('width=device-width, user-scalable=no')
    })

    it('should remove all p child elements', () => {
        const string = '<div><p></p><span></span><p></p></div>'
        const node = Node.fromString(string)

        node.removeChild('p', null, Infinity)

        expect(node.get().children.length).to.equal(1)
        expect(node.get().children[0].name).to.equal('span')
    })

    it('should remove the meta tags with theme-color and description name', () => {
        const string = [
            '<head>',
            '<meta content="" name="description">',
            '<meta content="width=device-width,user-scalable=no" name="viewport">',
            '<meta content="#795548" name="theme-color">',
            '<title></title>',
            '</head>'
        ].join('')

        const node = Node.fromString(string)

        node.removeChild('meta', [
            new Attr('name', 'theme-color'),
            new Attr('name', 'description')
        ], 2)

        node.get().children.forEach((child) => {

            expect(child.attribs.name).to.not.equal('description')
            expect(child.attribs.name).to.not.equal('theme-color')
        })
    })

    it('should remove the meta tag with theme-color', () => {
        const string = [
            '<head>',
            '<meta content="" name="description">',
            '<meta content="width=device-width,user-scalable=no" name="viewport">',
            '<meta content="#795548" name="theme-color">',
            '<title></title>',
            '</head>'
        ].join('')

        const node = Node.fromString(string)

        node.removeChild('meta', null, 1)

        node.get().children.forEach((child) => {
            expect(child.attribs.name).to.not.equal('description')
        })
    })

    it('should remove all meta tags', () => {
        const string = [
            '<head>',
            '<meta content="" name="description">',
            '<meta content="width=device-width,user-scalable=no" name="viewport">',
            '<meta content="#795548" name="theme-color">',
            '<title></title>',
            '</head>'
        ].join('')

        const node = Node.fromString(string)

        node.removeChild('meta', [
            new Attr('name', 'theme-color'),
            new Attr('name', 'description'),
            new Attr('name', 'viewport')
        ], Infinity)

        node.get().children.forEach((child) => {

            expect(child.name).to.equal('title')
        })
    })

    it('should find the viewport meta tag', () => {
        const parsed = htmlParser.parseDOM([
            '<head>',
            '<meta content="" name="description">',
            '<meta content="width=device-width,user-scalable=no" name="viewport">',
            '<meta content="#795548" name="theme-color">',
            '<title></title>',
            '</head>'
        ].join(''))

        const node = new Node(parsed).find('meta', [
            new Attr('name', 'viewport')
        ])[0]

        expect(node.get().name).to.equal('meta')
        expect(node.get().attribs.name).to.equal('viewport')
    })

    it('should find all meta tags', () => {
        const parsed = htmlParser.parseDOM([
            '<head>',
            '<meta content="" name="description">',
            '<meta content="width=device-width,user-scalable=no" name="viewport">',
            '<meta content="#795548" name="theme-color">',
            '<title></title>',
            '</head>'
        ].join(''))

        const nodes = new Node(parsed).find('meta')

        expect(nodes.length).to.equal(3)
    })

    it('should find a comment tag', () => {
        const parsed = htmlParser.parseDOM([
            '<div>',
            '<!-- @amy import a.html with a.b.c.d -->',
            '<!-- @amy import b.html forEach a.b.c.e -->',
            '</div>'
        ].join(''))

        const nodes = new Node(parsed).find({ type: Node.TYPE_COMMENT })

        expect(nodes.length).to.equal(2)
    })

    it('should find a comment tag', () => {
        const parsed = htmlParser.parseDOM([
            '<div>',
            '<h1>i am a h1 tag</h1>',
            '<h3>i am a h3 tag</h3>',
            '<!-- @amy import a.html with a.b.c.d -->',
            '<!-- @amy import b.html forEach a.b.c.e -->',
            '</div>'
        ].join(''))

        const nodes = new Node(parsed).find({ type: 'comment' })

        expect(nodes.length).to.equal(2)
    })

    it('should return an empty array of nodes', () => {
        const parsed = htmlParser.parseDOM([
            '<div>',
            '<h1>i am a h1 tag</h1>',
            '<h3>i am a h3 tag</h3>',
            '</div>'
        ].join(''))

        const nodes = new Node(parsed).find({ type: 'comment' })

        expect(nodes.length).to.equal(0)
    })

    it('should contain three meta tags', () => {
        const string = [
            '<head>',
            '<meta content="" name="description">',
            '<meta content="width=device-width,user-scalable=no" name="viewport">',
            '<meta content="#795548" name="theme-color">',
            '<title></title>',
            '</head>'
        ].join('')

        const nodes = Node.fromString(string).find('meta')

        expect(nodes.length).to.equal(3)
    })

    it('should replace the table tag', () => {
        const string = [
            '<body id="body">' +
            '<div id="abc"></div>' +
            '<room-overview></room-overview>' +
            '<table></table>' +
            '</body>'
        ].join('')

        const node = Node.fromString(string)

        node.replaceChild(new Node({ type: 'tag', name: 'span' }), node.find('table')[0])

        expect(node.find('span')[0].name).to.equal('span')
        expect(node.find('table')[0]).to.equal(undefined)
    })

    it('should return the correct name of the head node', () => {
        const string = [
            '<head>',
            '<meta content="" name="description">',
            '<meta content="width=device-width,user-scalable=no" name="viewport">',
            '<meta content="#795548" name="theme-color">',
            '<title></title>',
            '</head>'
        ].join('')

        const node = Node.fromString(string)

        expect(node.name).to.equal('head')
    })

    it('should return the correct name of the meta node', () => {
        const string = [
            '<head>',
            '<meta content="" name="description">',
            '<meta content="width=device-width,user-scalable=no" name="viewport">',
            '<meta content="#795548" name="theme-color">',
            '<title></title>',
            '</head>'
        ].join('')

        const node = Node.fromString(string).find('meta', [
            new Attr('name', 'description')
        ])[0]

        expect(node.name).to.equal('meta')
    })

    it('should return the correct attributes of the meta node', () => {
        const string = [
            '<head>',
            '<meta content="" name="description">',
            '<meta content="width=device-width,user-scalable=no" name="viewport">',
            '<meta content="#795548" name="theme-color">',
            '<title></title>',
            '</head>'
        ].join('')

        const node = Node.fromString(string).find('meta', [
            new Attr('name', 'description')
        ])[0]

        expect(node.attribute('name').key).to.equal('name')
        expect(node.attribute('name').value).to.equal('description')
    })

    it('should return the correct attributes of the meta node', () => {
        const string = [
            '<head>',
            '<meta content="" name="description" id="0815" abc="123">',
            '<meta content="width=device-width,user-scalable=no" name="viewport">',
            '<meta content="#795548" name="theme-color">',
            '<title></title>',
            '</head>'
        ].join('')

        const node = Node.fromString(string).find('meta', [
            new Attr('name', 'description')
        ])[0]

        expect(Object.keys(node.attributes).length).to.equal(4)
        expect(node.attributes.content).to.equal('')
        expect(node.attributes.name).to.equal('description')
        expect(node.attributes.id).to.equal('0815')
        expect(node.attributes.abc).to.equal('123')
    })

    it('should not return undefined if no attributes are set', () => {
        const string = [
            '<head>',
            '<meta content="" name="description" id="0815" abc="123">',
            '<meta content="width=device-width,user-scalable=no" name="viewport">',
            '<meta content="#795548" name="theme-color">',
            '<title></title>',
            '</head>'
        ].join('')

        const head = Node.fromString(string)

        expect(head.name).to.equal('head')
        expect(head.attributes).to.be.defined
    })

    it('should append a text node', () => {
        const node = Node.fromString('<div></div>').appendChild(Text.of('eins')).appendChild(Text.of('deux'))

        expect(node.get().children.length).to.equal(2)
        expect(node.get().children[0].data).to.equal('eins')
        expect(node.get().children[1].data).to.equal('deux')
        expect(node.get().children[1].type).to.equal(Node.TYPE_TEXT)
    })

    it('should return html', () => {

        const node = Node.fromString('<div></div>')
        const html = node.toHtml()

        expect(html).to.equal('<div></div>')
    })

    it('should add a attribute', () => {

        const node = Node.fromString('<div></div>')
        node.attribute(new Attr('id', 'content'))

        expect(node.attribute('id').value).to.equal('content')
    })

    it('should find a comment node', () => {

    })

    it('should find a node', () => {

        const parsed = htmlParser.parseDOM([
            '<head>',
            '<meta content="" name="description">',
            '<meta content="width=device-width,user-scalable=no" name="viewport">',
            '<meta content="#795548" name="theme-color">',
            '<title></title>',
            '</head>'
        ].join(''))

        const node = new Node(parsed).find({ name: 'meta', type: Node.TYPE_TAG }, [
            new Attr('name', 'viewport')
        ])[0]

        expect(node.get().name).to.equal('meta')
        expect(node.get().attribs.name).to.equal('viewport')
    })

    it('should append a new element after a given current element', (done) => {
        Node.fromPath(resolve('test/withMeta.html')).then((node) => {
            let metas = node.find({ name: 'meta', type: Node.TYPE_TAG })
            const descriptionMeta = metas[1]

            node.appendChildAfter(Node.fromString('<meta name="author" content="Hmmpft">'), descriptionMeta)

            metas = node.find({ name: 'meta', type: Node.TYPE_TAG })

            expect(metas.length).to.equal(5)
            expect(metas[0].attribute('name').value).to.equal(undefined)
            expect(metas[1].attribute('name').value).to.equal('description')
            expect(metas[2].attribute('name').value).to.equal('author')
            expect(metas[3].attribute('name').value).to.equal('viewport')
            expect(metas[4].attribute('name').value).to.equal('theme-color')
        }).then(done, done)
    })

    it('should prepend a new element before a given current element', (done) => {
        Node.fromPath(resolve('test/withMeta.html')).then((node) => {
            let metas = node.find({ name: 'meta', type: Node.TYPE_TAG })
            const descriptionMeta = metas[1]

            node.appendChildBefore(Node.fromString('<meta name="author" content="Hmmpft">'), descriptionMeta)

            metas = node.find({ name: 'meta', type: Node.TYPE_TAG })

            expect(metas.length).to.equal(5)
            expect(metas[0].attribute('name').value).to.equal(undefined)
            expect(metas[1].attribute('name').value).to.equal('author')
            expect(metas[2].attribute('name').value).to.equal('description')
            expect(metas[3].attribute('name').value).to.equal('viewport')
            expect(metas[4].attribute('name').value).to.equal('theme-color')
        }).then(done, done)
    })

    it('should return the parent node', () => {
        const string = [
            '<head>',
            '<meta content="" name="description">',
            '<meta content="width=device-width,user-scalable=no" name="viewport">',
            '<meta content="#795548" name="theme-color">',
            '<title></title>',
            '</head>'
        ].join('')

        const node = Node.fromString(string)
        const meta = node.find('meta', null, 1)[0]
        const parent = meta.parent
    
        expect(parent.name).to.equal('head')
    })
})