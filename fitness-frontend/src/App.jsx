import React, { useState } from "react";
import "./index.css";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
import AuthenticationPage from "./pages/authenticationPage";
import HomePage from "./pages/HomePage";

function App() {
  const isAuthenticated = false; // Replace with actual authentication logic

  return (
      <Router>
        {isAuthenticated ? (
          <>
            <Routes>
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
  );
}

export default App;
