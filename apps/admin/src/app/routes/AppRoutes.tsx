import { createBrowserRouter, Navigate } from "react-router-dom";
import { MainLayout } from "@/app/layout";
import { NotFound } from "@/shared/components";
import { ROUTES } from "@/shared/lib";
import { ProtectedRoute } from "@/features/auth";
import Login from "@/features/auth/pages/Login";
import WheelList from "@/features/wheel/pages/WheelList";
import WheelCreate from "@/features/wheel/pages/WheelCreate";
import WheelEdit from "@/features/wheel/pages/WheelEdit";
import WheelDetail from "@/features/wheel/pages/WheelDetail";
import SlotList from "@/features/slot/pages/SlotList";
import SlotCreate from "@/features/slot/pages/SlotCreate";
import SlotEdit from "@/features/slot/pages/SlotEdit";
import SlotDetail from "@/features/slot/pages/SlotDetail";
import { RouteShell } from "./RouteShell";

export const router = createBrowserRouter([
  {
    path: ROUTES.LOGIN,
    element: (
      <RouteShell feature="Login">
        <Login />
      </RouteShell>
    ),
  },
  {
    element: <ProtectedRoute />,
    children: [
      {
        element: <MainLayout />,
        children: [
          {
            path: ROUTES.HOME,
            element: <Navigate to={ROUTES.WHEEL.LIST} replace />,
          },

          {
            path: ROUTES.WHEEL.LIST,
            element: (
              <RouteShell feature="Wheel">
                <WheelList />
              </RouteShell>
            ),
          },
          {
            path: ROUTES.WHEEL.CREATE,
            element: (
              <RouteShell feature="Wheel">
                <WheelCreate />
              </RouteShell>
            ),
          },
          {
            path: "/wheels/:id/edit",
            element: (
              <RouteShell feature="Wheel">
                <WheelEdit />
              </RouteShell>
            ),
          },
          {
            path: "/wheels/:id",
            element: (
              <RouteShell feature="Wheel">
                <WheelDetail />
              </RouteShell>
            ),
          },

          {
            path: ROUTES.SLOT.LIST,
            element: (
              <RouteShell feature="Slot">
                <SlotList />
              </RouteShell>
            ),
          },
          {
            path: ROUTES.SLOT.CREATE,
            element: (
              <RouteShell feature="Slot">
                <SlotCreate />
              </RouteShell>
            ),
          },
          {
            path: "/slots/:id/edit",
            element: (
              <RouteShell feature="Slot">
                <SlotEdit />
              </RouteShell>
            ),
          },
          {
            path: "/slots/:id",
            element: (
              <RouteShell feature="Slot">
                <SlotDetail />
              </RouteShell>
            ),
          },

          { path: "*", element: <NotFound /> },
        ],
      },
    ],
  },
]);
