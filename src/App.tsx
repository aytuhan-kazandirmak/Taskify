import Login from "./components/login/Login";
import Signup from "./components/signup/Signup";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import PrivateRouteComponent from "./privateRoute/PrivateRoute";
import Layouts from "./components/layout/Layouts";
import GroupBoardsPage from "./pages/group/GroupBoardsPage";
import GrupHomePage from "./pages/grupBoardshomepage/GrupHomePage";
import HomePage from "./pages/homepage/Home";

const router = createBrowserRouter([
  {
    path: "/",
    element: <PrivateRouteComponent />,
    children: [
      {
        path: "/",
        element: <Layouts />,
        children: [
          { path: "/", element: <HomePage /> },
          { path: "/groupboard", element: <GroupBoardsPage /> },
          { path: "/groupboard/:groupId", element: <GrupHomePage /> },
        ],
      },
    ],
  },
  { path: "/login", element: <Login /> },
  { path: "/signup", element: <Signup /> },
]);
function App() {
  return (
    <>
      <RouterProvider router={router} />
    </>
  );
}

export default App;
