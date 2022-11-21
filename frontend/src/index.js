import React from "react";
import { createRoot } from "react-dom/client";
import { Provider } from "react-redux";
import { store } from "./app/store";
import App from "./App";
import "./index.css";
import { ConfigProvider } from "antd";

const container = document.getElementById("root");
const root = createRoot(container);

root.render(
  <ConfigProvider
    theme={{
      token: {
        colorPrimary: "#52c41a",
        colorLinkHover: "#95de64"
      },
    }}
  >
    <Provider store={store}>
      <App />
    </Provider>
  </ConfigProvider>
);
