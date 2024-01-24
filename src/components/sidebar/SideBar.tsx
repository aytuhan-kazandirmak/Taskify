import { Sidebar } from "flowbite-react";
import { HiViewBoards } from "react-icons/hi";
import { PiChalkboardSimpleFill } from "react-icons/pi";
import { IoLogOutOutline } from "react-icons/io5";
import { logout } from "../../reducer/firebaseSlice";
import { useDispatch } from "react-redux";
import { Link } from "react-router-dom";

function SideBar() {
  const dispatch = useDispatch();

  return (
    <Sidebar
      className="h-screen fixed"
      aria-label="Sidebar with logo branding example"
    >
      <Sidebar.Logo
        href="#"
        img="https://www.flowbite-react.com/favicon.svg"
        imgAlt="Flowbite logo"
      >
        TASKIFY
      </Sidebar.Logo>
      <Sidebar.Items>
        <Sidebar.ItemGroup>
          <Link to={"/"}>
            <Sidebar.Item icon={PiChalkboardSimpleFill}>Panolar</Sidebar.Item>
          </Link>
          <Link className="w-full" to={"/groupboard"}>
            <Sidebar.Item icon={HiViewBoards}>Board</Sidebar.Item>
          </Link>
          <Sidebar.Item
            onClick={() => {
              dispatch(logout());
            }}
            href="/login"
            icon={IoLogOutOutline}
          >
            Logout
          </Sidebar.Item>
        </Sidebar.ItemGroup>
      </Sidebar.Items>
    </Sidebar>
  );
}
export default SideBar;
