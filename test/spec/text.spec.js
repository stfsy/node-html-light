'use strict'

const Text = require('../../lib/text')

const htmlParser = require('htmlparser2')

const expect = require('chai').expect
const resolve = require('path').resolve

describe('Text', () => {

    let parsed = null

    beforeEach(() => {

        parsed = htmlParser.parseDOM('ABCDEFGH')[0]
    })

    it('should create a text element', () => {

        const textNode = new Text('ABCDEFGH').get()

        for(let key in parsed) {

            console.log(key, parsed[key])

            expect(textNode[key]).to.equal(parsed[key])
        } 
    })
})