import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import App from "./App.jsx";
import { ToastContainer } from "react-toastify";
import store from "./store/store.js";
import { Provider } from "react-redux";
import { HashRouter } from "react-router-dom";


createRoot(document.getElementById("root")).render(
  <StrictMode>
    <HashRouter>
      <Provider store={store}>
        <App />
        <ToastContainer />
      </Provider>
    </HashRouter>
  </StrictMode>
);