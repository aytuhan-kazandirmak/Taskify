import { useSelector } from "react-redux";
import { RootState } from "../reducer/store";
import { Navigate } from "react-router-dom";

import { Outlet } from "react-router-dom";
import { useEffect } from "react";

const PrivateRouteComponent = () => {
  const userDetails = useSelector((state: RootState) => state.auth.userDetails);
  const localToken: string | null = JSON.parse(localStorage.getItem("email"));

  useEffect(() => {
    if (!userDetails && !localToken) {
      return <Navigate to="/login" replace />;
    }
  }, []);

  return <Outlet />;
};

export default PrivateRouteComponent;
