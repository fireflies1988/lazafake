import axios from "axios";

const API_URL = "/api/users";

// register
async function registerAsync(userData) {
  const response = await axios.post(API_URL, userData);
  console.log("resgiterAsync", response);

  return response.data;
};

// login
async function loginAsync(credentails) {
  const response = await axios.post(API_URL + "/login", credentails);
  console.log("login", response);

  if (response.data) {
    localStorage.setItem("lazafakeUser", JSON.stringify(response.data));
  }

  return response.data;
}

const authService = {
  registerAsync,
  loginAsync,
};

export default authService;
