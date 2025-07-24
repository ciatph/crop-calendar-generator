/**
 * Converts string "true" or "false" to boolean
 * @param {string} inputStr - input value ("true" or "false" only)
 * @returns {boolean} Boolean conversion of `inputStr`
 * @throws {Error} Throws an error if `inputStr` contains unexpected values
 */
const stringToBool = (inputStr) => {
  if (inputStr === 'true') return true
  if (['false', ''].includes(inputStr)) return false

  throw new Error('Cannot convert string to boolean')
}

/**
 * Get the nodejs cli input parameter values
 * @param {String[]} params - Array of cli input params
 * @returns {Object} Input params with user-input values
 */
const getargs = ({
  params = [],
  optional = []
}) => {
  const args = params.reduce((collection, param) => {
    const input = process.env[`npm_config_${param}`]

    if (input !== undefined) {
      collection[param] = ['true', 'false', ''].includes(input)
        ? stringToBool(input)
        : input
    }

    return { ...collection }
  }, {})

  params.forEach(param => {
    if (args[param] === undefined && !optional.includes(param)) {
      throw new Error(`Undefined args "${param}"`)
    }
  })

  return args
}

module.exports = getargs
