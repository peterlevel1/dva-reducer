### dvaReducer

#### features
1. this is mainly used to be a helper for the dva's reducer
2. also can be treated as a fast copy tool without deep walking into the json tree
3. of course, redux reducer can also be applied with dvaReducer
4. support default value as the placeholder
5. call dvaReducer with no arg can be a useful method to cancel the ctrl+c|ctrl+v work

#### install package
```
npm install dva-reducer --save
```

#### tests
```
cd some dir/dva-reducer
npm install
npm run test
```

#### purpose
##### to help your dva model reducer codes to be more readable
```javascripts
// file: some dir/app.js
var dvaReducer = require("dva-reducer")
var dva = require("dva")

dva.model({
  namespace: "caculator",
  state: {
    num: {
      num1: {
        num2: {
          num3: {
            num4: 0
          }
        }
      }
    }
  },
  reducers: {
    // the traditional reducer to update a value:
    // if the nested relation is a little deep,
    // we see the result of code is horrible,
    // and many bugs shown here, to avoid that you must be careful about the pyramid codes,
    // or you would meet some unknown bug
    "add": function(state, action) {
      return {
        ...state,
        num: {
          ...state.num,
          num1: {
            ...state.num.num1,
            num2: {
              ...state.num.num1.num2,
              num3: {
                ...state.num.num1.num2.num3,
                num4: state.num.num1.num2.num3.num4 - action.payload
              }
            }
          }
        }
      }
    },
    // we see the graceful codes with dvaReducer here
    "minus": dvaReducer({
      props: "num.num1.num2.num3.num4",
      update: function (state, payload, value) {
        return value - payload
      }
    })
  }
})

dva.route(...)
dva.start(...)

module.exports = dva

// file: some component or some route
dispatch({
  type: "caculator/add",
  payload: 10
})

dispatch({
  type: "caculator/minus",
  payload: 3
})

require("some dir/test.js")

// some dir/test.js
var dva = require("some dir/app.js")
var assert = require("assert")

var num = dva._getState().caculator.num
assert.equal(num, 7, "caculator.num: " + num)
// true
```

#### dvaReducer
- dvaReducer: a factory to make the dva reducer
  - @param {Object|Null} opts if no arg, the reducer would be an save reducer,
    the reducer would receive(state, action),
    action.payload must be provided to override the state's some props directly,
    say:
      dispatch({type: "some namespace/save", payload: { num: 1 }}),
    and the state is: { num: 0 },
    so the state would be { num: 1 }

    - @param {Function} update to update the payload,
      the update take 3 arg: (state, payload, value),
      state: the state received by the reducer,
      payload: the action.payload, received by the reducer, so payload prop should exist on the action,
      value: the src value for the target prop

    - @param {Array|String} props the last one of the props is the target prop to be updated,
      "dva.is.awesome", "dva is awesome", ["dva", "is", "awesome"] would all be acceptable,
      so the target prop is awesome ready to be updated when reducer called by the dispatch method of the redux store

    - @param {*|Function} defaultValue when payload not provided, defaultValue would be the placeholder
      if defaultValue is function, it should return the value for the target prop,
      defaultValue is useful when you want a value to be a constant,
      say:
        hide: active: false(defaultValue),
        show: active: true(defaultValue)

  - @return {Function} reducer
  after the configurations, the reducer is just what we really want

#### the returned function: reducer
- reducer(state, action)
  - @param {Object|Array} state object is advised for the type of the state

  - @param {Object} action the action type must be resolved by the upper layer logic

    - @param {Boolean} partial default value is true,
      set partial false if ensure to override the prop value,
      when payload and the action are both object

    - @param {*} payload the new value for the target prop(the last prop)

  - @return {Object} an object with required route line props updated

#### call dvaReducer.prod() if online
this would close the logs if sth wrong when dvaReducer valid your arg or prop value,
so my advice is to see the test of dvaReducer first,
and read the param doc up there,
what's more, make some tests to keep everything in your control

### reducer and shallow extend
#### what the reducer return is an object with the given props route updated
```javascripts
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

// nextState.a is equal to state.a, as the "a" prop is not within b.c.d
// but nextState.b or nextState.b.c or nextState.b.c.d is not equal to the state's according value
```
