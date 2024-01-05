import Login from "./components/login/Login";
import Signup from "./components/signup/Signup";
import HomePage from "./pages/home/Home";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import PrivateRouteComponent from "./privateRoute/PrivateRoute";
function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route
          path="/"
          element={
            <PrivateRouteComponent>
              <HomePage />
            </PrivateRouteComponent>
          }
        />
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
