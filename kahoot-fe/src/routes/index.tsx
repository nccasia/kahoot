import { BrowserRouter, Route, Routes } from "react-router-dom";
import { ROUTES } from "./routePath";
import MainLayout from "../layouts/MainLayout";
import HomePage from "../pages/HomePage";
import RoomPage from "../pages/RoomPage";

const AppRoutes = () => {
  return (
    <BrowserRouter>
      <Routes>
        <Route element={<MainLayout />}>
          <Route path={ROUTES.HOME} element={<HomePage />} />
          <Route path={ROUTES.ROOM} element={<RoomPage />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
};
export default AppRoutes;
