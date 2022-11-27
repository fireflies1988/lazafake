import axios from "axios";

const API_URL = "/api/addresses";

// add address
async function addAddressAsync(addressData, accessToken) {
  const response = await axios.post(API_URL, addressData, {
    headers: {
      Authorization: "Bearer " + accessToken,
    },
  });
  console.log("addAddressAsync", response);

  return response.data;
}

// update address
async function updateAddressAsync(addressId, addressData, accessToken) {
  const response = await axios.patch(API_URL + `/${addressId}`, addressData, {
    headers: {
      Authorization: "Bearer " + accessToken,
    },
  });
  console.log("updateAddressAsync", response);

  return response.data;
}

// delete address
async function deleteAddressAsync(addressId, accessToken) {
  const response = await axios.delete(API_URL + `/${addressId}`, {
    headers: {
      Authorization: "Bearer " + accessToken,
    },
  });
  console.log("deleteAddressAsync", response);

  return response.data;
}

// get addresses
async function getAddressesAsync(accessToken) {
  const response = await axios.get(API_URL, {
    headers: {
      Authorization: "Bearer " + accessToken,
    },
  });
  console.log("getAddressesAsync", response);

  return response.data;
}

const addressService = {
  addAddressAsync,
  getAddressesAsync,
  deleteAddressAsync,
  updateAddressAsync,
};

export default addressService;
