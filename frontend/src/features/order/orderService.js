import axios from "axios";

const API_URL = "/api/orders";

// place order
async function placeOrderAsync(oderData, accessToken) {
  const response = await axios.post(API_URL, oderData, {
    headers: {
      Authorization: "Bearer " + accessToken,
    },
  });
  console.log("placeOrderAsync", response);

  return response.data;
}

const orderService = {
  placeOrderAsync,
};

export default orderService;
