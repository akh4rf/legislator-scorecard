const fs = require("fs-extra")
const axios = require("axios")
const curlirize = require("axios-curlirize").default

// get some nice debugging output
// curlirize(axios)

require("dotenv").config()

const googleSheetIds = {
  2017: "15AgxGT87Qc02IqPV46Uc0u9Z_ChfAjZQaj3qS2VNF8g",
  2019: "17SfLTsqLaoBG8WE5vKHmBY_J6Iz1IFKThm_wAqsHZdg",
}

const requestSheet = async (id, sheet) => {
  try {
    const response = await axios.get(
      `https://sheets.googleapis.com/v4/spreadsheets/${id}/values/${sheet}?key=${
        process.env.GOOGLE_API_KEY
      }`
    )
    return response.data.values
  } catch (e) {
    console.error(e)
    return []
  }
}

const loadGoogleSheets = async year => {
  const id = googleSheetIds[year]
  const sheetTypes = [
    "Sponsored_Bills",
    "House_Bills",
    "Senate_Bills",
    "Sponsorship",
    "House_Votes",
    "Senate_Votes",
  ]
  const sheetRequests = sheetTypes.map(sheet => requestSheet(id, sheet))

  await Promise.all(sheetRequests).then(
    ([
      sponsoredBills,
      houseBills,
      senateBills,
      sponsorship,
      houseVotes,
      senateVotes,
    ]) => {
      fs.writeFileSync(
        `${__dirname}/tmp/${year}.json`,
        JSON.stringify({
          sponsoredBills,
          houseBills,
          senateBills,
          sponsorship,
          houseVotes,
          senateVotes,
        })
      )
      console.log(`wrote ${year} csv data to disk`)
    }
  )
}

module.exports = async () => {
  fs.removeSync(`${__dirname}/tmp`)
  fs.mkdirSync(`${__dirname}/tmp`)
  await Promise.all([loadGoogleSheets(2017), loadGoogleSheets(2019)])
}
