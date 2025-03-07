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
import Locations from "./pages/member/Locations";
import EmailComponent from "./components/forgotPassword/EmailComponent";
import ResetPassword from "./components/resetPassword/resetPassword";
import { useUserStore } from "./store/useUserStore";
import TrainerLayout from "./pages/trainer/TrainerLayout";
import Applications from "./pages/trainer/application/Applications";
import Appointment from "./pages/trainer/application/Appointment";
import Training from "./pages/trainer/application/Training";
import Trainings from "./pages/trainer/training/Trainings";
import Session from "./pages/trainer/training/Session";
import Member from "./pages/trainer/training/Member";
import { SnackbarProvider } from "./utils/Hooks/SnackbarContext.jsx";
import { useLoadingStore } from "./store/useLoadingStore";
import { Backdrop, CircularProgress } from '@mui/material';
function App() {
  // before
  // const isAuthenticated = false;

  //now
  const userRole = useUserStore((state) => state.userInfo?.role);
  const isGoogle = useUserStore((state) => state.userInfo?.isGoogle);
  const getDefaultPath = useUserStore((state) => state.getDefaultPath);
  const loading = useLoadingStore((state) => state.loading);
  const isAuthorized = (role, allowedRoles) => allowedRoles.includes(role);
  console.log("defaultPath", getDefaultPath());
  return (
    <ThemeProvider theme={theme}>
      <SnackbarProvider>
        <CssBaseline />
        <Routes>
          {/* The login page can be accessed before login, but not after login */}
          <Route path="/" element={!userRole ? <HomePage /> : <Navigate to={getDefaultPath()} replace />} />
          <Route path="/authenticate" element={!userRole ? <AuthenticationPage /> : <Navigate to={getDefaultPath()} replace />} />
          <Route path="/forgot-password" element={(!userRole || isGoogle) ? <EmailComponent /> : <Navigate to={getDefaultPath()} replace />} />
          <Route path="/reset-password" element={<ResetPassword />} />
          {/* Perform role access control after login */}
          {isAuthorized(userRole, ["member"]) && (
            <Route path="/member" element={<MemberLayout />}>
              <Route index element={<Navigate to="/member/trainers" replace />} />
              <Route path="trainers" element={<Trainers />} />
              <Route path="sessions" element={<Sessions />} />
              <Route path="locations" element={<Locations />} />
            </Route>
          )}
          {isAuthorized(userRole, ["trainer"]) && (
            <Route path="/trainer" element={<TrainerLayout />} >
              <Route index element={<Navigate to="/trainer/applications" replace />} />
              <Route path="applications" element={<Applications />} >
                <Route index element={<Navigate to="/trainer/applications/training" replace />} />
                <Route path="training" element={<Training />} />
                <Route path="appointment" element={<Appointment />} />
              </Route>
              <Route path="trainings" element={<Trainings />} >
                <Route index element={<Navigate to="/trainer/trainings/session" replace />} />
                <Route path="session" element={<Session />} />
                <Route path="member" element={<Member />} />
              </Route>
            </Route>
          )}
          {isAuthorized(userRole, ["admin"]) && (
            <Route path="/admin" element={<MemberLayout />} ></Route>
          )}

          <Route path="*" element={!userRole ? <Navigate to="/authenticate" replace /> : <Navigate to={getDefaultPath()} replace />} />
        </Routes>
      </SnackbarProvider>
      {/* The global load circle */}
      <Backdrop open={loading} sx={{ color: '#fff', zIndex: (theme) => theme.zIndex.drawer + 1 }}>
        <CircularProgress color="inherit" />
      </Backdrop>
    </ThemeProvider>
  );
}

export default App;
