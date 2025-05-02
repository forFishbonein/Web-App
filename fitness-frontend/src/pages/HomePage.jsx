import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Box, Button, Typography, useTheme, useMediaQuery } from "@mui/material";
import Header from "../components/header/homeHeaderComponent";
import Footer from "../components/footer/footerComponent";
import image from "../assets/strengthImage.jpg";

const HomePage = () => {
  const navigate = useNavigate();
  const [selectedRole, setSelectedRole] = useState("");

  const theme = useTheme();
  const isSmallScreen = useMediaQuery(theme.breakpoints.down("sm"));
  const isMediumScreen = useMediaQuery(theme.breakpoints.between("sm", "md"));

  const handleTabClick = (role) => {
    setSelectedRole(role);
    navigate(`/authenticate?role=${role}${role === "admin" ? "&activeTab=1" : ""}`);
  };

  return (
    <div>
      <Header onTabClick={handleTabClick} />

      <Box
        sx={{
          height: "65vh",
          position: "relative",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          textAlign: "center",
          color: "white",
          padding: { xs: 2, sm: 4 },
        }}
      >
        {/* Background Overlay */}
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
            opacity: 0.4,
            zIndex: -1,
          }}
        />

        {/* Main Headline */}
        <Typography
          variant={isSmallScreen ? "h4" : isMediumScreen ? "h3" : "h2"}
          fontWeight="bold"
          sx={{ mb: 2, color: "#023047", px: 1 }}
        >
          Your Fitness Journey Starts Here!
        </Typography>

        {/* Subheadline */}
        <Typography
          variant="h6"
          sx={{
            marginBottom: 3,
            maxWidth: { xs: "90%", sm: "80%", md: "60%" },
            color: "#023047",
            fontSize: { xs: "1.2rem", sm: "1.5rem", md: "1.8rem" },
            px: 1,
          }}
        >
          Achieve Your Goals with Personalized Training & Progress Tracking!
        </Typography>

        {/* Call-to-Action Button */}
        <Button
          variant="contained"
          size="large"
          sx={{
            backgroundColor: "#023047",
            color: "#f4d35e",
            fontWeight: "bold",
            padding: { xs: "8px 16px", sm: "10px 20px" },
            fontSize: { xs: "1rem", sm: "1.125rem" },
            borderRadius: "8px",
            "&:hover": { textDecoration: "underline" },
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