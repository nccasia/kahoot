import MainLayout from "@/layouts/MainLayout";
import SoundLayout from "@/layouts/SoundLayout";
import CreateGamePage from "@/pages/CreateGamePage";
import CreateGameTypePage from "@/pages/CreateGameTypePage";
import GameDetail from "@/pages/GameDetail";
import HomePage from "@/pages/HomePage";
import ListGamePage from "@/pages/ListGamePage";
import PlayGame from "@/pages/PlayGamePage";
import QuizzPage from "@/pages/QuizzPage";
import RoomPage from "@/pages/RoomPage";
import SearchGamePage from "@/pages/SearchGamePage";
import SimulateGame from "@/pages/SimulateGame";
import WaitingRoom from "@/pages/WaitingRoom";
import { SocketProvider } from "@/providers/SocketProvider";
import RoomSocketProvider from "@/providers/SocketProvider/RoomSocketProvider";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import { ROUTES } from "./routePath";

const AppRoutes = () => {
  return (
    <BrowserRouter>
      <Routes>
        <Route element={<SocketProvider />}>
          <Route element={<MainLayout />}>
            <Route path={ROUTES.HOME} element={<HomePage />} />
            <Route path={ROUTES.ROOM} element={<RoomPage />} />
            <Route path={ROUTES.LIST_GAME} element={<ListGamePage />} />
            <Route path={ROUTES.CREATE_GAME} element={<CreateGamePage />} />
            <Route path={ROUTES.CREATE_GAME_TYPE} element={<CreateGameTypePage />} />
            <Route path={ROUTES.SIMULATE_GAME} element={<SimulateGame />} />
            <Route element={<RoomSocketProvider />}>
              <Route path={ROUTES.PLAY_GAME} element={<PlayGame />} />
              <Route path={ROUTES.SEARCH_ROOM} element={<SearchGamePage />} />
              <Route element={<SoundLayout />}>
                <Route path={ROUTES.GAME_DETAIL} element={<GameDetail />} />
                <Route path={ROUTES.WAITING_ROOM} element={<WaitingRoom />} />
                <Route path={ROUTES.QUIZZ} element={<QuizzPage />} />
              </Route>
            </Route>
          </Route>
        </Route>
      </Routes>
    </BrowserRouter>
  );
};
export default AppRoutes;
