const fs = require('fs')
const csv = require('fast-csv')

/**
 * Write an array of Objects[] to a CSV file
 * @param {Object[]} objectData - Array of common objects whose fields equate to CSV rows
 * @param {String} filePath - Full file path where to write the CSV file including the CSV file name with .csv extension
 */
const csvWriter = (objectData, filePath) => {
  try {
    const csvOut = fs.createWriteStream(filePath, { encoding: 'utf8' })
    const csvStream = csv.format({ headers: true })
    csvOut.write('\uFEFF') // Write BOM for Excel to detect UTF-8

    csvStream.pipe(csvOut)

    objectData.forEach(object => {
      csvStream.write(object)
    })

    csvStream.end()
  } catch (err) {
    throw new Error(err.message)
  }
}

module.exports = {
  csvWriter
}
