import MainLayout from "@/layouts/MainLayout";
import CreateGamePage from "@/pages/CreateGamePage";
import GameDetail from "@/pages/GameDetail";
import HomePage from "@/pages/HomePage";
import ListGamePage from "@/pages/ListGamePage";
import RoomPage from "@/pages/RoomPage";
import SearchGamePage from "@/pages/SearchGamePage";
import WaitingRoom from "@/pages/WaitingRoom";
import RoomSocketProvider from "@/providers/SocketProvider/RoomSocketProvider";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import { ROUTES } from "./routePath";

const AppRoutes = () => {
  return (
    <BrowserRouter>
      <Routes>
        <Route element={<MainLayout />}>
          <Route path={ROUTES.HOME} element={<HomePage />} />
          <Route path={ROUTES.ROOM} element={<RoomPage />} />
          <Route path={ROUTES.LIST_GAME} element={<ListGamePage />} />
          <Route path={ROUTES.CREATE_GAME} element={<CreateGamePage />} />
          <Route element={<RoomSocketProvider />}>
            <Route path={ROUTES.GAME_DETAIL} element={<GameDetail />} />
            <Route path={ROUTES.WAITING_ROOM} element={<WaitingRoom />} />
            <Route path={ROUTES.SEARCH_ROOM} element={<SearchGamePage />} />
          </Route>
        </Route>
      </Routes>
    </BrowserRouter>
  );
};
export default AppRoutes;
