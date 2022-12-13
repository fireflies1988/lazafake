import axios from "axios";

const API_URL = "/api/price-changes";

// get price history
async function getPriceHistoryAsync(accessToken) {
  const response = await axios.get(`${API_URL}`, {
    headers: {
      Authorization: "Bearer " + accessToken,
    },
  });
  console.log("getPriceHistoryAsync", response);

  return response.data;
}

const priceHistoryService = {
  getPriceHistoryAsync,
};

export default priceHistoryService;
