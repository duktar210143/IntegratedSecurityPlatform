const axios = require('axios');
const { JSDOM } = require('jsdom');
// const { fetchFromCache, saveToCache } = require('./cache.js');

async function FetchSingularDataOfAsset() {
  const liveTradingUrl = "https://www.sharesansar.com/live-trading";
 
  try {
    const responseLiveTrading = await axios.get(liveTradingUrl);
 
    if (!responseLiveTrading.data) {
      throw new Error(
        `Failed to fetch live trading data. Status: ${responseLiveTrading.status}`
      );
    }
 
    const domLiveTrading = new JSDOM(responseLiveTrading.data);
    const documentLiveTrading = domLiveTrading.window.document;
 
    const stockDataWithoutName = [];
 
    const rowsLiveTrading = documentLiveTrading.querySelectorAll(
      "#headFixed tbody tr"
    );
 
    rowsLiveTrading.forEach((row) => {
      const columns = row.querySelectorAll("td");
 
      const stockInfo = {
        symbol: columns[1].querySelector("a").textContent.trim(),
        ltp: parseFloat(
          columns[2].textContent.trim().replace(/,(?=\d{3})/g, "")
        ),
        pointchange: parseFloat(columns[3].textContent.trim()),
        percentchange: parseFloat(columns[4].textContent.trim()),
        open: parseFloat(
          columns[5].textContent.trim().replace(/,(?=\d{3})/g, "")
        ),
        high: parseFloat(
          columns[6].textContent.trim().replace(/,(?=\d{3})/g, "")
        ),
        low: parseFloat(
          columns[7].textContent.trim().replace(/,(?=\d{3})/g, "")
        ),
        volume: parseFloat(
          columns[8].textContent.trim().replace(/,(?=\d{3})/g, "")
        ),
        previousclose: parseFloat(
          columns[9].textContent.trim().replace(/,(?=\d{3})/g, "")
        ),
      };
 
      stockDataWithoutName.push(stockInfo);
    });
    console.log(stockDataWithoutName)
 
    // return stockDataWithoutName;
  } catch (error) {
    console.error(error);
    throw error;
  }
}

FetchSingularDataOfAsset();


module.exports = { FetchSingularDataOfAsset };
