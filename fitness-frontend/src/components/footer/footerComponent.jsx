import React from "react";
import {
  Box,
  Container,
  Grid,
  Typography,
  Link,
  Stack,
  Divider,
  IconButton,
} from "@mui/material";
import FacebookIcon from "@mui/icons-material/Facebook";
import InstagramIcon from "@mui/icons-material/Instagram";
import TwitterIcon from "@mui/icons-material/Twitter";
import YouTubeIcon from "@mui/icons-material/YouTube";
import LocationOnIcon from "@mui/icons-material/LocationOn";
import EmailIcon from "@mui/icons-material/Email";
import PhoneIcon from "@mui/icons-material/Phone";

const Footer = () => {
  return (
    <Box
      component="footer"
      sx={{
        height: "25vh",
        backgroundColor: "#023047",
        color: "white",
        display: "flex",
        flexDirection: "column",
        justifyContent: "space-between",
      }}
    >
      <Container maxWidth="lg" sx={{ flexGrow: 1, display: "flex", alignItems: "flex-start", padding: "10px" }}>
        <Grid
          container
          justifyContent="space-between"
          alignItems="flex-start"
          spacing={{ xs: 2, sm: 4, md: 6 }}  // 全局列间距
        >
          {/* Quick Links */}
          <Grid item xs={12} sm={4} sx={{ px: { xs: 1, sm: 2, md: 3 } }}>
            <Typography variant="h6" gutterBottom>
              Quick Links
            </Typography>
            <Stack spacing={1.5}>
              {["About", "Contact", "Privacy Policy", "Terms of Use"].map((text) => (
                <Link
                  key={text}
                  href="#"
                  color="inherit"
                  underline="hover"
                  sx={{ "&:hover": { color: "#f4d35e" } }}
                >
                  {text}
                </Link>
              ))}
            </Stack>
          </Grid>

          {/* Social Media */}
          <Grid item xs={12} sm={4} sx={{ px: { xs: 1, sm: 2, md: 3 } }}>
            <Typography variant="h6" gutterBottom>
              Follow Us
            </Typography>
            <Stack direction="row" spacing={2}>
              {[FacebookIcon, InstagramIcon, TwitterIcon, YouTubeIcon].map((Icon, idx) => (
                <IconButton
                  key={idx}
                  href="#"
                  color="inherit"
                  sx={{
                    bgcolor: "rgba(255,255,255,0.2)",
                    "&:hover": { bgcolor: "rgba(255,255,255,0.35)" },
                    width: 40,
                    height: 40,
                  }}
                >
                  <Icon fontSize="small" />
                </IconButton>
              ))}
            </Stack>
          </Grid>

          {/* Contact Details */}
          <Grid item xs={12} sm={4} sx={{ px: { xs: 1, sm: 2, md: 3 } }}>
            <Typography variant="h6" gutterBottom>
              Contact Us
            </Typography>
            <Stack spacing={1.5}>
              <Typography variant="body2" sx={{ display: "flex", alignItems: "center" }}>
                <LocationOnIcon sx={{ mr: 1 }} fontSize="small" />
                123 Fitness St, City, Country
              </Typography>
              <Typography variant="body2" sx={{ display: "flex", alignItems: "center" }}>
                <EmailIcon sx={{ mr: 1 }} fontSize="small" />
                support@fitnessapp.com
              </Typography>
              <Typography variant="body2" sx={{ display: "flex", alignItems: "center" }}>
                <PhoneIcon sx={{ mr: 1 }} fontSize="small" />
                +123 456 7890
              </Typography>
            </Stack>
          </Grid>
        </Grid>
      </Container>

      <Divider sx={{ borderColor: "rgba(255,255,255,0.25)" }} />

      <Typography variant="body2" align="center" sx={{ py: 1, fontSize: "0.875rem" }}>
        &copy; {new Date().getFullYear()} Fitness App. All rights reserved.
      </Typography>
    </Box>
  );
};

export default Footer;
