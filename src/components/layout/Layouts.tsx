import SideBar from "../sidebar/SideBar";
import "./layouts.css";
import { Outlet } from "react-router-dom";

const Layouts = () => {
  return (
    <div className="layouts ">
      <div className="sidebar ">
        <SideBar />
      </div>
      <div className="flex flex-col w-[80%] ">
        <div className="w-full m-2 h-screen pb-8 ">
          <Outlet />
        </div>
      </div>
    </div>
  );
};

export default Layouts;
