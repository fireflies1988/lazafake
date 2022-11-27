import axios from "axios";

const API_URL = "/api/categories";

// add address
async function addCategoryAsync(formData, accessToken) {
  const response = await axios.post(API_URL, formData, {
    headers: {
      Authorization: "Bearer " + accessToken,
      "Content-Type": "multipart/form-data",
    },
  });
  console.log("addCategoryAsync", response);

  return response.data;
}

// get categories
async function getCategoriesAsync() {
  const response = await axios.get(API_URL);
  console.log("getCategoriesAsync", response);

  return response.data;
}

// delete category
async function deleteCategoryAsync(categoryId, accessToken) {
  const response = await axios.delete(API_URL + `/${categoryId}`, {
    headers: {
      Authorization: "Bearer " + accessToken,
    },
  });
  console.log("deleteCategoryAsync", response);

  return response.data;
}

// update profile
async function updateCategoryAsync(categoryId, formData, accessToken) {
  const response = await axios.patch(API_URL + `/${categoryId}`, formData, {
    headers: {
      Authorization: "Bearer " + accessToken,
      "Content-Type": "multipart/form-data",
    },
  });

  return response.data;
}

const categoryService = {
  addCategoryAsync,
  getCategoriesAsync,
  deleteCategoryAsync,
  updateCategoryAsync,
};

export default categoryService;
