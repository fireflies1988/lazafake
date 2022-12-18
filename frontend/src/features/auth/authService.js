import axios from "axios";

const API_URL = "/api/users";

// register
async function registerAsync(userData) {
  const response = await axios.post(API_URL, userData);
  console.log("resgiterAsync", response);

  return response.data;
}

// login
async function loginAsync(credentials) {
  const response = await axios.post(API_URL + "/login", credentials);
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

// get users (admin)
async function getUsersAsync(params, accessToken) {
  const response = await axios.get(`${API_URL}`, {
    headers: {
      Authorization: "Bearer " + accessToken,
    },
    params: params,
  });
  console.log("getUsersAsync", response);

  return response.data;
}

// send verification code
async function sendVerificationCodeAsync(accessToken) {
  const response = await axios.post(
    `${API_URL}/me/mail/send-verification-code`,
    null,
    {
      headers: {
        Authorization: "Bearer " + accessToken,
      },
    }
  );
  console.log("sendVerificationCodeAsync", response);

  return response.data;
}

// verify email address
async function verifyEmailAddressAsync(code, accessToken) {
  const response = await axios.post(
    `${API_URL}/me/mail/verify`,
    {
      code,
    },
    {
      headers: {
        Authorization: "Bearer " + accessToken,
      },
    }
  );
  console.log("verifyEmailAddressAsync", response);

  return response.data;
}

// forgot password
async function forgotPasswordAsync(email) {
  const response = await axios.post(`${API_URL}/password/forgot`, {
    email,
  });
  console.log("forgotPasswordAsync", response);

  return response.data;
}

// reset password
async function resetPasswordAsync(params) {
  const response = await axios.get(`${API_URL}/password/reset`, {
    params: params,
  });
  console.log("resetPasswordAsync", response);

  return response.data;
}

// change role (spadmin)
async function changeRoleAsync(userId, role, accessToken) {
  const response = await axios.patch(
    `${API_URL}/${userId}/role/change`,
    {
      role,
    },
    {
      headers: {
        Authorization: "Bearer " + accessToken,
      },
    }
  );
  console.log("changeRoleAsync", response);

  return response.data;
}

// cancel order (user)
async function cancelOrderAsync({ orderId, cancellationReason }, accessToken) {
  const response = await axios.patch(
    `${API_URL}/me/orders/${orderId}`,
    {
      cancellationReason,
    },
    {
      headers: {
        Authorization: "Bearer " + accessToken,
      },
    }
  );
  console.log("cancelOrderAsync", response);

  return response.data;
}

const authService = {
  registerAsync,
  loginAsync,
  updateProfileAsync,
  changePasswordAsync,
  getMyOrdersAsync,
  getMyNotificationsAsync,
  getUsersAsync,
  sendVerificationCodeAsync,
  verifyEmailAddressAsync,
  forgotPasswordAsync,
  resetPasswordAsync,
  changeRoleAsync,
  cancelOrderAsync,
};

export default authService;
