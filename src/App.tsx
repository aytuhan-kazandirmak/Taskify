import Login from "./components/login/Login";
import Signup from "./components/signup/Signup";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import PrivateRouteComponent from "./privateRoute/PrivateRoute";
import Layouts from "./components/layout/Layouts";
import BoardsPage from "./pages/boards/BoardsPage";
import GroupBoardsPage from "./pages/group/GroupBoardsPage";
import HomePage from "./pages/home/Home";
import GroupBoards from "./components/group/GroupBoards";

const router = createBrowserRouter([
  {
    path: "/",
    element: <PrivateRouteComponent />,
    children: [
      {
        path: "/",
        element: <Layouts />,
        children: [
          {
            path: "/",
            element: <BoardsPage />,
          },
          { path: "/:id", element: <HomePage /> },
          { path: "/groupboard", element: <GroupBoardsPage /> },
          { path: "/groupboard/:groupId", element: <GroupBoards /> },
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
