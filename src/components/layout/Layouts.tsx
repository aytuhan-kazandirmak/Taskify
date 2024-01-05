import SideBar from "../sidebar/SideBar";
import "./layouts.css";
type Iprops = {
  children: React.ReactNode;
};
const Layouts: React.FC<Iprops> = ({ children }) => {
  return (
    <div className="layouts">
      <div className="sidebar">
        <SideBar />
      </div>
      <div className="flex flex-col w-[82%]">
        <div className="top-bar w-full bg-slate-400 opacity-50 h-[48px]"></div>
        <div className="w-full m-2">{children}</div>
      </div>
    </div>
  );
};

export default Layouts;
