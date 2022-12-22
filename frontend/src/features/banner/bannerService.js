import axios from "axios";

const API_URL = "/api/banners";

// update banners
async function updateBannersAsync(formData, accessToken) {
  const response = await axios.post(`${API_URL}`, formData, {
    headers: {
      Authorization: "Bearer " + accessToken,
      "Content-Type": "multipart/form-data",
    },
  });
  console.log("updateBannersAsync", response);

  return response.data;
}

// get banners
async function getBannersAsync() {
  const response = await axios.get(API_URL);
  console.log("getBannersAsync", response);

  return response.data;
}

const bannerService = {
  updateBannersAsync,
  getBannersAsync,
};

export default bannerService;
