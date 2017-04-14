var assert = require("assert")
var dvaReducer = require("..")

describe("dvaReducer:the returned function[reducer] tests", function () {
  it("reducer:action.payload: is an object", function (done) {
    var sth = "yes, heihei"

    var state = {
      is: {
        cc: {
          pretty: "?"
        }
      }
    }

    var action = {
      payload: {
        cc: {
          pretty: sth
        }
      }
    }

    var reducer = dvaReducer({
      props: "is"
    })

    var nextState = reducer(state, action)

    assert.notEqual(nextState.is, action.payload, "nextState.is should not equal to action.payload.is")

    assert.equal(nextState.is.cc.pretty, sth, "nextState.is.cc.pretty: " + nextState.is.cc.pretty)

    done()
  })

  it("reducer:action.partial: payload and the prop value are both object, but partial is false", function (done) {
    var sth = "yes, heihei"

    var state = {
      is: {
        cc: {
          pretty: "?"
        }
      }
    }

    var action = {
      partial: false,
      payload: {
        cc: {
          pretty: sth
        }
      }
    }

    var reducer = dvaReducer({
      props: "is"
    })

    var nextState = reducer(state, action)

    assert.equal(nextState.is, action.payload, "nextState.is should equal to action.payload")

    assert.equal(nextState.is.cc.pretty, sth, "nextState.is.cc.pretty: " + nextState.is.cc.pretty)

    done()
  })

  it("reducer: shallow extend, but update the given route target prop", function (done) {
    var obj = {x: 1}
    var state = {
      a: obj,
      b: {
        c: {
          d: 100
        }
      }
    }

    var action = {
      payload: 5
    }

    var reducer = dvaReducer({
      props: "b.c.d"
    })

    var nextState = reducer(state, action)

    assert.equal(state.a, nextState.a, "state.a and nextState.a should equal")
    assert.notEqual(state.b, nextState.b)
    assert.notEqual(state.b.c, nextState.b.c)
    assert.notEqual(state.b.c.d, nextState.b.c.d)

    done()
  })

  it("when payload and the target are both object, if ensuring to override it, set partial false, but I do not support changing the prop", function () {
    var sth = {
      lala: true
    }
    var state = {
      haha: {
        oo: true
      }
    }
    var action = {
      payload: sth,
      partial: false
    }
    var reducer = dvaReducer("haha")
    var nextState = reducer(state, action)
    assert.deepEqual(nextState.haha, sth, "nextState.haha: " + nextState.haha)

    // ===============================================================
    sth = {
      lala: true
    }
    state = {
      haha: {
        oo: true
      }
    }
    action = {
      payload: sth,
    }
    reducer = dvaReducer("haha")
    nextState = reducer(state, action)
    assert.notDeepEqual(nextState.haha, sth, "nextState.haha: " + nextState.haha)
    assert.deepEqual(nextState.haha, { lala: true, oo: true }, "nextState.haha: " + nextState.haha)
  })
})
