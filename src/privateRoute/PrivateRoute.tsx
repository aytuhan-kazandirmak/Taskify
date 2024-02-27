import { useSelector } from "react-redux";
import { RootState } from "../reducer/store";
import { useNavigate } from "react-router-dom";

import { Outlet } from "react-router-dom";
import { useEffect } from "react";

const PrivateRouteComponent = () => {
  const userDetails = useSelector((state: RootState) => state.auth.userDetails);
  const emailItem: string | null = localStorage.getItem("email");
  const navigate = useNavigate();
  if (emailItem !== null) {
    JSON.parse(emailItem);
  }

  useEffect(() => {
    if (!userDetails && !emailItem) {
      navigate("/login");
    }
  }, []);

  return <Outlet />;
};

export default PrivateRouteComponent;
