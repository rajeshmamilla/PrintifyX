import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import App from "./App.tsx";
import "./index.css";
import { BackendWakeupProvider } from "./components/BackendWakeupProvider";

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <BackendWakeupProvider>
      <App />
    </BackendWakeupProvider>
  </StrictMode>,
);
