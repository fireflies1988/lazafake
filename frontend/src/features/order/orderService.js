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

// get all orders
async function getAllOrdersAsync(accessToken) {
  const response = await axios.get(API_URL, {
    headers: {
      Authorization: "Bearer " + accessToken,
    },
  });
  console.log("getAllOrdersAsync", response);

  return response.data;
}

// update order status
async function updateOrderStatusAsync(orderId, status, shipper, accessToken) {
  const response = await axios.patch(
    `${API_URL}/${orderId}`,
    {
      status,
      shipper,
    },
    {
      headers: {
        Authorization: "Bearer " + accessToken,
      },
    }
  );
  console.log("updateOrderStatusAsync", response);

  return response.data;
}

const orderService = {
  placeOrderAsync,
  getAllOrdersAsync,
  updateOrderStatusAsync,
};

export default orderService;
