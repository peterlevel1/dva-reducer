var assert = require("assert")
var dvaReducer = require("..")
var redux = require("redux")

describe("dvaReducer:adapt with redux", function () {
  it("the caculator.num should be correct", function (done) {
    var add = dvaReducer({
      props: "num",
      update: function(state, payload, value) {
        return value + payload
      }
    })

    var minus = dvaReducer({
      props: "num",
      update: function(state, payload, value) {
        return value - payload
      }
    })

    var reducerObj = {
      caculator: function (state, action) {
        switch(action.type) {
          case "caculator/add":
            return add(state, action)
          case "caculator/minus":
            return minus(state, action)
          default:
            return state == null ? {num: 0} : state
        }
      }
    }

    var reducer = redux.combineReducers(reducerObj)

    var store = redux.createStore(reducer)

    var i = 0
    store.subscribe(function () {
      var num = store.getState().caculator.num
      if (i === 0) {
        assert.equal(num, 10, "subscribe: caculator.num: " + num)
      } else if (i === 1) {
        assert.equal(num, 7, "subscribe: caculator.num: " + num)
      }
      i++
    })

    store.dispatch({
      type: "caculator/add",
      payload: 10
    })

    store.dispatch({
      type: "caculator/minus",
      payload: 3
    })

    var num = store.getState().caculator.num
    assert.equal(num, 7, "caculator.num: " + num)

    done()
  })
})
