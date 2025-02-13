import { createRoot } from "react-dom/client";
import App from "./App.tsx";
import "./index.css";
import ContextProvider from "./providers/ContextProvider/index.tsx";
import { SocketProvider } from "./providers/SocketProvider/index.tsx";

createRoot(document.getElementById("root")!).render(
  // <StrictMode>
  <ContextProvider>
    <SocketProvider>
      <App />
    </SocketProvider>
  </ContextProvider>
  // </StrictMode>
);
