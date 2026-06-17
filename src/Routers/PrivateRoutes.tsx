import { Navigate, Outlet } from "react-router-dom";
import { useAppSelector } from "@/Store/hooks";
import { ROUTES } from "@/Constants";

export const PrivateRoutes = () => {
  const { isAuthenticated } = useAppSelector((store) => store.auth);
  return isAuthenticated ? <Outlet /> : <Navigate to={ROUTES.AUTH.LOGIN} replace />;
};

export default PrivateRoutes;
