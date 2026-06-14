import { createBrowserRouter, Navigate } from "react-router-dom";
import { Suspense } from "react";
import { CircularProgress, Box } from "@mui/material";
import { MainLayout } from "@/app/layout";
import { ErrorBoundary, NotFound } from "@/shared/components";
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

// eslint-disable-next-line react-refresh/only-export-components
function PageLoader() {
  return (
    <Box
      sx={{
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        minHeight: 400,
      }}
    >
      <CircularProgress />
    </Box>
  );
}

// eslint-disable-next-line react-refresh/only-export-components
function Wrap({
  children,
  feature,
}: {
  children: React.ReactNode;
  feature?: string;
}) {
  return (
    <ErrorBoundary featureName={feature}>
      <Suspense fallback={<PageLoader />}>{children}</Suspense>
    </ErrorBoundary>
  );
}

export const router = createBrowserRouter([
  {
    path: ROUTES.LOGIN,
    element: (
      <Wrap feature="Login">
        <Login />
      </Wrap>
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
              <Wrap feature="Wheel">
                <WheelList />
              </Wrap>
            ),
          },
          {
            path: ROUTES.WHEEL.CREATE,
            element: (
              <Wrap feature="Wheel">
                <WheelCreate />
              </Wrap>
            ),
          },
          {
            path: "/wheels/:id/edit",
            element: (
              <Wrap feature="Wheel">
                <WheelEdit />
              </Wrap>
            ),
          },
          {
            path: "/wheels/:id",
            element: (
              <Wrap feature="Wheel">
                <WheelDetail />
              </Wrap>
            ),
          },

          {
            path: ROUTES.SLOT.LIST,
            element: (
              <Wrap feature="Slot">
                <SlotList />
              </Wrap>
            ),
          },
          {
            path: ROUTES.SLOT.CREATE,
            element: (
              <Wrap feature="Slot">
                <SlotCreate />
              </Wrap>
            ),
          },
          {
            path: "/slots/:id/edit",
            element: (
              <Wrap feature="Slot">
                <SlotEdit />
              </Wrap>
            ),
          },
          {
            path: "/slots/:id",
            element: (
              <Wrap feature="Slot">
                <SlotDetail />
              </Wrap>
            ),
          },

          { path: "*", element: <NotFound /> },
        ],
      },
    ],
  },
]);
