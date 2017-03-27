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

        const textNode = Text.of('ABCDEFGH').get()

        for(let key in parsed) {

            expect(textNode[key]).to.equal(parsed[key])
        } 
    })
})