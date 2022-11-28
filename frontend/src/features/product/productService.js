import axios from "axios";

const API_URL = "/api/products";

// add product
async function addProductAsync(formData, accessToken) {
  const response = await axios.post(API_URL, formData, {
    headers: {
      Authorization: "Bearer " + accessToken,
      "Content-Type": "multipart/form-data",
    },
  });
  console.log("addProductAsync", response);

  return response.data;
}

// get products
async function getProductsAsync() {
  const response = await axios.get(API_URL);
  console.log("getProductsAsync", response);

  return response.data;
}

// delete product
async function deleteProductAsync(productId, accessToken) {
  const response = await axios.delete(API_URL + `/${productId}`, {
    headers: {
      Authorization: "Bearer " + accessToken,
    },
  });
  console.log("deleteProductAsync", response);

  return response.data;
}

// update product
async function updateProductAsync(productId, formData, accessToken) {
  const response = await axios.patch(API_URL + `/${productId}`, formData, {
    headers: {
      Authorization: "Bearer " + accessToken,
      "Content-Type": "multipart/form-data",
    },
  });

  return response.data;
}

const productService = {
  addProductAsync,
  getProductsAsync,
  deleteProductAsync,
  updateProductAsync,
};

export default productService;
