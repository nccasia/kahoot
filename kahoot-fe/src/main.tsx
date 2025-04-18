import { createRoot } from "react-dom/client";
import App from "./App.tsx";
import "./index.css";
import ContextProvider from "./providers/ContextProvider/index.tsx";

createRoot(document.getElementById("root")!).render(
  // <StrictMode>
  <ContextProvider>
    <App />
  </ContextProvider>
  // </StrictMode>
);
