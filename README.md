## crop-calendar-generator

Generates random cropping calendar data for the municipalities of a selected region, using a PAGASA 10-day Weather Forecast Excel file as data source.

## Requirements
The following dependecies are used for this project. Feel free to experiment using other dependencies and versions.

1. Windows 10 64-bit OS
2. nvm version 1.1.9 (for Windows)
3. NodeJS LTS v22.14.0 installed using nvm
   - node v22.14.0
   - npm v10.9.2

## Installation

1. Clone this repository.<br>
`https://github.com/ciatph/crop-calendar-generator.git`

2. Install dependencies.<br>
`npm install`

3. Create a `.env` file from the `.env.example` file. Replace the environment variable values as needed.

   | Variable Name | Description |
   | --- | --- |
   | EXCEL_FILE_URL | (Optional) Remote excel file's download URL.<br>If provided, the excel file will be downloaded and saved on the specified `pathToFile` local filesystem location during the `ExcelFile` class initialization.<br>Read on [Usage](#usage) for more information. |
   | PROVINCES | Comma-delimited province names |
   | REGION_NAME | Region name (`"abbrev"`) in the /data/regions.json |
   | SHEETJS_COLUMN | Column name read by [sheetjs](https://sheetjs.com/) in an excel file.<br>This column contains the municipality and province names following the string pattern<br>`"municipalityName (provinceName)"`<br>Default value is `__EMPTY`|
   | SORT_ALPHABETICAL | Arranges the municipality names in alphabetical order.<br>Default value is `1`. Set to `0` to use the ordering as read from the Excel file. |
   | SPECIAL_CHARACTERS | Key-value pairs of special characters or garbled text and their normalized text conversions, delimited by the `":"` character.<br>Multiple key-value pairs are delimited by the `","` character.<br>If a special character key's value is a an empty string, write it as i.e.,: `"some-garbled-text:"` |


## Usage

### 🟩 Using Node
   - Run the Available Scripts using Node directly in the host machine.

### 🐳 Alternate Usage Using Docker
   - Build the Docker image and run the container.
      ```sh
      docker compose build
      docker compose up -d
      ```
   - Add breakpoints in VS Code
   - Run the `generate` script for Docker.
      ```sh
      docker exec -it ciatph-cc-generator npm run docker:generate
      ```
   - Press `Ctrl + Shift + D` to display the selection list of VS Code debug configurations.
      - Select **Attach to Docker**
   - To stop the container:
      ```sh
      docker compose down
      ```

## Available Scripts

### `npm run generate`

This script lists the static region names for selction, and the provinces and municipalities of a selected province to the terminal.<br>
It also generates a random cropping calendar for all municipalities of the selected region into a CSV file.

### `npm run docker:generate`

Runs the `npm run generate` script with the `--inspect` flag, enabling it for debugging with breakpoints in VS Code when run inside a container.

#### Example Usage
`npm run generate --region='Region V'`<br>
`npm run generate --region=Bangsamoro`<br>
`npm run generate --region='Region V' --usedefault=true`

### Flags

- `--region`
  - Region name. Enclose region names with more than (1) one word between single quotes.
- `--usedefault`
  - Flag to use [ph-municipalities's](https://www.npmjs.com/package/ph-municipalities) local (old) Excel file as data source if `--usedefault=true`.
  - Downloads the latest PAGASA 10-day weather forecast Excel file (day1.xlsx) by default if ommitted.

### `npm run lint`

Lint the source codes for errors.

### `npm run lint:fix`

Lint and fix recoverable lint errors.

@ciatph<br>
20230706
