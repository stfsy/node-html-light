'use strict'

const Attribute = require('../../lib/attribute')
const expect = require('chai').expect

describe('Attribute', () => {

    it('should return an empty array', () => {
        const attribute = Attribute.of('content-type', 'application/json')
        expect(attribute.key).to.equal('content-type')
        expect(attribute.value).to.equal('application/json')
    })
})