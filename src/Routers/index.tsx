import { createBrowserRouter, Outlet } from "react-router-dom";
import NotFound from "@/Pages/NotFound";
import Layout from "@/Layout";
import PrivateRoutes from "./PrivateRoutes";
import { Suspense } from "react";
import { Spin } from "antd";
import { AuthRoutes, PageRoutes } from "./PageRoutes";

export const Router = createBrowserRouter([
  {
    children: [
      {
        element: <PrivateRoutes />,
        children: [
          {
            element: (
              <Suspense fallback={<div className="flex h-screen w-full items-center justify-center"><Spin size="large" /></div>}>
                <Layout />
              </Suspense>
            ),
            children: PageRoutes,
          },
        ],
      },
      {
        element: (
          <Suspense fallback={<div className="flex h-screen w-full items-center justify-center"><Spin size="large" /></div>}>
            <Outlet />
          </Suspense>
        ),
        children: AuthRoutes,
      },
    ],
  },
  {
    path: "*",
    element: <NotFound />,
  },
]);