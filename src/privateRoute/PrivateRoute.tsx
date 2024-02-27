import { useSelector } from "react-redux";
import { RootState } from "../reducer/store";
import { Navigate } from "react-router-dom";

import { Outlet } from "react-router-dom";
import { useEffect } from "react";

const PrivateRouteComponent = () => {
  const userDetails = useSelector((state: RootState) => state.auth.userDetails);
  const emailItem: string | null = localStorage.getItem("email");

  if (emailItem !== null) {
    JSON.parse(emailItem);
  }

  useEffect(() => {
    if (!userDetails && !emailItem) {
      <Navigate to="/login" replace />;
    }
  }, []);

  return <Outlet />;
};

export default PrivateRouteComponent;
