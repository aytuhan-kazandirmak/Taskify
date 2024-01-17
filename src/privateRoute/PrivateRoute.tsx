import { useSelector } from "react-redux";
import { RootState } from "../reducer/store";
import { Navigate } from "react-router-dom";

import { Outlet } from "react-router-dom";

const PrivateRouteComponent = () => {
  const userDetails = useSelector((state: RootState) => state.auth.userDetails);

  if (!userDetails) {
    return <Navigate to="/login" replace />;
  }
  return <Outlet />;
};

export default PrivateRouteComponent;
