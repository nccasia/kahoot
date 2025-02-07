import { BrowserRouter, Route, Routes } from "react-router-dom";
import { ROUTES } from "./routePath";
import MainLayout from "@/layouts/MainLayout";
import HomePage from "@/pages/HomePage";
import RoomPage from "@/pages/RoomPage";
import SearchGamePage from "@/pages/SearchGamePage";

const AppRoutes = () => {
  return (
    <BrowserRouter>
      <Routes>
        <Route element={<MainLayout />}>
          <Route path={ROUTES.HOME} element={<HomePage />} />
          <Route path={ROUTES.ROOM} element={<RoomPage />} />
          <Route path={ROUTES.SEARCH_GAME} element={<SearchGamePage />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
};
export default AppRoutes;
