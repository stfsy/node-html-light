'use strict'

const Document = require('../../lib/document')
const Node = require('../../lib/node')

const htmlParser = require('htmlparser2')
const domUtils = htmlParser.DomUtils
const expect = require('chai').expect
const resolve = require('path').resolve

describe('Document', () => {

    it('should parse a simple document', (done) => {
        Document.fromPath(resolve('test/simple.html')).then((document) => {
        }).then(done, done)
    })

    it('should contain a head with 4 meta child elements', (done) => {
        Document.fromPath(resolve('test/withMeta.html')).then((document) => {
            const metas = document.head().find('meta')

            expect(metas[0].attribute('name').value).to.equal(undefined)
            expect(metas[1].attribute('name').value).to.equal('description')
            expect(metas[2].attribute('name').value).to.equal('viewport')
            expect(metas[3].attribute('name').value).to.equal('theme-color')
        }).then(done, done)
    })

    it('should contain a head with 2 style child elements', (done) => {
        Document.fromPath(resolve('test/withStyles.html')).then((document) => {
            const styles = document.head().find('link')

            expect(styles[0].attribute('href').value).to.equal('bootstrap.css')
            expect(styles[1].attribute('href').value).to.equal('stfsy.css')
        }).then(done, done)
    })

    it('should contain a body with 4 child elements', (done) => {
        Document.fromPath(resolve('test/withBody.html')).then((document) => {
            const childs = domUtils.find((element) => {
                return element.name
            }, document.body().get().children, true)

            expect(childs[0].name).to.equal('div')
            expect(childs[1].name).to.equal('room-overview')
            expect(childs[2].name).to.equal('table')
        }).then(done, done)
    })

    it('should contain a html node with 4 child elements', (done) => {
        Document.fromPath(resolve('test/withBody.html')).then((document) => {
            const body = document.html()

            expect(body.name()).to.equal('html')
        }).then(done, done)
    })

    it('should remove children of the head node', (done) => {
        Document.fromPath(resolve('test/withMeta.html')).then((document) => {
            const head = document.head().get()
            const length = head.children.length

            document.head().removeAll('meta')

            expect(head.children.length).to.equal(length - 4)
        }).then(done, done)
    })

    it('should remove children of the body node', (done) => {

        Document.fromPath(resolve('test/withBody.html')).then((document) => {
            const body = document.body().get()
            const length = body.children.length

            document.body().removeAll('room-overview')

            expect(body.children.length).to.equal(length - 1)
        }).then(done, done)
    })

    it('should add children to the body node', (done) => {
        Document.fromPath(resolve('test/withStyles.html')).then((document) => {
            const head = document.head().get()
            const length = head.children.length

            document.head().appendChild(new Node({
                name: 'script',
                attribs: { src: '/scripts.js' }
            }))

            expect(head.children.length).to.equal(length + 1)
        }).then(done, done)
    })

    it('should add children to the body node', (done) => {
        Document.fromPath(resolve('test/withBody.html')).then((document) => {
            const body = document.body().get()
            const length = body.children.length

            document.body().appendChild(new Node({
                name: 'script',
                attribs: { src: '/scripts.js' }
            }))

            expect(body.children.length).to.equal(length + 1)
        }).then(done, done)
    })

    it('should return html', (done) => {
        Document.fromPath(resolve('test/withBody.html')).then((document) => {
            const string = document.toHtml()

            expect(string[0]).to.equal('<')
        }).then(done, done)
    })

    it('should find the room-overview tag', (done) => {

        Document.fromPath(resolve('test/withBody.html')).then((document) => {
            const roomOverview = document.find('room-overview')[0]

            expect(roomOverview.name()).to.equal('room-overview')
            expect(roomOverview.attribute('empty').value).to.equal('true')
        }).then(done, done)
    })
})