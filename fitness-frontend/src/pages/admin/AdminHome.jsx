import React from "react";
import { Box, Typography, Grid, Paper } from "@mui/material";
import PeopleAltIcon from "@mui/icons-material/PeopleAlt";
import FitnessCenterIcon from "@mui/icons-material/FitnessCenter";
import EventNoteIcon from "@mui/icons-material/EventNote";

const StatCard = ({ title, value, icon }) => (
  <Paper
    elevation={3}
    sx={{
      padding: 3,
      display: "flex",
      alignItems: "center",
      justifyContent: "space-between",
      borderRadius: 2,
    }}
  >
    <Box>
      <Typography variant="h6" color="textSecondary">
        {title}
      </Typography>
      <Typography variant="h4" fontWeight={600}>
        {value}
      </Typography>
    </Box>
    <Box sx={{ fontSize: 40, color: "primary.main" }}>{icon}</Box>
  </Paper>
);

const AdminHome = () => {
  return (
    <Box>
      <Typography variant="h4" fontWeight={600} gutterBottom>
        Welcome, Admin 👋
      </Typography>
      <Typography variant="subtitle1" gutterBottom color="textSecondary">
        Here's an overview of your platform’s activity
      </Typography>

      <Grid container spacing={3}>
        <Grid item xs={12} sm={6} md={4}>
          <StatCard
            title="Total Members"
            value="124"
            icon={<PeopleAltIcon fontSize="inherit" />}
          />
        </Grid>
        <Grid item xs={12} sm={6} md={4}>
          <StatCard
            title="Total Trainers"
            value="18"
            icon={<FitnessCenterIcon fontSize="inherit" />}
          />
        </Grid>
        <Grid item xs={12} sm={6} md={4}>
          <StatCard
            title="Sessions This Week"
            value="47"
            icon={<EventNoteIcon fontSize="inherit" />}
          />
        </Grid>
        <Grid item xs={12} sm={6} md={4}>
          <StatCard
            title="Pending Members"
            value="5"
            icon={
              <PeopleAltIcon
                fontSize="inherit"
                sx={{ color: "warning.main" }}
              />
            }
          />
        </Grid>
        <Grid item xs={12} sm={6} md={4}>
          <StatCard
            title="Pending Trainers"
            value="3"
            icon={
              <FitnessCenterIcon
                fontSize="inherit"
                sx={{ color: "warning.main" }}
              />
            }
          />
        </Grid>
      </Grid>
    </Box>
  );
};

export default AdminHome;
