import React, { useState } from "react";
import { ThemeProvider } from "@mui/material/styles";
import CssBaseline from "@mui/material/CssBaseline";
import theme from "./theme";
import "./index.css";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
import AuthenticationPage from "./pages/authenticationPage";
import HomePage from "./pages/HomePage";
import MemberLayout from "./pages/member/MemberLayout";
import Trainers from "./pages/member/Trainers";
import Sessions from "./pages/member/Sessions";
function App() {
  const isAuthenticated = false; // Replace with actual authentication logic

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Router>
        {/* <Routes>
          <Route path="/member" element={<MemberLayout />}>
            <Route index element={<Navigate to="/member/trainers" replace />} />
            <Route path="trainers" element={<Trainers />} />
            <Route path="sessions" element={<Sessions />} />
          </Route>
        </Routes> */}
        {isAuthenticated ? (
          <>
            <Routes>
              <Route path="/member" element={<Home />} />
              {/* <Route path="/home" element={<Home />} /> */}
              {/* Catch all unhandled routes */}
              {/* <Route path="*" element={<Navigate to="/" />} /> */}
            </Routes>
          </>
        ) : (
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/authenticate" element={<AuthenticationPage />} />
            {/* Redirect all non-authenticated users to login */}
            <Route path="*" element={<Navigate to="/authenticate" />} />
          </Routes>
        )}
      </Router>
    </ThemeProvider>
  );
}

export default App;
