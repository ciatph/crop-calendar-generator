require('dotenv').config()
const path = require('path')
const CroppingCalendarGenerator = require('../classes/generator')

const getargs = require('../lib/getargs')
const { readJSON } = require('../lib/file')

const newRegionsConfig = require('./regions_20250724.json')

/**
 * Returns configuration settings from user CLI input
 * @param {object} cliInput - User input from CLI command
 * @returns {object} settings - Settings object from CLI input
 * - `settings.useLocal` - Flag to use ph-municipalities's local (old) Excel file as data source.
 *    If `true`, will download the remote Exel file from EXCEL_FILE_URL after calling `this.init()`
 * - `settings.useDefaultConfig` - Flag to use the new regions.json config file (loaded from require())
 * - `settings.filePath` if `useLocal=true`, returns the path to the default local Excel file for input.
 *  If `useLocal=false` returns a file path to contain the remote Excel file download
 * - `settings.regionsConfig` - default or custom regions and provinces config settings
 */
const processInput = (cliInput) => {
  const useLocal = cliInput?.usedefaultexcel ?? false
  const useDefaultConfig = cliInput?.usedefaultconfig ?? false

  const dataSource = useLocal ? 'LOCAL' : 'REMOTE'
  const customRegions = useDefaultConfig ? 'DEFAULT' : 'CUSTOM'

  console.log(`[LOG]: Loading Excel file from ${dataSource} source`)
  console.log(`[LOG]: Using ${customRegions} regions/provinces settings`)

  // Load the municipalities list from local or download from remote Excel source
  const filePath = useLocal
    ? path.join(__dirname, '..', '..', 'node_modules', 'ph-municipalities', 'data', 'day1.xlsx')
    : path.join(__dirname, '..', '..', 'tempDowloadExcel.xlsx')

  // Use the default or new regions config file
  const regionsConfig = useDefaultConfig
    ? readJSON(path.join(__dirname, '..', '..', 'node_modules', 'ph-municipalities', 'config', 'regions.json'))
    : newRegionsConfig

  return {
    useLocal,
    useDefaultConfig,
    filePath,
    regionsConfig
  }
}

/** Main program start */
const main = async () => {
  try {
    // CLI args input
    const input = getargs({
      params: ['region', 'seasons', 'usedefaultexcel', 'usedefaultconfig'],
      optional: ['region', 'seasons', 'usedefaultexcel', 'usedefaultconfig']
    })

    const { useLocal, filePath, regionsConfig } = processInput(input)

    // Initialize class (extending the `Excelfile` class)
    const generator = new CroppingCalendarGenerator({
      pathToFile: filePath,
      settings: regionsConfig,
      ...(!useLocal && ({ url: process.env.EXCEL_FILE_URL })),
      ...(useLocal && ({ fastload: true }))  // Load the contents of the default local Excel file
    })

    if (!useLocal) {
      // Download the latest remote Excel file from EXCEL_FILE_URL.
      // Stores data in generator.file after download.
      await generator.init()
    }

    // Region name from input or .env file
    const regionName = input?.region ?? process.env.REGION_NAME
    const numSeasons = input?.seasons ? +input.seasons : 1

    // Log the region names
    const regionList = generator.listRegions()
    console.log('\nREGION NAMES')
    console.log(regionList)
    console.log('\nLooking for region: ', regionName)

    // List the municipalities grouped into provinces
    const provinces = generator.listProvinces(regionName) ?? []

    console.log('\nMUNICIPALITIES')
    const municipalities = generator.listMunicipalities({ provinces })
    console.log(municipalities)

    console.log('\nPROVINCES')
    console.log(provinces)

    // Generate random cropping calendar data for each municipality
    console.log(`\nGenerating a random cropping calendar for the ${regionName} region...`)
    generator.generateRandomCalendar(regionName, numSeasons)
  } catch (err) {
    console.log(`[EROR]: ${err.message}`)
    process.exit(1)
  }
}

const TIMEOUT_MS = process.env.IS_DOCKER ? 5000 : 0
setTimeout(() => main(), TIMEOUT_MS)
