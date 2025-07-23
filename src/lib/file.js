const fs = require('fs')

/**
 * Reads and returns the contents of a file.
 * @param {String} filePath - Full directory file path to a target file name.
 * @returns {String} File contents
 * @throws {Error}
 */
const readFile = (filePath) => {
  try {
    return fs.readFileSync(filePath, 'utf-8')
  } catch (err) {
    throw new Error(err.message)
  }
}

/**
 * Reads and returns the contents of a file and returns it as a JSON object.
 * @param {String} filePath - Full directory file path to a target file name.
 * @returns {Object} JSON object
 * @throws {Error}
 */
const readJSON = (filePath) => {
  try {
    const file = readFile(filePath)
    return JSON.parse(file)
  } catch (err) {
    throw new Error(err.message)
  }
}

/**
 * Create a file at the given directory path.
 * @param {String} filePath - Full file path to a target existing (or not existing) file, complete with a file extension
 * @throws {Error}
 */
const createFile = (filePath) => {
  try {
    // Delete file if it exists
    if (fs.existsSync(filePath)) {
      fs.unlinkSync(filePath)
    }

    fs.openSync(filePath, 'w')
  } catch (err) {
    throw new Error(err.message)
  }
}

module.exports = {
  readFile,
  readJSON,
  createFile
}
