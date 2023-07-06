require('dotenv').config()
const CroppingCalendarGenerator = require('../classes/generator')
const getargs = require('../lib/getargs')

const main = async () => {
  try {
    // CLI args input
    const input = getargs({
      params: ['region'],
      optional: ['region']
    })

    // Initialize class
    const generator = new CroppingCalendarGenerator({ useLocal: false })

    // Region name from input or .env file
    const regionName = input?.region ?? process.env.REGION_NAME

    // Download the latest remote Excel file from EXCEL_FILE_URL
    await generator.initRemote()

    // Log the region names
    const regionList = generator.regions.data.map(region => region.name)
    console.log('REGION NAMES')
    console.log(regionList)
    console.log('Looking for region: ', regionName)

    // List the municipalities grouped into provinces
    const provinces = generator.regions.data.find(province => province.name === regionName)?.provinces ?? []
    const municipalities = generator.file.listMunicipalities({ provinces })

    console.log('PROVINCES')
    console.log(provinces)

    console.log('MUNICIPALITIES')
    console.log(municipalities)
    process.exit(0)
  } catch (err) {
    console.log(`[EROR]: ${err.message}`)
    process.exit(1)
  }
}

main()
