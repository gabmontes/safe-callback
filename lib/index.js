function shield(fn, context) {
  return function(...args) {
    try {
      return fn.apply(context, args)
    } catch (err) {
      const callback = args.pop()
      callback(err)
    }
  }
}

module.exports = shield
