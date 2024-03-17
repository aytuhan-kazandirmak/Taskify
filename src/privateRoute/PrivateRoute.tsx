import { useDispatch, useSelector } from "react-redux";
import { RootState } from "../reducer/store";
import { useNavigate } from "react-router-dom";

import { Outlet } from "react-router-dom";
import { useEffect } from "react";
import { onAuthState } from "../reducer/firebaseSlice";

const PrivateRouteComponent = () => {
  const dispatch = useDispatch();

  const userDetails = useSelector((state: RootState) => state.auth.userDetails);
  const emailItem: string | null = localStorage.getItem("userInformation");
  const getLocalData = async () => {
    if (emailItem !== null) {
      dispatch(onAuthState(JSON.parse(emailItem)));
    }
  };

  const navigate = useNavigate();

  useEffect(() => {
    getLocalData();
  }, []); // Boş bağımlılık, sayfa her yenilendiğinde bu useEffect'in çalışmasını sağlar

  useEffect(() => {
    if (!userDetails && !emailItem) {
      navigate("/login");
    }
  }, [userDetails, navigate]);

  return <Outlet />;
};

export default PrivateRouteComponent;
