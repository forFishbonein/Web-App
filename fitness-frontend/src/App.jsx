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
import EmailComponent from "./components/Auth/forgotPassword/EmailComponent";
import ResetPassword from "./components/Auth/resetPassword/resetPassword";
import { useUserStore } from "./store/useUserStore";
import TrainerLayout from "./pages/trainer/TrainerLayout";
import AdminLayout from "./pages/admin/AdminLayout.jsx";
// import Applications from "./pages/trainer/application/Applications";
// import Appointment from "./pages/trainer/application/Appointment";
// import Training from "./pages/trainer/application/Training";
// import Trainings from "./pages/trainer/training/Trainings";
// import Session from "./pages/trainer/training/Session";
// import Member from "./pages/trainer/training/Member";
import TrainerHome from "./pages/trainer/TrainerHome.jsx";
import MemberManagement from "./pages/trainer/MemberManagement.jsx";
import SessionRequests from "./pages/trainer/SessionRequests";
import MySessions from "./pages/trainer/MySessions";
import WorkoutPlans from "./pages/trainer/WorkoutPlans";
import MemberProgress from "./pages/trainer/MemberProgress";
import History from "./pages/trainer/History";
import Availability from "./pages/trainer/TrainerAvailability.jsx"
import TrainerProfile from "./pages/trainer/TrainerProfile.jsx";
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
              <Route index element={<Navigate to="/trainer/home" replace />} />
            <Route path="home" element={<TrainerHome />} />
            <Route path="member-management" element={<MemberManagement />} />
            <Route path="session-requests" element={<SessionRequests />} />
            <Route path="upcoming-sessions" element={<MySessions />} />
            <Route path="workout-plans" element={<WorkoutPlans />} />
            <Route path="member-progress" element={<MemberProgress />} />
            <Route path="history" element={<History />} />
            <Route path="availability" element={<Availability />} />
            <Route path="profile" element={<TrainerProfile />} />
            </Route>
          )}
          {isAuthorized(userRole, ["admin"]) && (
            <Route path="/admin" element={<AdminLayout />} ></Route>
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
