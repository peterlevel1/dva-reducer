var extend = require("extend")
// dev || prod
var env = "dev"
var pSlice = Array.prototype.slice
var regSplit = /\s+|\./

function isObject(obj) {
  return obj && typeof obj === "object"
}

function reportValueNotObject(props, prop, value) {
  console.log("[dvaReducer]: props contains not object value: ")
  console.log("[" + props.join(", ") + "]")
  console.log(prop)
  console.log(value)
}

function reportStateNotObject(state) {
  console.log("[dvaReducer]: state is not object")
  console.log(state)
}

function reportPropsTypeError(props) {
  console.log(props)
  throw new Error("[dvaReducer]: props is not array or string, or is array with nothing")
}

function copy(target) {
  var args = pSlice.call(arguments)
  var holder = Array.isArray(target) ? [] : {}
  args.unshift(holder)
  return extend.apply(null, args)
}

/**
 * @param {Object|Array} state
 * @param {Object} action prop payload must be provided, and should be an object or array
 */
function save(state, action) {
  return copy(state, (action || {}).payload)
}

/**
 * dvaReducer: a factory to make the dva reducer
 * @param {Object|Null} opts if no arg, the reducer would be an save handler
 *   @param {Function} update to update the payload
 *   @param {Array} props [required] the last one of the props is the target prop to be updated
 *   @param {*|Function} defaultValue when payload not provided, defaultValue would be the placeholder
 * @return {Function} reducer
 */
function dvaReducer(opts) {
  if (!isObject(opts)) {
    return save
  }

  var update = opts.update
  var props = opts.props || []
  var defaultValue = opts.defaultValue || null
  var defaultValueIsFn = defaultValue && typeof defaultValue === "function"

  if (props && typeof props === "string") {
    props = props.split(regSplit)
  }

  if (!Array.isArray(props) || !props.length) {
    reportPropsTypeError(props)
    return
  }

  if (update && typeof update !== "function") {
    update = null
  }

  /**
   * @param {Object|Array} state object is advised for the type of the state
   * @param {Object} action the action type must be resolved by the upper layer logic
   *   @param {Boolean} partial default value is true,
   *                            set partial false if ensure to override the prop value
   *                            when payload and the action are both object
   *   @param {*} payload the new value for the target prop(the last prop)
   * @return {Object} an object with required route line props updated
   */
  return function reducer(state, action) {
    if (!isObject(state)) {
      if (env === "dev") {
        reportStateNotObject(state)
      }
      return state
    }

    if (!action) {
      return state
    }

    var payload = action.payload
    var partial = action.partial
    var obj = copy(state)
    var cursor = obj
    var prop
    var value

    if (partial == null) {
      partial = true
    }

    for (var i = 0, ii = props.length, last = ii - 1; i < ii; i++) {
      prop = props[i]
      value = cursor[prop]
      if (i < last) {
        if (!isObject(value)) {
          if (env === "dev") {
            reportValueNotObject(props, prop, value)
          }
          return state
        }
        cursor = cursor[prop] = copy(value)
      } else {
        if (update) {
          payload = update(state, payload, value)
        }

        if (
          partial &&
          isObject(value) &&
          isObject(payload)
        ) {
          cursor[prop] = copy(value, payload)
        } else {
          cursor[prop] = payload == null
            ? defaultValueIsFn
              ? defaultValue()
              : defaultValue
            : payload
        }
      }
    }

    return obj
  }
}

dvaReducer.prod = function () {
  env = "prod"
}

module.exports = dvaReducer
