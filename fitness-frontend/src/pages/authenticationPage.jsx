import React, { useState, useEffect } from "react";
import { Box, Tabs, Tab, Paper, Typography } from "@mui/material";
import Grid from "@mui/material/Grid2";
import { useLocation } from "react-router-dom";
import SignupForm from "../components/sign-up/signupForm";
import LoginForm from "../components/login/loginForm";
import VerificationForm from "../components/verification/verificationForm";
import FitnessCenterIcon from "@mui/icons-material/FitnessCenter";
import MonitorHeartIcon from "@mui/icons-material/MonitorHeart";
import GroupIcon from "@mui/icons-material/Group";
import AssessmentIcon from "@mui/icons-material/Assessment";
import "./authenticationPage.css";

const AuthenticationPage = () => {
  const location = useLocation();
  const queryParams = new URLSearchParams(location.search);
  const role = queryParams.get("role") || "member"; // Default to 'member' if no role is passed

  const [activeTab, setActiveTab] = useState(0); // 0 -> Signup, 1 -> Login
  const [isVerificationVisible, setVerificationVisible] = useState(false);
  const [email, setEmail] = useState("");

  useEffect(() => {
    // If role exists, update UI messages
    console.log(`Current Role: ${role}`);
  }, [role]);

  const handleTabChange = (event, newValue) => {
    setActiveTab(newValue);
    setVerificationVisible(false); // Reset verification form visibility when switching tabs
  };

  const handleAuthSubmit = (data) => {
    console.log("Form submitted with: ", data);
    setEmail(data.email);
    setVerificationVisible(true);
  };

  const handleVerificationSuccess = () => {
    setVerificationVisible(false);
    setActiveTab(1); // Redirect to login tab after verification
  };

  return (
    <Grid container sx={{ height: "100vh" }}>
      {/* Left side with blue background */}
      <Grid
        xs={12}
        md={6}
        sx={{
          width: "50%",
          backgroundColor: "#023047",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          flexDirection: "column",
          textAlign: "center",
          paddingBottom: "5%",
        }}
      >
        <Typography variant="h4" color="#f4d35e" fontWeight="600" gutterBottom>
          {role === "trainer" ? "Empower Your Clients" : "Achieve Your Fitness Goals"}
        </Typography>
        {role === "trainer" ? (
          <>
            <Box display="flex" alignItems="center" gap={1} mb={2}>
              <GroupIcon fontSize="large" sx={{ color: "#f4d35e" }} />
              <Typography variant="h6" color="white">Manage your clients</Typography>
            </Box>
            <Box display="flex" alignItems="center" gap={1} mb={2}>
              <FitnessCenterIcon fontSize="large" sx={{ color: "#f4d35e" }} />
              <Typography variant="h6" color="white">Assign personalized workouts</Typography>
            </Box>
            <Box display="flex" alignItems="center" gap={1} mb={2}>
              <AssessmentIcon fontSize="large" sx={{ color: "#f4d35e" }} />
              <Typography variant="h6" color="white">Track client progress</Typography>
            </Box>
          </>
        ) : (
          <>
            <Box display="flex" alignItems="center" gap={1} mb={2}>
              <GroupIcon fontSize="large" sx={{ color: "#f4d35e" }} />
              <Typography variant="h6" color="white">Connect with trainers</Typography>
            </Box>
            <Box display="flex" alignItems="center" gap={1} mb={2}>
              <FitnessCenterIcon fontSize="large" sx={{ color: "#f4d35e" }} />
              <Typography variant="h6" color="white">Track your workouts</Typography>
            </Box>
            <Box display="flex" alignItems="center" gap={1} mb={2}>
              <MonitorHeartIcon fontSize="large" sx={{ color: "#f4d35e" }} />
              <Typography variant="h6" color="white">Monitor your progress</Typography>
            </Box>
          </>
        )}
      </Grid>

      {/* Right side with form */}
      <Grid
        xs={12}
        md={6}
        sx={{
          width: "50%",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          flexDirection: "column",
        }}
      >
        <Paper elevation={3} sx={{ paddingBottom: "16px", borderRadius: 2, textAlign: "center" }}>
          {isVerificationVisible ? (
            <VerificationForm onVerified={handleVerificationSuccess} email={email} />
          ) : (
            <>
              <Typography className="tabHeaders" variant="h5" gutterBottom sx={{ marginTop: "0.35em" }}>
                {activeTab === 0
                  ? role === "trainer"
                    ? "Join as a Trainer!"
                    : "Join as a Member!"
                  : "Welcome Back!"}
              </Typography>
              <Tabs value={activeTab} onChange={handleTabChange} centered>
                <Tab className="tab" label="Register" />
                <Tab className="tab" label="Login" />
              </Tabs>
              <Box>
                {activeTab === 0 ? (
                  <SignupForm onSubmit={handleAuthSubmit} role={role} />
                ) : (
                  <LoginForm onSubmit={handleAuthSubmit} role={role} />
                )}
              </Box>
            </>
          )}
        </Paper>
      </Grid>
    </Grid >
  );
};

export default AuthenticationPage;
