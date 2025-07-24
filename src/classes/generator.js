require('dotenv').config()
const path = require('path')

const { ExcelFile } = require('ph-municipalities')
const { csvWriter } = require('../lib/csv')
const { CODES } = require('../lib/constants')

/**
 * Class that generates random cropping calendar.
 * - `extends` the **ph-municipalities** `ExcelFile` class to use a custom `regions.json` settings file
 */
class CroppingCalendarGenerator extends ExcelFile {
  #crops = ['Rice']

  /**
   * CroppingCalendarGenerator class constructor
   * @typedef {object} params - `ExcelFile` class constructor parameters
   * @param {string} params.pathToFile - Path to a an Excel file in disk, which may not yet exist.
   * @param {object} [params.settings] - (Optional) Customized ph-municipalities `regions.json` config
   *  to match the latest PAGASA **region to provinces grouping** (from the PAGASA Rainfall Analysis table) to
   *  **municipalities** (from the 10-day weather forecast Excel mapping
   * @param {string} [params.url] (Optional) Remote Excel file download URL.
   *  If not provided, the script will use the ph-municipalities default Excel file.
   * @param {boolean} [params.fastload] (Optional) Flag to load the local Excel data from the class constructor.
   * @param {string[]} [crops] - (Optional) List of available crops
   */
  constructor (params, crops = []) {
    super(params)

    // Load the crops
    for (let i = 0; i < crops.length; i += 1) {
      if (!this.#crops.includes(crops[i])) {
        this.#crops.push(crops[i])
      }
    }
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
    const provinces = this.listProvinces(regionName)
    const municipalities = this.listMunicipalities({ provinces })
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
