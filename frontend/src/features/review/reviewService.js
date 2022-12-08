import axios from "axios";

const API_URL = "/api/reviews";

// write a review
async function addReviewAsync(
  { orderId, productId, rating, comment },
  accessToken
) {
  const response = await axios.post(
    API_URL,
    { orderId, productId, rating, comment },
    {
      headers: {
        Authorization: "Bearer " + accessToken,
      },
    }
  );
  console.log("addReviewAsync", response);

  return response.data;
}

// edit review
async function editReviewAsync({ reviewId, rating, comment }, accessToken) {
  const response = await axios.patch(
    `${API_URL}/${reviewId}`,
    { rating, comment },
    {
      headers: {
        Authorization: "Bearer " + accessToken,
      },
    }
  );
  console.log("editReviewAsync", response);

  return response.data;
}

// get reviews
async function getReviewsAsync(params) {
  const response = await axios.get(API_URL, {
    params,
  });
  console.log("getReviewsAsync", response);

  return response.data;
}

const reviewService = {
  addReviewAsync,
  editReviewAsync,
  getReviewsAsync,
};

export default reviewService;
