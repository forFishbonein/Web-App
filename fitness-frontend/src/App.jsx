import React, { useState } from "react";
import { ThemeProvider } from "@mui/material/styles";
import CssBaseline from "@mui/material/CssBaseline";
import theme from "./theme";
import "./index.css";
import {
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
import AuthenticationPage from "./pages/authenticationPage";
import HomePage from "./pages/HomePage";
import MemberLayout from "./pages/member/MemberLayout";
import Trainers from "./pages/member/Trainers";
import Sessions from "./pages/member/Sessions";
import ForgotPassword from "./components/forgotPassword/forgotPassword";
import { useUserStore } from "./store/useUserStore";
function App() {
  // before
  // const isAuthenticated = false;

  //now
  const userRole = useUserStore((state) => state.userInfo?.role);
  const getDefaultPath = useUserStore((state) => state.getDefaultPath);
  const isAuthorized = (role, allowedRoles) => allowedRoles.includes(role);
  console.log("defaultPath", getDefaultPath());
  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Routes>
        {/* The login page can be accessed before login, but not after login */}
        <Route path="/" element={!userRole ? <HomePage /> : <Navigate to={getDefaultPath()} replace />} />
        <Route path="/authenticate" element={!userRole ? <AuthenticationPage /> : <Navigate to={getDefaultPath()} replace />} />
        <Route path="/forgot-password" element={!userRole ? <ForgotPassword /> : <Navigate to={getDefaultPath()} replace />} />
        {/* Perform role access control after login */}
        {isAuthorized(userRole, ["member"]) && (
          <Route path="/member" element={<MemberLayout />}>
            <Route index element={<Navigate to="/member/trainers" replace />} />
            <Route path="trainers" element={<Trainers />} />
            <Route path="sessions" element={<Sessions />} />
          </Route>
        )}
        {isAuthorized(userRole, ["admin"]) && (
          <Route path="/admin" element={<MemberLayout />} ></Route>
        )}
        {isAuthorized(userRole, ["trainer"]) && (
          <Route path="/trainer" element={<MemberLayout />} ></Route>
        )}
        <Route path="*" element={!userRole ? <Navigate to="/authenticate" replace /> : <Navigate to={getDefaultPath()} replace />} />
      </Routes>
    </ThemeProvider>
  );
}

export default App;
