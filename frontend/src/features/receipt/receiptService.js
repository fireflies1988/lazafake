import axios from "axios";

const API_URL = "/api/receipts";

// add receipt
async function addReceiptAsync({ products }, accessToken) {
  const response = await axios.post(
    API_URL,
    {
      products,
    },
    {
      headers: {
        Authorization: "Bearer " + accessToken,
      },
    }
  );
  console.log("addReceiptAsync", response);

  return response.data;
}

// get receipts
async function getReceiptsAsync(accessToken) {
  const response = await axios.get(API_URL, {
    headers: {
      Authorization: "Bearer " + accessToken,
    },
  });
  console.log("getReceiptsAsync", response);

  return response.data;
}

const receiptService = {
  addReceiptAsync,
  getReceiptsAsync,
};

export default receiptService;
