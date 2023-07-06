## crop-calendar-generator

Generates random cropping calendar data for the municipalities of a selected region, using a PAGASA 10-day Weather Forecast Excel file as data source.

## Requirements
The following dependecies are used for this project. Feel free to experiment using other dependencies and versions.

1. Windows 10 64-bit OS
2. nvm version 1.1.9 (for Windows)
3. NodeJS LTS v18.14.2 installed using nvm
   - node v18.14.2
   - npm v8.5.0

## Installation

1. Clone this repository.<br>
`https://github.com/ciatph/crop-calendar-generator.git`

2. Install dependencies.<br>
`npm install`

3. Create a `.env` file from the `.env.example` file. Replace the environment variable values as needed.

   | Variable Name     | Description                                                                                                                                                                                                                                                    |
   | ----------------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
   | EXCEL_FILE_URL    | (Optional) Remote excel file's download URL.<br>If provided, the excel file will be downloaded and saved on the specified `pathToFile` local filesystem location during the `ExcelFile` class initialization.<br>Read on [Usage](#usage) for more information. |
   | SHEETJS_COLUMN    | Column name read by [sheetjs](https://sheetjs.com/) in an excel file.<br>This column contains the municipality and province names following the string pattern<br>`"municipalityName (provinceName)"`<br>Default value is `__EMPTY`                            |
   | SORT_ALPHABETICAL | Arranges the municipality names in alphabetical order.<br>Default value is `1`. Set to `0` to use the ordering as read from the Excel file.                                                                                                                    |
   | PROVINCES         | Comma-delimited province names                                                                                                                                                                                                                                 |
   | REGION_NAME       | Region name (`"abbrev"` in the /data/regions.json file)                                                                                                                                                                                                        |

## Available Scripts

### `npm run generate`

Lists the static region names for selction, and the provinces and municipalities of a selected province to the terminal.<br>

#### Example Usage
`npm run generate --region='Region V'`<br>
`npm run generate --region=Bangsamoro`<br>
`npm run generate --region='Region V' --usedefault=true`

### Flags

- `--region`
  - Region name. Enclose region names with more than (1) one word between single quotes.
- `--usedefault`
  - Flag to use [ph-municipalities's](https://www.npmjs.com/package/ph-municipalities) local (old) Excel file as data source if `--usedefault=true`.
  - Downloads the latest PAGASA 10-day weather forecast Excel file (day1.xlsx) if ommitted.

### `npm run lint`

Lint the source codes for errors.

### `npm run lint:fix`

Lint and fix recoverable lint errors.

@ciatph<br>
20230706
