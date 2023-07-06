const fs = require('fs')

const readFile = (filePath) => {
  try {
    return fs.readFileSync(filePath, 'utf-8')
  } catch (err) {
    throw new Error(err.message)
  }
}

const readJSON = (filePath) => {
  try {
    const file = readFile(filePath)
    return JSON.parse(file)
  } catch (err) {
    throw new Error(err.message)
  }
}

module.exports = {
  readFile,
  readJSON
}
