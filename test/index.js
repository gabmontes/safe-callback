const { expect } = require('chai')

const shield = require('../lib')

function testFn(value, shouldError, shouldThrow, callback) {
  if (shouldThrow) {
    throw new Error(value)
  }
  if (shouldError) {
    callback(new Error(value))
    return
  }
  callback(null, value)
}

const safeFn = shield(testFn)

describe('Safe async calls', function () {
  it('should call the callback if all is ok', function (done) {
    const testValue = 'test'
    safeFn(testValue, false, false, function (err, value) {
      expect(value).to.equals(testValue)
      done()
    })
  })

  it('should call the callback if there is an error', function (done) {
    const testError = 'some error'
    safeFn(testError, true, false, function (err) {
      expect(err).to.be.an('error')
      expect(err).to.have.property('message').to.equals(testError)
      done()
    })
  })

  it('should call the callback if the fn throws', function (done) {
    const testError = 'thrown error'
    safeFn(testError, false, true, function (err) {
      expect(err).to.be.an('error')
      expect(err).to.have.property('message').to.equals(testError)
      done()
    })
  })

  it('should apply function context', function (done) {
    const testObject = {
      value: 'some text',
      getValue: function (callback) {
        callback(null, this.value)
      }
    }
    const safeGetValue = shield(testObject.getValue, testObject)
    safeGetValue(function (err, value) {
      expect(err).to.not.exist
      expect(value).to.equals(testObject.value)
      done()
    })
  })

  it('should apply function context using bind()', function (done) {
    const testObject = {
      value: 'some text',
      getValue: function (callback) {
        callback(null, this.value)
      }
    }
    const safeGetValue = shield(testObject.getValue.bind(testObject))
    safeGetValue(function (err, value) {
      expect(err).to.not.exist
      expect(value).to.equals(testObject.value)
      done()
    })
  })
})
