import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import App from "./App.tsx";
import ContextProvider from "./providers/ContextProvider/index.tsx";
import { SocketProvider } from "./providers/SocketProvider/index.tsx";

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <ContextProvider>
      <SocketProvider>
        <App />
      </SocketProvider>
    </ContextProvider>
  </StrictMode>
);
