import axios from "axios";

const API_URL = "/api/users";

// register
const registerAsync = async (userData) => {
  const response = await axios.post(API_URL, userData);
  console.log("resgiterAsync", response);

  return response.data;
};

const authService = {
  registerAsync,
};

export default authService;
