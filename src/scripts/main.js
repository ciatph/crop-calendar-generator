require('dotenv').config()
const CroppingCalendarGenerator = require('../classes/generator')
const getargs = require('../lib/getargs')

const main = async () => {
  try {
    // CLI args input
    const input = getargs({
      params: ['region', 'usedefault'],
      optional: ['region', 'usedefault']
    })

    // Initialize class
    const useDefaultExcel = input?.usedefault ?? false
    const generator = new CroppingCalendarGenerator({ useLocal: useDefaultExcel })

    // Region name from input or .env file
    const regionName = input?.region ?? process.env.REGION_NAME

    // Download the latest remote Excel file from EXCEL_FILE_URL
    await generator.initRemote()

    // Log the region names
    const regionList = generator.regions.data.map(region => region.name)
    console.log('\nREGION NAMES')
    console.log(regionList)
    console.log('\nLooking for region: ', regionName)

    // List the municipalities grouped into provinces
    const provinces = generator.regions.data.find(province => province.name === regionName)?.provinces ?? []

    console.log('\nMUNICIPALITIES')
    const municipalities = generator.file.listMunicipalities({ provinces })
    console.log(municipalities)

    console.log('\nPROVINCES')
    console.log(provinces)

    // Generate random cropping calendar data for each municipality
    console.log(`\nGenerating a random cropping calendar for the ${regionName} region...`)
    generator.generateRandomCalendar(regionName)
  } catch (err) {
    console.log(`[EROR]: ${err.message}`)
    process.exit(1)
  }
}

main()
