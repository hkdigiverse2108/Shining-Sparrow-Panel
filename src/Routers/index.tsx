import { createBrowserRouter, Outlet } from "react-router-dom";
import { AuthRoutes, PageRoutes } from "./PageRoutes";
import NotFound from "@/Pages/NotFound";
import Layout from "@/Layout";
import PublicRoutes from "./PublicRoutes";

export const Router = createBrowserRouter([
    {
    children: [
      {
        // element: <PrivateRoutes />,
        element: <PublicRoutes />,
        children: [
          {
            element: <Layout />,
            children: PageRoutes,
          },
        ],
      },
      {
        element: <Outlet />,
        children: AuthRoutes,
      },
    ],
  },
  {
    path: "*",
    element: <NotFound />,
  },
]);