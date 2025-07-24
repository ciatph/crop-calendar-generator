require('dotenv').config()
const path = require('path')
const { ExcelFile } = require('ph-municipalities')
const { readJSON } = require('../lib/file')
const { csvWriter } = require('../lib/csv')
const { CODES } = require('../lib/constants')

class CroppingCalendarGenerator {
  /** ExcelFile instance containing the local (old) Excel file data or new remote data */
  #file = null

  /** JSON data containing the static regional provinces list */
  #regionList = null

  #crops = ['Rice']

  /**
   * CroppingCalendarGenerator class constructor
   * @typedef {object} parameter - Input parameter object
   * @param {boolean} [parameter.useLocal] - (Optional) Flag to use ph-municipalities's local (old) Excel file as data source.
   *  - Defaults to "false".
   *  - Setting to "true" will download the remote Exel file from EXCEL_FILE_URL after calling this.initRemote()
   * @param {string[]} [parameter.crops] - (Optional) List of available crops
   * @param {object} customRegionsConfig - (Optional) Customized ph-municipalities `regions.json` config to match the latest PAGASA seasonal provinces (from the PAGASA Rainfall Analysis table) to municipalities (from the 10-day weather forecast Excel) mapping
   */
  constructor ({ useLocal = true, crops = [] }, customRegionsConfig = null) {
    if (customRegionsConfig) {
      // Use an updated regions.json regional province list
      console.log('[LOG]: Using custom regions.json config')
      this.#regionList = customRegionsConfig
    } else {
      // Load the default regional province list
      console.log('[LOG]: Using the default regions.json config (possibly outdated)')
      const regionListPath = path.join(__dirname, '..', '..', 'node_modules', 'ph-municipalities', 'config', 'regions.json')
      this.#regionList = readJSON(regionListPath)
    }

    // Load the crops
    for (let i = 0; i < crops.length; i += 1) {
      if (!this.#crops.includes(crops[i])) {
        this.#crops.push(crops[i])
      }
    }

    // Load the municipalities list from local or remote source
    if (useLocal) {
      const localFile = path.join(__dirname, '..', '..', 'node_modules', 'ph-municipalities', 'data', 'day1.xlsx')

      this.#file = new ExcelFile({
        pathToFile: localFile,
        settings: customRegionsConfig
      })
    } else {
      this.#file = new ExcelFile({
        pathToFile: path.join(__dirname, '..', '..', 'tempdata.xlsx'),
        url: process.env.EXCEL_FILE_URL,
        settings: customRegionsConfig
      })
    }
  }

  /**
   * Returns the private ExcelFile instance
   */
  get file () {
    return this.#file
  }

  /**
   * Returns the static regions/provinces list
   */
  get regions () {
    return this.#regionList
  }

  /**
   * Download the remote Exel file from EXCEL_FILE_URL. Data is stored in this.#file after download.
   */
  async initRemote () {
    await this.#file.init()
  }

  /**
   * Get a random number within a range of numbers (inclusive)
   * @param {number} minimun - Minimum number in a range of numbers
   * @param {number} maximum - Maximum number in a range of numbers
   * @returns {number}
   */
  randomNumber (minimun, maximum) {
    const min = Math.ceil(minimun)
    const max = Math.floor(maximum)
    return Math.floor(Math.random() * (max - min + 1) + min)
  }

  /**
   * Returns a random cropping calendar stage code with a "_1" or "_2" suffix.
   * @returns
   */
  getRandomCropStages () {
    const suffixNum = this.randomNumber(1, 2)

    if (suffixNum > 2) {
      throw new Error('Only 1 or 2 allowed as suffix.')
    }

    const sIndex = this.randomNumber(0, CODES.length)
    const stage = (sIndex >= CODES.length)
      ? ''
      : `${CODES[sIndex]}_${suffixNum}`

    return stage
  }

  /**
   * Returns the cropping calendar of a province containing random crop stages per month, per municipality.
   * @param {string} regionName - Region namme
   * @param {number} [numCropSeasons] - (Optional) Number of cropping seasons. Defaults to `1`.
   */
  generateRandomCalendar (regionName, numCropSeasons = 1) {
    const provinces = this.#regionList.data.find(province => province.name === regionName)?.provinces ?? []
    const municipalities = this.#file.listMunicipalities({ provinces })
    let objects = []

    const monthsInYear = 12

    for (const crop of this.#crops) {
      for (const prov of provinces) {
        const muniList = municipalities[prov]

        if (!muniList) continue

        for (const muni of muniList) {
          for (let season = 0; season < numCropSeasons; season++) {
            const row = {
              prov,
              muni,
              crop,
            }

            for (let month = 1; month <= monthsInYear; month++) {
              const monthNum = String(month).padStart(2, '0')
              row[`${monthNum}_15_CAL`] = this.getRandomCropStages()
              row[`${monthNum}_30_CAL`] = this.getRandomCropStages()
            }

            objects.push(row)
          }
        }
      }
    }


    // CSV file
    const csvFileName = `cropping_calendar_random_${regionName.toLowerCase()}_${new Date().getTime()}.csv`
    const csvFilePath = path.join(__dirname, '..', '..', csvFileName.replace(/ /g, '_'))
    csvWriter(objects, csvFilePath)

    console.log(`Successfully created ${csvFilePath}`)
  }
}

module.exports = CroppingCalendarGenerator
