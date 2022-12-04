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

// change password
async function changePasswordAsync(data, accessToken) {
  const response = await axios.patch(API_URL + "/me/password/change", data, {
    headers: {
      Authorization: "Bearer " + accessToken,
    },
  });

  return response.data;
}

// view my orders
async function getMyOrdersAsync(accessToken) {
  const response = await axios.get(`${API_URL}/me/orders`, {
    headers: {
      Authorization: "Bearer " + accessToken,
    },
  });
  console.log("getMyOrdersAsync", response);

  return response.data;
}

// get my notifications
async function getMyNotificationsAsync(params, accessToken) {
  const response = await axios.get(`${API_URL}/me/notifications`, {
    headers: {
      Authorization: "Bearer " + accessToken,
    },
    params: params,
  });
  console.log("getMyNotificationsAsync", response);

  return response.data;
}

const authService = {
  registerAsync,
  loginAsync,
  updateProfileAsync,
  changePasswordAsync,
  getMyOrdersAsync,
  getMyNotificationsAsync,
};

export default authService;
