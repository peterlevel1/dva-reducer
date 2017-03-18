var assert = require("assert")
var dvaReducer = require("..")

describe("dvaReducer:opts tests", function () {
  it("opts:no value provided", function (done) {
    var sth = "new value for haha"

    var state = {
      haha: "value is here"
    }

    var action = {
      payload: {
        haha: sth
      }
    }

    var reducer = dvaReducer()

    var nextState = reducer(state, action)

    assert.equal(nextState.haha, sth, "nextState.haha: " + nextState.haha)
    done()
  })

  it("opts:defaultValue", function (done) {
    var sth = "sorrycc, I am cc, so we happen to have the same name, haha"

    var state = {
      hello: "world"
    }

    var action = {}

    var reducer = dvaReducer({
      props: "hello",
      defaultValue: sth
    })

    var nextState = reducer(state, action)

    assert.equal(nextState.hello, sth, "nextState.hello: " + nextState.hello)
    done()
  })

  it("opts:update", function (done) {
    var sth = "oh, dva is great, and I love it"

    var state = {
      hello: "world"
    }

    var action = {}

    var reducer = dvaReducer({
      props: "hello",
      update: function() {
        return sth
      }
    })

    var nextState = reducer(state, action)

    assert.equal(nextState.hello, sth, "nextState.hello: " + nextState.hello)
    done()
  })

  it("opts:props is string", function (done) {
    var sth = "oo"

    var state = {
      hello: {
        dva: {
          haha: sth
        }
      }
    }

    var action = {}

    var reducer = dvaReducer({
      // "hello dva haha": is also ok here !
      props: "hello.dva.haha",
      defaultValue: sth
    })

    var nextState = reducer(state, action)

    assert.equal(nextState.hello.dva.haha, sth, "nextState.hello.dva.haha: " + nextState.hello.dva.haha)
    done()
  })

  it("opts:props is array", function (done) {
    var sth = "oo"

    var state = {
      hello: {
        dva: {
          haha: sth
        }
      }
    }

    var action = {}

    var reducer = dvaReducer({
      props: ["hello", "dva", "haha"],
      defaultValue: sth
    })

    var nextState = reducer(state, action)

    assert.equal(nextState.hello.dva.haha, sth, "nextState.hello.dva.haha: " + nextState.hello.dva.haha)
    done()
  })

})
