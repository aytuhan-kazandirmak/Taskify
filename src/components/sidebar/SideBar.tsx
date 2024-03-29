import { PiChalkboardSimpleFill } from "react-icons/pi";
import { RiLogoutBoxRFill } from "react-icons/ri";
import { logout } from "../../reducer/firebaseSlice";
import { useDispatch } from "react-redux";
import { Link } from "react-router-dom";
import { FaStar } from "react-icons/fa";
import "./sidebar.css";

function SideBar() {
  const dispatch = useDispatch();

  return (
    <div className="h-screen fixed text-gray-300  w-[18%]">
      <div className="flex flex-row gap-x-2 items-center text-xl h-20 w-full pl-5">
        <img src="https://www.flowbite-react.com/favicon.svg" alt="logo" />
        <div className="text-gray-200">TASKIFY</div>
      </div>

      <div className="flex flex-col gap-y-6">
        <Link
          className="w-full flex flex-row gap-x-2 items-center pl-5"
          to={"/"}
        >
          <FaStar size={22} />
          <div>Sık Kullanılanlar</div>
        </Link>
        <Link
          className="w-full flex flex-row gap-x-2 items-center pl-5"
          to={"/groupboard"}
        >
          <PiChalkboardSimpleFill size={22} />
          <div>Panolar</div>
        </Link>
        <Link
          className="w-full flex flex-row gap-x-2 items-center pl-5"
          onClick={() => {
            dispatch(logout());
          }}
          to={"/login"}
        >
          <RiLogoutBoxRFill size={23} />
          <div>Çıkış</div>
        </Link>
      </div>
    </div>
  );
}
export default SideBar;
