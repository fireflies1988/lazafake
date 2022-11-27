import axios from "axios";

const API_URL = "/api/users";

// register
async function registerAsync(userData) {
  const response = await axios.post(API_URL, userData);
  console.log("resgiterAsync", response);

  return response.data;
}

// login
async function loginAsync(credentails) {
  const response = await axios.post(API_URL + "/login", credentails);
  console.log("login", response);

  return response.data;
}

// update profile
async function updateProfileAsync(formData, accessToken) {
  const response = await axios.patch(API_URL + "/me", formData, {
    headers: {
      Authorization: "Bearer " + accessToken,
      "Content-Type": "multipart/form-data",
    },
  });

  return response.data;
}

const authService = {
  registerAsync,
  loginAsync,
  updateProfileAsync,
};

export default authService;
