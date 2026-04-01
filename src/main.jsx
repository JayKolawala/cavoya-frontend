import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import ErrorBoundary from "./components/ErrorBoundary.jsx";
import { ApiProvider } from "./hooks/ApiProvider";
import App from "./App.jsx";

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <ErrorBoundary>
      <ApiProvider>
        <App />
      </ApiProvider>
    </ErrorBoundary>
  </StrictMode>
);
