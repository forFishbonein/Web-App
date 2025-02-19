import React from "react";
import { Box, Typography, Link } from "@mui/material";
import Grid from "@mui/material/Grid2";
import FacebookIcon from "@mui/icons-material/Facebook";
import InstagramIcon from "@mui/icons-material/Instagram";
import TwitterIcon from "@mui/icons-material/Twitter";
import YouTubeIcon from "@mui/icons-material/YouTube";;

const Footer = () => {
  return (
    <Box
      sx={{
        backgroundColor: "#023047", // Dark blue background
        color: "white",
        textAlign: "center",
      }}
    >
      <Grid container spacing={3} justifyContent="space-around">
        {/* Quick Links */}
        <Grid item xs={12} sm={4}>
          <Typography variant="h6" gutterBottom>
            Quick Links
          </Typography>
            <Link
              href="#"
              color="inherit"
              sx={{
                display: "block",
                textDecoration: "none",
                "&:hover": { color: "#f4d35e" },
              }}
            >
              About
            </Link>
            <Link
              href="#"
              color="inherit"
              sx={{
                display: "block",
                textDecoration: "none",
                "&:hover": { color: "#f4d35e" },
              }}
            >
              Contact
            </Link>
            <Link
              href="#"
              color="inherit"
              sx={{
                display: "block",
                textDecoration: "none",
                "&:hover": { color: "#f4d35e" },
              }}
            >
              Privacy Policy
            </Link>
            <Link
              href="#"
              color="inherit"
              sx={{
                display: "block",
                textDecoration: "none",
                "&:hover": { color: "#f4d35e" },
              }}
            >
              Terms of Use
            </Link>
        </Grid>

        {/* Social Media */}
        <Grid item xs={12} sm={4}>
          <Typography variant="h6" gutterBottom>
            Follow Us
          </Typography>
          <Box sx={{ display: "flex", justifyContent: "center", gap: 2 }}>
            <Link href="#" color="inherit" sx={{ "&:hover": { color: "#f4d35e" } }}>
              <FacebookIcon fontSize="large" />
            </Link>
            <Link href="#" color="inherit" sx={{ "&:hover": { color: "#f4d35e" } }}>
              <InstagramIcon fontSize="large" />
            </Link>
            <Link href="#" color="inherit" sx={{ "&:hover": { color: "#f4d35e" } }}>
              <TwitterIcon fontSize="large" />
            </Link>
            <Link href="#" color="inherit" sx={{ "&:hover": { color: "#f4d35e" } }}>
              <YouTubeIcon fontSize="large" />
            </Link>
          </Box>
        </Grid>

        {/* Contact Details */}
        <Grid item xs={12} sm={4}>
          <Typography variant="h6" gutterBottom>
            Contact Us
          </Typography>
          <Typography variant="body2">
            📍 123 Fitness St, City, Country
          </Typography>
          <Typography variant="body2">📧 support@fitnessapp.com</Typography>
          <Typography variant="body2">📞 +123 456 7890</Typography>
        </Grid>
      </Grid>

      {/* Copyright */}
      <Typography variant="body2" sx={{ marginTop: "10px" }}>
        &copy; {new Date().getFullYear()} Fitness App. All rights reserved.
      </Typography>
    </Box>
  );
};

export default Footer;
