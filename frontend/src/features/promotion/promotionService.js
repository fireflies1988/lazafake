import axios from "axios";

const API_URL = "/api/promotions";

// add promotion
async function addPromotionAsync(
  { name, note, to, from, products },
  accessToken
) {
  const response = await axios.post(
    API_URL,
    {
      name,
      note,
      to,
      from,
      products,
    },
    {
      headers: {
        Authorization: "Bearer " + accessToken,
      },
    }
  );
  console.log("addPromotionAsync", response);

  return response.data;
}

// edit promotion
async function editPromotionAsync(
  { promotionId, name, note, to, from, products },
  accessToken
) {
  const response = await axios.put(
    `${API_URL}/${promotionId}`,
    {
      name,
      note,
      to,
      from,
      products,
    },
    {
      headers: {
        Authorization: "Bearer " + accessToken,
      },
    }
  );
  console.log("editPromotionAsync", response);

  return response.data;
}

// get promotions
async function getPromotionsAsync(params, accessToken) {
  const response = await axios.get(API_URL, {
    headers: {
      Authorization: "Bearer " + accessToken,
    },
    params: params,
  });
  console.log("getPromotionsAsync", response);

  return response.data;
}

// delete promotion
async function deletePromotionAsync(promotionId, accessToken) {
  const response = await axios.delete(`${API_URL}/${promotionId}`, {
    headers: {
      Authorization: "Bearer " + accessToken,
    },
  });
  console.log("deletePromotionAsync", response);

  return response.data;
}

const promotionService = {
  addPromotionAsync,
  getPromotionsAsync,
  deletePromotionAsync,
  editPromotionAsync,
};

export default promotionService;
