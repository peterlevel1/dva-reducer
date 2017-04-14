var extend = require("extend")
// dev || prod
var env = "dev"
var pSlice = Array.prototype.slice
var regSplit = /\s+|\./
var toString = Object.prototype.toString

function isObject(obj) {
  return obj && typeof obj === "object"
}

function isPlainObject(obj) {
  return obj && toString.call(obj) === '[object Object]'
}

function reportValueNotObject(props, prop, value) {
  console.warn("[dvaReducer]: props contains not object value: ")
  console.warn("[" + props.join(", ") + "]")
  console.warn(prop)
  console.warn(value)
}

function reportStateNotObject(state) {
  console.warn("[dvaReducer]: state is not object")
  console.warn(state)
}

function reportPropsTypeError(props) {
  console.warn(props)
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
  if (!action || action.payload === void 0) {
    return state
  }
  return copy(state, action.payload)
}

/**
 * dvaReducer: a factory to make the dva reducer
 * @param {Undefined|Object|String|Array} props [required]
 * if no arg, the reducer would be an save handler
 * if props is object, then, [defaultValue], [update], [props] would be provided
 * and the [props] is required
 * if props is string, it would be splitted into an array
 * if props is array, it would be used, the last one is the target prop to be updated
 * @param {*|Function} defaultValue when payload not provided, defaultValue would be the placeholder
 * @param {Function} update to update the payload
 * @return {Function} reducer
 */
function dvaReducer(props, defaultValue, update) {
  if (!arguments.length) {
    return save
  }

  if (arguments.length === 1 && isPlainObject(props)) {
    var opts = props
    update = opts.update
    props = opts.props
    defaultValue = opts.defaultValue
  }

  if (props && typeof props === "string") {
    props = props.split(regSplit)
  }

  if (!Array.isArray(props) || !props.length) {
    reportPropsTypeError(props)
    return
  }

  if (typeof update !== "function") {
    update = void 0
  }

  var defaultValueIsFn = defaultValue && typeof defaultValue === "function"

  /**
   * @param {Object|Array} state object is advised for the type of the state
   * @param {Object} action the action type must be resolved by the upper layer warnic
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

    if (partial === void 0) {
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

        // TODO no change, so state should not be updated
        // reducer is to update the state, we should lessen the operation of this kind
        if (value === payload) {
          return state
        }

        if (
          partial &&
          isObject(value) &&
          isObject(payload)
        ) {
          cursor[prop] = copy(value, payload)
        } else {
          cursor[prop] = payload === void 0
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
