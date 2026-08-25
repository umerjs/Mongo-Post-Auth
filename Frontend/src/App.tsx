import { useEffect } from "react";
import { Navigate, Route, Routes } from "react-router-dom";
import axios from "axios";

import Posts from "./pages/Post";
import Login from "./pages/Login";
import Signup from "./pages/SignUp";
import ForgotPassword from "./pages/ForgotPassword";
import Profile from "./pages/Profile";
import Loading from "./components/SplashScreen";

import { BackendUrl } from "./core";
import { store } from "./store/states";

const App = () => {
  const { isLogin, login, logout } = store();

  useEffect(() => {
    is_User();
  }, []);

  const is_User = async () => {
    const token = localStorage.getItem("token");

    // No token means the user is not logged in
    if (!token) {
      logout();
      return;
    }

    try {
      const response = await axios.get(`${BackendUrl}/api/v1/profile`, {
        headers: {
          authorizedtoken: token,
        },
      });

      login(response.data.data);
    } catch (error) {
      console.error("Authentication failed:", error);

      localStorage.removeItem("token");
      logout();
    }
  };

  // Show splash/loading screen while checking authentication
  if (isLogin === null) {
    return <Loading />;
  }

  // Authenticated routes
  if (isLogin === true) {
    return (
      <Routes>
        <Route path="/" element={<Posts />} />
        <Route path="/profile" element={<Profile />} />

        {/* Redirect login/signup pages to home */}
        <Route path="/login" element={<Navigate to="/" replace />} />
        <Route path="/signup" element={<Navigate to="/" replace />} />
        <Route path="/forgot-password" element={<Navigate to="/" replace />} />

        {/* Unknown authenticated route */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    );
  }

  // Unauthenticated routes
  return (
    <Routes>
      <Route path="/login" element={<Login />} />
      <Route path="/signup" element={<Signup />} />
      <Route path="/forgot-password" element={<ForgotPassword />} />

      {/* Unknown unauthenticated route */}
      <Route path="*" element={<Navigate to="/login" replace />} />
    </Routes>
  );
};

export default App;
