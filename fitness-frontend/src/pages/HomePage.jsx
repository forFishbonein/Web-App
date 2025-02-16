import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Box, Button, Typography } from "@mui/material";
import Header from "../components/header/headerComponent";
import Footer from "../components/footer/footerComponent";
import image from "../assets/strengthImage.jpg";

const HomePage = () => {
  const navigate = useNavigate();
  const [selectedRole, setSelectedRole] = useState("");

  const tabs = [
    { label: "Member", role: "member" },
    { label: "Trainer", role: "trainer" },
  ];

  const handleTabClick = (role) => {
    setSelectedRole(role);
    navigate(`/authenticate?role=${role}`); // Pass role as query param
  };

  return (
    <div>
      <Header tabs={tabs} onTabClick={handleTabClick} />

      <Box
        sx={{
          height: "64vh",
          position: "relative",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          textAlign: "center",
          color: "white",
          padding: "20px",
        }}
      >
        {/* Overlay to Improve Readability */}
        <Box
          sx={{
            position: "absolute",
            top: 0,
            left: 0,
            width: "100%",
            height: "100%",
            backgroundImage: `url(${image})`,
            backgroundSize: "cover",
            backgroundPosition: "center",
            opacity: 0.4, // Background image opacity
            zIndex: -1, // Ensures it stays behind text
          }}
        />

        {/* Headline */}
        <Typography variant="h2" fontWeight="bold" sx={{ mb: 2, color: "#023047" }}>
          Your Fitness Journey Starts Here!
        </Typography>

        {/* Subheadline */}
        <Typography variant="h5" sx={{ marginBottom: "20px", maxWidth: "60%", color: "#023047", fontSize: "1.8em" }}>
          Achieve Your Goals with Personalized Training & Progress Tracking!
        </Typography>

        {/* CTA Button */}
        <Button
          variant="contained"
          size="large"
          sx={{
            backgroundColor: "#023047",
            color: "#f4d35e",
            fontWeight: "bold",
            padding: "10px 20px",
            fontSize: "18px",
            borderRadius: "8px",
            "&:hover": { backgroundColor: "#ffcc4d" },
          }}
          onClick={() => navigate("/authenticate")}
        >
          Join Now
        </Button>
      </Box>

      <Footer />
    </div>
  );
};

export default HomePage;