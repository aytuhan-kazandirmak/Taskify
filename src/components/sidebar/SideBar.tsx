"use client";

import { Sidebar } from "flowbite-react";
import {
  HiChartPie,
  HiInbox,
  HiShoppingBag,
  HiTable,
  HiUser,
  HiViewBoards,
} from "react-icons/hi";
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
          <Sidebar.Item href="#" icon={HiChartPie}>
            Dashboard
          </Sidebar.Item>
          <Sidebar.Item href="#" icon={HiViewBoards}>
            Kanban
          </Sidebar.Item>
          <Sidebar.Item href="#" icon={HiInbox}>
            Inbox
          </Sidebar.Item>
          <Sidebar.Item href="#" icon={HiUser}>
            Users
          </Sidebar.Item>
          <Sidebar.Item href="#" icon={HiShoppingBag}>
            Products
          </Sidebar.Item>
          <Sidebar.Item href="#" icon={HiTable}>
            Sign Up
          </Sidebar.Item>
          <Link
            to={"/login"}
            onClick={() => {
              dispatch(logout());
            }}
          >
            Logout
          </Link>
        </Sidebar.ItemGroup>
      </Sidebar.Items>
    </Sidebar>
  );
}
export default SideBar;
