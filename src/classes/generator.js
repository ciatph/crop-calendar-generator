require('dotenv').config()
const path = require('path')
const { ExcelFile } = require('ph-municipalities')
const { readJSON } = require('../lib/file')

class CroppingCalendarGenerator {
  /** ExcelFile instance containing the local (old) Excel file data or new remote data */
  #file = null

  /** JSON data containing the static regional provinces list */
  #provinceList = null

  /**
   * CroppingCalendarGenerator class constructor
   * @typedef {Object} parameter
   * @param {Bool} useLocal - Flag to use ph-municipalities's local (old) Excel file as data source.
   *  - Defaults to "false".
   *  - Setting to "true" will download the remote Exel file from EXCEL_FILE_URL after calling this.initRemote()
   */
  constructor ({ useLocal = true }) {
    // Load the static regional province list
    const provinceListPath = path.join(__dirname, '..', '..', 'node_modules', 'ph-municipalities', 'data', 'regions.json')
    this.#provinceList = readJSON(provinceListPath)

    // Load the municipalities list from local or remote source
    if (useLocal) {
      const localFile = path.join(__dirname, '..', '..', 'node_modules', 'ph-municipalities', 'data', 'day1.xlsx')

      this.#file = new ExcelFile({ pathToFile: localFile })
      this.#file.init()
    } else {
      this.#file = new ExcelFile({
        pathToFile: path.join(__dirname, '..', '..', 'tempdata.xlsx'),
        url: process.env.EXCEL_FILE_URL
      })
    }
  }

  /**
   * Return the private ExcelFile instance
   */
  get file () {
    return this.#file
  }

  get provinces () {
    return this.#provinceList
  }

  /**
   * Download the remote Exel file from EXCEL_FILE_URL. Data is stored in this.#file after download.
   */
  async initRemote () {
    await this.#file.init()
  }
}

module.exports = CroppingCalendarGenerator
