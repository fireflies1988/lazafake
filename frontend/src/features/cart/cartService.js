import axios from "axios";

const API_URL = "/api/cart";

// view cart
async function viewCartAsync(accessToken) {
  const response = await axios.get(API_URL + "/view", {
    headers: {
      Authorization: "Bearer " + accessToken,
    },
  });
  console.log("viewCartAsync", response);

  return response.data;
}

// view cart
async function addToCartAsync(productId, quantity, accessToken) {
  const response = await axios.post(
    `${API_URL}/add`,
    { quantity },
    {
      headers: {
        Authorization: "Bearer " + accessToken,
      },
      params: {
        productId,
      },
    }
  );
  console.log("addToCartAsync", response);

  return response.data;
}

// remove from cart
async function removeFromCartAsync(cartItemId, accessToken) {
  const response = await axios.delete(API_URL + `/remove`, {
    headers: {
      Authorization: "Bearer " + accessToken,
    },
    params: {
      cartItemId,
    },
  });
  console.log("addToCartAsync", response);

  return response.data;
}

// remove from cart
async function removeMultipleFromCartAsync(items, accessToken) {
  const response = await axios.delete(`${API_URL}/remove-multiple`, {
    headers: {
      Authorization: "Bearer " + accessToken,
    },
    data: {
      items,
    },
  });
  console.log("removeMultipleFromCartAsync", response);

  return response.data;
}

// change quantity from cart
async function changeQtyAsync(cartItemId, quantity, accessToken) {
  const response = await axios.patch(
    API_URL + `/changeQty`,
    {
      quantity,
    },
    {
      headers: {
        Authorization: "Bearer " + accessToken,
      },
      params: {
        cartItemId,
      },
    }
  );
  console.log("changeQtyAsync", response);

  return response.data;
}

// checkout from cart
async function checkoutAsync(cartItems, accessToken) {
  const response = await axios.post(API_URL + `/checkout`, cartItems, {
    headers: {
      Authorization: "Bearer " + accessToken,
    },
  });
  console.log("checkoutAsync", response);

  return response.data;
}

const cartService = {
  addToCartAsync,
  removeFromCartAsync,
  changeQtyAsync,
  viewCartAsync,
  checkoutAsync,
  removeMultipleFromCartAsync,
};

export default cartService;
