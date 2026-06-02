import React from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import { App } from "./app/App";
import { scheduleFirebaseAnalytics } from "./app/firebase";
import { scheduleOfflineFirstPrefetch } from "./app/offlinePrefetch";
import { registerServiceWorker } from "./pwa/serviceWorkerRegistration";
import "./styles/globals.css";

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <BrowserRouter>
      <App />
    </BrowserRouter>
  </React.StrictMode>
);

registerServiceWorker();
scheduleOfflineFirstPrefetch();
scheduleFirebaseAnalytics();
