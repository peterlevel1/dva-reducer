var assert = require("assert")
var dvaReducer = require("..")
var redux = require("redux")
var extend = require("extend")

var dispatch
var store

var mockCreateDva = function () {
  var defaultState = {}
  var reducers = {}
  var reducer = function (state, action) {
    if (reducers[action.type]) {
      var namespace = action.type.replace(/(.*)?\/.*$/, "$1")
      state[namespace] = reducers[action.type](state[namespace], action)
      return extend({}, state)
    }
    return state || defaultState
  }

  return {
    model: function (opts) {
      if (defaultState[namespace]) {
        throw new Error("namespace has already been created by dva.model(): " + namespace)
      }
      var namespace = opts.namespace
      for (var actionType in opts.reducers) {
        reducers[namespace + "/" + actionType] = opts.reducers[actionType]
      }
      defaultState[namespace] = opts.state
    },
    start: function () {
      store = redux.createStore(reducer)
      dispatch = store.dispatch
    }
  }
}

describe("dvaReducer:adapt with dva", function () {
  it("the caculator.num should be correct", function (done) {
    var dva = mockCreateDva()
    dva.model({
      namespace: "caculator",
      state: {
        num: 0
      },
      reducers: {
        "add": dvaReducer({
          props: "num",
          update: function (state, payload, value) {
            return value + payload
          }
        }),
        "minus": dvaReducer({
          props: "num",
          update: function (state, payload, value) {
            return value - payload
          }
        })
      }
    })

    dva.start()

    dispatch({
      type: "caculator/add",
      payload: 10
    })

    dispatch({
      type: "caculator/minus",
      payload: 3
    })

    var num = store.getState().caculator.num

    assert.equal(num, 7, "caculator.num: " + num)

    done()
  })
})
