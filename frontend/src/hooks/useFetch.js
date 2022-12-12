import { message as antMessage, message } from "antd";
import axios from "axios";
import { useSelector } from "react-redux";
import { showError } from "../utils";

function useFetch() {
  const { user } = useSelector((state) => state.auth);

  async function crawlTikiProductAsync(productLink) {
    try {
      const key = "updatable";
      antMessage.open({
        key,
        type: "loading",
        content: "Copying Data...",
      });
      const response = await axios.post(
        `/api/crawl/tiki`,
        {
          productLink,
        },
        {
          headers: {
            Authorization: "Bearer " + user.accessToken,
          },
        }
      );

      antMessage.open({
        key,
        type: "success",
        content: "Copied Data Successfully.",
      });
      return response.data;
    } catch (err) {
      const message =
        err?.response?.data?.errors?.map((err) => err.msg) ??
        err?.response?.data?.message ??
        err?.message ??
        err.toString();
      showError(antMessage, message);
    }
  }

  return {
    crawlTikiProductAsync,
  };
}

export default useFetch;
