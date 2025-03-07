import { ToastContainer } from "react-toastify";
import "./App.css";
import AppRoutes from "./routes";

function App() {
  return (
    <>
      <AppRoutes />
      <ToastContainer
        position='top-center'
        autoClose={5000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick={false}
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme='light'
      />
    </>
  );
}

export default App;
