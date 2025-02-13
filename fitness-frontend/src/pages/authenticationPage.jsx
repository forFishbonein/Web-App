import React, { useState } from "react";
import { Box, Tabs, Tab, Paper, Grid, Typography } from "@mui/material";
import SignupForm from "../components/sign-up/signupForm";
import LoginForm from "../components/login/loginForm";
import VerificationForm from "../components/verification/verificationForm";
import "./authenticationPage.css";

const AuthenticationPage = () => {
  const [activeTab, setActiveTab] = useState(0); // 0 -> Signup, 1 -> Login
  const [isVerificationVisible, setVerificationVisible] = useState(false);
  const [email, setEmail] = useState("");
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
        item
        xs={12}
        md={6}
        sx={{
          backgroundColor: "#224a95",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          flexDirection: "column",
          textAlign: "center",
          paddingBottom: "5%",
        }}
      >
        <Typography variant="h4" color="white" fontWeight="400">
          Fitness App
        </Typography>
      </Grid>

      {/* Right side with form */}
      <Grid
        item
        xs={12}
        md={6}
        sx={{
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          flexDirection: "column",
        }}
      >
        <Paper elevation={3} sx={{ paddingBottom: "16px", paddingTop: "5px", borderRadius: 2, textAlign: "center" }}>
          {isVerificationVisible ? (
            <VerificationForm onVerified={handleVerificationSuccess} email={email}/>
          ) : (
            <>
              <Typography className="tabHeaders" variant="h5" gutterBottom>
                {activeTab === 0
                  ? "Hello!"
                  : "Welcome Back!"}
              </Typography>
              <Tabs value={activeTab} onChange={handleTabChange} centered>
                <Tab className="tab" label="Sign up" />
                <Tab className="tab" label="Login" />
              </Tabs>
              <Box>
                {activeTab === 0 ? (
                  <SignupForm onSubmit={handleAuthSubmit} />
                ) : (
                  <LoginForm onSubmit={handleAuthSubmit} />
                )}
              </Box>
            </>
          )}
        </Paper>
      </Grid>
    </Grid>
  );
};

export default AuthenticationPage;
