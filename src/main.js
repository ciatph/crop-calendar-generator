require('dotenv').config()
const CroppingCalendarGenerator = require('./classes/generator')

const main = async () => {
  try {
    // Initialize class
    const generator = new CroppingCalendarGenerator({ useLocal: false })

    // Download the latest remote Excel file from EXCEL_FILE_URL
    await generator.initRemote()

    // List the municipalities
    const municipalities = generator.file.listMunicipalities({
      provinces: generator.provinces.data.find(province => province.abbrev === process.env.REGION_NAME)?.provinces ?? []
    })

    console.log(municipalities)

    process.exit(0)
  } catch (err) {
    console.log(`[EROR]: ${err.message}`)
    process.exit(1)
  }
}

main()
