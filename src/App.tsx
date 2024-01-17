import Login from "./components/login/Login";
import Signup from "./components/signup/Signup";
import HomePage from "./pages/home/Home";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import PrivateRouteComponent from "./privateRoute/PrivateRoute";
import Layouts from "./components/layout/Layouts";
import BoardsPage from "./pages/boards/BoardsPage";

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
