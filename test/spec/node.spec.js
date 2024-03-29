'use strict'

const Node = require('../../lib/node')
const Attr = require('../../lib/attribute')
const Text = require('../../lib/text')

const htmlParser = require('htmlparser2')
const expect = require('chai').expect
const resolve = require('path').resolve

describe('Node', () => {

    it('should callback for each node and childnodes', () => {
        const node = Node.fromString(['<head>',
            '<meta content="" name="description">',
            '<meta content="width=device-width,user-scalable=no" name="viewport">',
            '<meta content="#795548" name="theme-color">',
            '<title></title>',
            '</head>'].join(''))

        let count = 0
        node.filter((el) => {
            count += 1
        })
        expect(count).to.be.equal(5)
    })

    it('should callback for each node and childnodes by type tag', () => {
        const node = Node.fromString(['<head>',
            '<meta content="" name="description">',
            '<style></style>',
            '<script></script>',
            '<meta content="width=device-width,user-scalable=no" name="viewport">',
            '<meta content="#795548" name="theme-color">',
            '<title></title>',
            '</head>'].join(''))

        let count = 0
        node.filterByType((el) => {
            count += 1
        }, [Node.TYPE_TAG])
        expect(count).to.be.equal(5)
    })

    it('should callback for each node and childnodes by type style and script', () => {
        const node = Node.fromString(['<head>',
            '<meta content="" name="description">',
            '<style></style>',
            '<script></script>',
            '<meta content="width=device-width,user-scalable=no" name="viewport">',
            '<meta content="#795548" name="theme-color">',
            '<title></title>',
            '</head>'].join(''))

        let count = 0
        node.filterByType((el) => {
            count += 1
        }, [Node.TYPE_STYLE, Node.TYPE_SCRIPT])
        expect(count).to.be.equal(2)
    })

    it('returns children when callback returned true', () => {
        const node = Node.fromString(['<head>',
            '<meta content="" name="description">',
            '<meta content="width=device-width,user-scalable=no" name="viewport">',
            '<meta content="#795548" name="theme-color">',
            '<title></title>',
            '</head>'].join(''))

        const result = node.filter((el) => {
            return el.name === 'title'
        })
        expect(result).to.have.length(1)
        expect(result[0].name).to.be.equal('title')
    })


    it('should return a single node', () => {
        const string = '<meta name="viewport" content="width=device-width, user-scalable=no">'

        const node = Node.fromString(string)

        expect(node.length).to.equal(undefined)
    })

    it('should contain a head with 4 meta child elements', (done) => {
        Node.fromPath(resolve('test/withMeta.html')).then((node) => {
            const metas = node.find({ name: 'meta', type: Node.TYPE_TAG })

            expect(metas[0].attributes.name).to.equal(undefined)
            expect(metas[1].attributes.name).to.equal('description')
            expect(metas[2].attributes.name).to.equal('viewport')
            expect(metas[3].attributes.name).to.equal('theme-color')
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

    it('returns the current DOMS root element', () => {
        const string = [
            '<header>',
            '<meta name="viewport" content="width=device-width, user-scalable=no">',
            '<meta name="viewport" content="width=device-width, user-scalable=no">',
            '<meta name="viewport" content="width=device-width, user-scalable=no">',
            '</header>'
        ].join('')

        const node = Node.fromString(string)
        const meta = node.find('meta')[0]
        const root = meta.root
        expect(root.name).to.equal('header')
    })

    it('returns the elements children wrapped as Nodes', () => {
        const string = [
            '<header>',
            '<meta name="viewport" content="width=device-width, user-scalable=no">',
            '<meta name="viewport" content="width=device-width, user-scalable=no">',
            '<meta name="viewport" content="width=device-width, user-scalable=no">',
            '</header>'
        ].join('')

        const node = Node.fromString(string)
        const children = node.children
        expect(children).to.have.length(3)
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
        const string = '<div><p></p><span></span></div>'
        const node = Node.fromString(string)
        const p = node.find('p')
        node.removeChild(p)

        expect(node.get().children.length).to.equal(1)
        expect(node.get().children[0].name).to.equal('span')
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
        const meta = node.find('meta')

        node.removeChild(meta)

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

        expect(node.attributes.name).to.equal('description')
    })

    it('should update all attributes', () => {
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

        node.attributes = { 1: 2, 3: 4 }

        expect(Object.keys(node.attributes).length).to.equal(2)
        expect(node.attributes[1]).to.equal(2)
        expect(node.attributes[3]).to.equal(4)
    })

    it('should return the correct attributes of the meta node', () => {
        const string = [
            '<head>',
            '<meta content="width=device-width,user-scalable=no" name="viewport">',
            '<meta content="" name="description" id="0815" abc="123">',
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
        expect(head.attributes).not.to.be.undefined
    })

    it('should return the previous node', () => {
        const div = Node.fromString('<div></div>')
        const p = Node.fromString('<p></p>')
        const span = Node.fromString('<span></span>')
        div.appendChild(p)
        div.appendChild(span)

        expect(span.previousSibling.name).to.equal('p')
    })

    it('should return the next node', () => {
        const div = Node.fromString('<div></div>')
        const p = Node.fromString('<p></p>')
        const span = Node.fromString('<span></span>')
        div.appendChild(p)
        div.appendChild(span)

        expect(p.nextSibling.name).to.equal('span')
    })

    it('should append a text node', () => {
        const node = Node.fromString('<div></div>')
        node.appendChild(Text.of('eins'))
        node.appendChild(Text.of('deux'))

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
        node.attributes.id = 'content'

        expect(node.attributes.id).to.equal('content')
    })

    it('parses self closing html tags', () => {
        const node = Node.fromString('<div></div><span/>')[1]
        expect(node.name).to.equal('span')
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
    it('should find a script node without type argument', () => {

        const parsed = htmlParser.parseDOM([
            '<head>',
            '<meta content="" name="description">',
            '<meta content="width=device-width,user-scalable=no" name="viewport">',
            '<meta content="#795548" name="theme-color">',
            '<title></title>',
            '<script>Hello World</script>',
            '</head>'
        ].join(''))

        const node = new Node(parsed).find('script')[0]
        expect(node.get().children[0].data).to.equal('Hello World')
    })

    it('should append a new element after a given current element', (done) => {
        Node.fromPath(resolve('test/withMeta.html')).then((node) => {
            let metas = node.find({ name: 'meta', type: Node.TYPE_TAG })
            const descriptionMeta = metas[1]

            node.appendChildAfter(Node.fromString('<meta name="author" content="Hmmpft">'), descriptionMeta)

            metas = node.find({ name: 'meta', type: Node.TYPE_TAG })

            expect(metas.length).to.equal(5)
            expect(metas[0].attributes.name).to.equal(undefined)
            expect(metas[1].attributes.name).to.equal('description')
            expect(metas[2].attributes.name).to.equal('author')
            expect(metas[3].attributes.name).to.equal('viewport')
            expect(metas[4].attributes.name).to.equal('theme-color')
        }).then(done, done)
    })

    it('should prepend a new element before a given current element', (done) => {
        Node.fromPath(resolve('test/withMeta.html')).then((node) => {
            let metas = node.find({ name: 'meta', type: Node.TYPE_TAG })
            const descriptionMeta = metas[1]

            node.appendChildBefore(Node.fromString('<meta name="author" content="Hmmpft">'), descriptionMeta)

            metas = node.find({ name: 'meta', type: Node.TYPE_TAG })

            expect(metas.length).to.equal(5)
            expect(metas[0].attributes.name).to.equal(undefined)
            expect(metas[1].attributes.name).to.equal('author')
            expect(metas[2].attributes.name).to.equal('description')
            expect(metas[3].attributes.name).to.equal('viewport')
            expect(metas[4].attributes.name).to.equal('theme-color')
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

    it('should return null if no parent node exists', () => {
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

    it('should return type tag', () => {
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
        expect(node.type).to.equal('tag')
    })

    it('should return type text', () => {
        const string = ['abc'
        ].join('')

        const node = Node.fromString(string)

        expect(node.type).to.equal('text')
    })

    it('should return type style', () => {
        const node = Node.fromString('<style></style>')
        expect(node.type).to.equal(Node.TYPE_STYLE)
    })
})
