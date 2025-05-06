import React, { useState, lazy, Suspense } from "react";
import { ThemeProvider } from "@mui/material/styles";
import CssBaseline from "@mui/material/CssBaseline";
import theme from "./theme";
import "./index.css";
import { Routes, Route, Navigate } from "react-router-dom";
// import AuthenticationPage from "./pages/authenticationPage";
import HomePage from "./pages/HomePage";
// import MemberLayout from "./pages/member/MemberLayout";
// import TrainerLayout from "./pages/trainer/TrainerLayout";
// import AdminLayout from "./pages/admin/AdminLayout.jsx";
const AuthenticationPage = lazy(() => import("./pages/authenticationPage"));
// const HomePage = lazy(() => import("./pages/HomePage"));
const MemberLayout = lazy(() => import("./pages/member/MemberLayout"));
const TrainerLayout = lazy(() => import("./pages/trainer/TrainerLayout"));
const AdminLayout = lazy(() => import("./pages/admin/AdminLayout.jsx"));
import { useUserStore } from "./store/useUserStore";
import { SnackbarProvider } from "./utils/Hooks/SnackbarContext.jsx";
import { useLoadingStore } from "./store/useLoadingStore";
import { Backdrop, CircularProgress } from "@mui/material";
import EmailComponent from "./components/Auth/forgotPassword/EmailComponent";
import ResetPassword from "./components/Auth/resetPassword/resetPassword";
// import Trainers from "./pages/member/Trainers";
// import Sessions from "./pages/member/Sessions";
// import Locations from "./pages/member/Locations";
const Trainers = lazy(() => import("./pages/member/Trainers"));
const Sessions = lazy(() => import("./pages/member/Sessions"));
const Locations = lazy(() => import("./pages/member/Locations"));
// import TrainerHome from "./pages/trainer/TrainerHome.jsx";
// import MemberManagement from "./pages/trainer/MemberManagement.jsx";
// import SessionRequests from "./pages/trainer/SessionRequests";
// import MySessions from "./pages/trainer/MySessions";
// import WorkoutPlans from "./pages/trainer/WorkoutPlans";
// import MemberProgress from "./pages/trainer/MemberProgress";
// import History from "./pages/trainer/History";
// import Availability from "./pages/trainer/TrainerAvailability.jsx";
// import TrainerProfile from "./pages/trainer/TrainerProfile.jsx";
const TrainerHome = lazy(() => import("./pages/trainer/TrainerHome"));
const MemberManagement = lazy(() => import("./pages/trainer/MemberManagement"));
const SessionRequests = lazy(() => import("./pages/trainer/SessionRequests"));
const MySessions = lazy(() => import("./pages/trainer/MySessions"));
const WorkoutPlans = lazy(() => import("./pages/trainer/WorkoutPlans"));
const MemberProgress = lazy(() => import("./pages/trainer/MemberProgress"));
const History = lazy(() => import("./pages/trainer/History"));
const Availability = lazy(() => import("./pages/trainer/TrainerAvailability"));
const TrainerProfile = lazy(() => import("./pages/trainer/TrainerProfile"));
// import PendingMemberApplications from "./pages/admin/PendingMemberApplications.jsx";
// import AllMembers from "./pages/admin/AllMembers.jsx";
// import TrainersManagementLayout from "./pages/admin/TrainersManagementLayout.jsx";
// import PendingTrainerApplications from "./pages/admin/PendingTrainerApplications.jsx";
// import AllTrainers from "./pages/admin/AllTrainers.jsx";
// import AdminHome from "./pages/admin/AdminHome.jsx";
// import MembersManagementLayout from "./pages/admin/MembersManagementLayout.jsx";
// import CenterManagement from "./pages/admin/CenterManagement.jsx";
// import SpecialisationManagement from "./pages/admin/SpecialisationManagement.jsx"
const PendingMemberApplications = lazy(() => import("./pages/admin/PendingMemberApplications"));
const AllMembers = lazy(() => import("./pages/admin/AllMembers"));
const TrainersManagementLayout = lazy(() => import("./pages/admin/TrainersManagementLayout"));
const PendingTrainerApplications = lazy(() => import("./pages/admin/PendingTrainerApplications"));
const AllTrainers = lazy(() => import("./pages/admin/AllTrainers"));
const AdminHome = lazy(() => import("./pages/admin/AdminHome"));
const MembersManagementLayout = lazy(() => import("./pages/admin/MembersManagementLayout"));
const CenterManagement = lazy(() => import("./pages/admin/CenterManagement"));
const SpecialisationManagement = lazy(() => import("./pages/admin/SpecialisationManagement"));
function App() {
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
        {/* Suspense wraps the entire routing tree */}
        <Suspense
          fallback={
            <Backdrop open={true} sx={{ color: "#fff", zIndex: (t) => t.zIndex.drawer + 1 }}>
              <CircularProgress color="inherit" />
            </Backdrop>
          }
        >
          <Routes>
            {/* The login page can be accessed before login, but not after login */}
            <Route
              path="/"
              element={
                !userRole ? (
                  <HomePage />
                ) : (
                  <Navigate to={getDefaultPath()} replace />
                )
              }
            />
            <Route
              path="/authenticate"
              element={
                !userRole ? (
                  <AuthenticationPage />
                ) : (
                  <Navigate to={getDefaultPath()} replace />
                )
              }
            />
            <Route
              path="/forgot-password"
              element={
                !userRole || isGoogle ? (
                  <EmailComponent />
                ) : (
                  <Navigate to={getDefaultPath()} replace />
                )
              }
            />
            <Route path="/reset-password" element={<ResetPassword />} />
            {/* Perform role access control after login */}
            {isAuthorized(userRole, ["member"]) && (
              <Route path="/member" element={<MemberLayout />}>
                <Route
                  index
                  element={<Navigate to="/member/trainers" replace />}
                />
                <Route path="trainers" element={<Trainers />} />
                <Route path="sessions" element={<Sessions />} />
                <Route path="locations" element={<Locations />} />
              </Route>
            )}
            {isAuthorized(userRole, ["trainer"]) && (
              <Route path="/trainer" element={<TrainerLayout />}>
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
              <Route path="/admin" element={<AdminLayout />}>
                <Route index element={<Navigate to="/admin/home" replace />} />
                <Route path="home" element={<AdminHome />} />
                <Route path="members" element={<MembersManagementLayout />}>
                  <Route
                    index
                    element={<Navigate to="pending-applications" replace />}
                  />
                  <Route
                    path="pending-applications"
                    element={<PendingMemberApplications />}
                  />
                  <Route path="all" element={<AllMembers />} />
                </Route>
                <Route path="trainers" element={<TrainersManagementLayout />}>
                  <Route
                    index
                    element={<Navigate to="pending-applications" replace />}
                  />
                  <Route
                    path="pending-applications"
                    element={<PendingTrainerApplications />}
                  />
                  <Route path="all" element={<AllTrainers />} />
                </Route>
                <Route path="centers" element={<CenterManagement />} />
                <Route path="specialisations" element={<SpecialisationManagement />} />
              </Route>
            )}
            <Route
              path="*"
              element={
                !userRole ? (
                  <Navigate to="/authenticate" replace />
                ) : (
                  <Navigate to={getDefaultPath()} replace />
                )
              }
            />
          </Routes>
        </Suspense>
      </SnackbarProvider>
      {/* The global load circle */}
      <Backdrop
        open={loading}
        sx={{ color: "#fff", zIndex: (theme) => theme.zIndex.drawer + 1 }}
      >
        <CircularProgress color="inherit" />
      </Backdrop>
    </ThemeProvider>
  );
}

export default App;
