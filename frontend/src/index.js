import React from "react";
import { createRoot } from "react-dom/client";
import { Provider } from "react-redux";
import { store } from "./app/store";
import App from "./App";
import "./index.css";
import { ConfigProvider, message } from "antd";
import Kommunicate from "@kommunicate/kommunicate-chatbot-plugin";

const container = document.getElementById("root");
const root = createRoot(container);
Kommunicate.init("25e314a4baf1258d36d5a59e244bf376f", {
  popupWidget: true,
  automaticChatOpenOnNavigation: true,
});

message.config({
  top: 80,
});

root.render(
  <ConfigProvider
    theme={{
      token: {
        colorPrimary: "#52c41a",
        colorLinkHover: "#95de64",
        colorLink: "#73d13d",
      },
    }}
  >
    <Provider store={store}>
      <App />
    </Provider>
  </ConfigProvider>
);
