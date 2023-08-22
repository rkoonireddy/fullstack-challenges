import React from "react";
import ReactDOM from "react-dom/client";
import "./index.css";
import App from "./App";
import { StoresDataProvider } from "./utils/StoresDataProvider";

const root = ReactDOM.createRoot(
  document.getElementById("root") as HTMLElement
);
root.render(
  <React.StrictMode>
    <StoresDataProvider>
      <App />
    </StoresDataProvider>
  </React.StrictMode>
);
