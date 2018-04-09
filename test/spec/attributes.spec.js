'use strict'

const Attributes = require('../../lib/attributes')
const expect = require('chai').expect

describe('Attributes', () => {

    it('should return an empty array', () => {
        const result = Attributes.of()
        expect(result.length).to.equal(0)
    })

    it('should return an array with 2 elements', () => {
        const result = Attributes.of({
            'content-type': 'application/json',
            'accept': 'everything'
        })

        expect(result.length).to.equal(2)
        expect(result[0].key).to.equal('content-type')
        expect(result[0].value).to.equal('application/json')  
        expect(result[1].key).to.equal('accept')
        expect(result[1].value).to.equal('everything')
    })
})