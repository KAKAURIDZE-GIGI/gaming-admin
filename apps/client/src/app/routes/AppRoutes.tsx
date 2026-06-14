import { createBrowserRouter, Navigate } from "react-router-dom";
import { MainLayout } from "@/app/layout/MainLayout";
import { ProtectedRoute } from "@/features/auth";
import { ROUTES } from "@/shared/lib/routes";
import Login from "@/features/auth/pages/Login";
import Register from "@/features/auth/pages/Register";
import VerifyEmail from "@/features/auth/pages/VerifyEmail";
import Lobby from "@/features/lobby/Lobby";
import WheelList from "@/features/games/wheel/WheelList";
import WheelPlay from "@/features/games/wheel/WheelPlay";
import RaffleList from "@/features/games/raffle/RaffleList";
import RafflePlay from "@/features/games/raffle/RafflePlay";
import LeaderboardList from "@/features/games/leaderboard/LeaderboardList";
import LeaderboardPlay from "@/features/games/leaderboard/LeaderboardPlay";
import SlotList from "@/features/games/slot/SlotList";
import SlotPlay from "@/features/games/slot/SlotPlay";
import HistoryPage from "@/features/history/HistoryPage";

export const router = createBrowserRouter([
  { path: ROUTES.LOGIN, element: <Login /> },
  { path: ROUTES.REGISTER, element: <Register /> },
  { path: ROUTES.VERIFY, element: <VerifyEmail /> },
  {
    element: <ProtectedRoute />,
    children: [
      {
        element: <MainLayout />,
        children: [
          { path: ROUTES.HOME, element: <Lobby /> },
          { path: ROUTES.WHEELS, element: <WheelList /> },
          { path: "/wheels/:id", element: <WheelPlay /> },
          { path: ROUTES.RAFFLES, element: <RaffleList /> },
          { path: "/raffles/:id", element: <RafflePlay /> },
          { path: ROUTES.LEADERBOARDS, element: <LeaderboardList /> },
          { path: "/leaderboards/:id", element: <LeaderboardPlay /> },
          { path: ROUTES.SLOTS, element: <SlotList /> },
          { path: "/slots/:id", element: <SlotPlay /> },
          { path: ROUTES.HISTORY, element: <HistoryPage /> },
          { path: "*", element: <Navigate to={ROUTES.HOME} replace /> },
        ],
      },
    ],
  },
]);
