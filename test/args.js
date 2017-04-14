var assert = require("assert")
var dvaReducer = require("..")

describe("dvaReducer:args tests", function () {

  it("props is string, payload is string, and target prop is string", function () {
    var sth = "new value for haha"
    var state = {
      haha: "value is here"
    }
    var action = {
      payload: sth
    }
    var reducer = dvaReducer("haha")
    var nextState = reducer(state, action)

    assert.equal(nextState.haha, sth, "nextState.haha: " + nextState.haha)
  })

  it("props is string, payload is object, and target prop is object", function () {
    var sth = { val: "value is new" }
    var state = {
      haha: { val: "value is here" }
    }
    var action = {
      payload: sth
    }
    var reducer = dvaReducer("haha")
    var nextState = reducer(state, action)

    assert.deepEqual(nextState.haha, sth, "nextState.haha: " + nextState.haha)
  })

  it("props is string, payload is string, and target prop is object", function () {
    var sth = "value is new"
    var state = {
      haha: { val: "value is here" }
    }
    var action = {
      payload: sth,
    }
    var reducer = dvaReducer("haha")
    var nextState = reducer(state, action)

    assert.deepEqual(nextState.haha, sth, "nextState.haha: " + nextState.haha)
  })

  it("props not object", function () {
    var sth = "value is new"
    var state = {
      haha: { val: "value is here" }
    }
    var action = {}
    var reducer = dvaReducer("haha", sth)
    var nextState = reducer(state, action)
    assert.deepEqual(nextState.haha, sth, "nextState.haha: " + nextState.haha)
  })

  it("payload is boolean", function () {
    var sth = true
    var state = {
      haha: false
    }
    var action = {
      payload: sth
    }
    var reducer = dvaReducer("haha")
    var nextState = reducer(state, action)
    assert.equal(nextState.haha, sth, "nextState.haha: " + nextState.haha)
  })

  it("default value is boolean", function () {
    var sth = true
    var state = {
      haha: sth
    }
    var action = {}
    var reducer = dvaReducer("haha", sth)
    var nextState = reducer(state, action)
    assert.deepEqual(nextState.haha, sth, "nextState.haha: " + nextState.haha)
  })

  it("default value is function", function () {
    var sth = true
    var state = {
      haha: sth
    }
    var action = {}
    var reducer = dvaReducer("haha", function () {
      return sth
    })
    var nextState = reducer(state, action)
    assert.equal(nextState.haha, sth, "nextState.haha: " + nextState.haha)
  })

  it("props, default value, update are provided", function () {
    var sth = true
    var state = {
      haha: sth
    }
    var action = {}
    var reducer = dvaReducer("haha", sth, function (state, payload, value) {
      return payload
    })
    var nextState = reducer(state, action)
    assert.equal(nextState.haha, sth, "nextState.haha: " + nextState.haha)
  })

  it("payload is same as value, state should not update", function () {
    var sth = true
    var state = {
      haha: sth
    }
    var action = {
      payload: sth
    }
    var reducer = dvaReducer("haha")
    var nextState = reducer(state, action)
    assert.deepEqual(nextState, state, "state should not update")
  })
})
