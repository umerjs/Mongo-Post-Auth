import { Route, Routes } from "react-router-dom";
import Posts from "./pages/Post";
import Login from "./pages/Login";
import Signup from "./pages/SignUp";
import NotFound from "./pages/NotFound";
import ForgotPassword from "./pages/ForgotPassword";

const App = () => {
  return (
    <Routes>
      <Route path="/" element={<Posts />} />
      <Route path="/signup" element={<Signup />} />
      <Route path="/login" element={<Login />} />
      <Route path="/forgot-password" element={<ForgotPassword />} />
      <Route path="*" element={<NotFound />} />
    </Routes>
  );
};

export default App;
