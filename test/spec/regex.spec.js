'use strict'

const Node = require('../../lib/node')
const Nodes = require('../../lib/nodes')

const htmlParser = require('htmlparser2')
const expect = require('chai').expect

describe('Regex', () => {

    const strings = ['']
    strings.push('\n      ')
    strings.push('\n')
    strings.push('       \n')
    strings.push('       \n         ')
    strings.push('\r\n')
    strings.push('\r\n        ')
    strings.push('       \r\n')
    strings.push('      \r\n        ')

    const regex = /^[\s\\n\\r]*$/

    strings.forEach((string, index) => {
        it('should match the string at index ' + index, () => {
            const matched = regex.test(string)
            expect(matched).to.equal(true)
        })
    })

    it('should not match a string with any other characters', () => {
        const matched = regex.test(' ABC ')
        expect(matched).to.equal(false)
    })

    it('should not match a string with any other characters', () => {
        const matched = regex.test(' {{ ABC  }} \r\n')
        expect(matched).to.equal(false)
    })
})