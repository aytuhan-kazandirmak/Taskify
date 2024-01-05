import { FC, ReactNode } from "react";
import { useSelector } from "react-redux";
import { RootState } from "../reducer/store";
import { Navigate } from "react-router-dom";
type IprivateRoot = {
  children: ReactNode;
};
const PrivateRouteComponent: FC<IprivateRoot> = ({ children }) => {
  const userDetails = useSelector((state: RootState) => state.auth.userDetails);
  console.log("privateee route içindeki", userDetails);
  if (!userDetails) {
    return <Navigate to="/login" replace />;
  }
  return children;
};

export default PrivateRouteComponent;
