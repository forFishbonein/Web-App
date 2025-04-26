import React, { useState, useEffect } from "react";
import { Box, Typography, Grid, Paper, Button } from "@mui/material";
import PeopleAltIcon from "@mui/icons-material/PeopleAlt";
import FitnessCenterIcon from "@mui/icons-material/FitnessCenter";
import EventNoteIcon from "@mui/icons-material/EventNote";
import BuildIcon from '@mui/icons-material/Build';
import useAdminApi from "../../apis/admin";
import { Link } from "react-router-dom";

const StatCard = ({ title, value, icon, linkText, linkPath, descriptionText }) => (
  <Paper
    elevation={3}
    sx={{
      padding: 3,
      display: "flex",
      flexDirection: "column",
      justifyContent: "center",
      borderRadius: 2,
      minHeight: 150,
    }}
  >
    <Box display="flex" alignItems="center" justifyContent="space-between">
      <Box>
        <Typography variant="h6" color="textSecondary">
          {title}
        </Typography>
        <Typography variant="h4" fontWeight={600}>
          {value}
        </Typography>
      </Box>
      <Box sx={{ fontSize: 40, color: "primary.main" }}>
        {icon}
      </Box>
    </Box>
    {linkText && linkPath && (
      <Box mt={2} display="flex" justifyContent="flex-end">
        <Typography variant="caption" color="textSecondary">
          Go to{" "}
          <Link to={linkPath} style={{ textDecoration: "underline", color: "#1976d2", fontWeight: 500 }}>
            {linkText}
          </Link>{" "}
          {descriptionText}
        </Typography>
      </Box>
    )}
  </Paper>
);


const AdminHome = () => {
  const {
    getPendingUsers,
    getAllUsers,
    getFitnessCentres,
    getSpecializations,
  } = useAdminApi();

  const [pendingMembers, setPendingMembers] = useState(0);
  const [pendingTrainers, setPendingTrainers] = useState(0);

  const [totalMembers, setTotalMembers] = useState(0);
  const [totalTrainers, setTotalTrainers] = useState(0);

  const [totalCentres, setTotalCentres] = useState(0);
  const [totalSpecialisations, setTotalSpecialisations] = useState(0);

  const fetchPendingCounts = async () => {
    try {
      // Pending
      const res = await getPendingUsers();
      const records = res.data?.records || [];

      const pendingMembersCount = records.filter(
        (user) => user.role === "member"
      ).length;
      const pendingTrainersCount = records.filter(
        (user) => user.role === "trainer"
      ).length;

      setPendingMembers(pendingMembersCount);
      setPendingTrainers(pendingTrainersCount);

      // Total
      const allRes = await getAllUsers({ pageSize: "20" });
      const allUsers = allRes.data?.records || [];

      const totalMembersCount = allUsers.filter(
        (user) => user.role === "member"
      ).length;
      const totalTrainersCount = allUsers.filter(
        (user) => user.role === "trainer"
      ).length;

      setTotalMembers(totalMembersCount);
      setTotalTrainers(totalTrainersCount);

      const centresRes = await getFitnessCentres();
      const centresRecords =
        centresRes.data?.data?.records ||
        centresRes.data?.records ||
        centresRes.data ||
        [];
      setTotalCentres(centresRecords.length);

      const specialRes = await getSpecializations();
      const specialRecords =
        specialRes.data?.data?.records ||
        specialRes.data?.data ||
        specialRes.data ||
        [];
      setTotalSpecialisations(specialRecords.length);
    } catch (error) {
      console.error("Failed to fetch pending users:", error);
    }
  };

  useEffect(() => {
    fetchPendingCounts();
  }, []);

  return (
    <Box>
      <Typography variant="h4" fontWeight={600} gutterBottom>
        Welcome, Admin 👋
      </Typography>
      <Typography variant="subtitle1" gutterBottom color="textSecondary">
        Here's an overview of your platform's activity
      </Typography>

      <Grid container spacing={3}>
        <Grid item xs={12} sm={6} md={3}>
          <StatCard
            title="Pending Members"
            value={pendingMembers}
            icon={
              <PeopleAltIcon
                fontSize="inherit"
                sx={{ color: "warning.main" }}
              />
            }
            linkText="Member Management"
            linkPath="/admin/members"
            descriptionText="to view the pending requests."
          />
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <StatCard
            title="Total Members"
            value={totalMembers}
            icon={<PeopleAltIcon fontSize="inherit" />}
            linkText="Member Management"
            linkPath="/admin/members/all"
            descriptionText="to view all the members."
          />
        </Grid>

        <Grid item xs={12} sm={6} md={3}>
          <StatCard
            title="Pending Trainers"
            value={pendingTrainers}
            icon={
              <FitnessCenterIcon
                fontSize="inherit"
                sx={{ color: "warning.main" }}
              />
            }
            linkText="Trainer Management"
            linkPath="/admin/trainers"
            descriptionText="to view the pending requests."
          />
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <StatCard
            title="Total Trainers"
            value={totalTrainers}
            icon={<FitnessCenterIcon fontSize="inherit" />}
            linkText="Trainer Management"
            linkPath="/admin/trainers/all"
            descriptionText="to view all the trainers."
          />
        </Grid>
        <Grid item xs={12} sm={6} md={6}>
          <StatCard
            title="Total Fitness Centres"
            value={totalCentres}
            icon={<EventNoteIcon fontSize="inherit" />}
            linkText="Center Management"
            linkPath="/admin/centers"
            descriptionText="to view/add the centers."
          />
        </Grid>

        <Grid item xs={12} sm={6} md={6}>
          <StatCard
            title="Total Specialisations"
            value={totalSpecialisations}
            icon={<BuildIcon fontSize="inherit" />}
            linkText="Specialisation Management"
            linkPath="/admin/specialisations"
            descriptionText="to view/add the specialisations."
          />
        </Grid>
      </Grid>
    </Box>
  );
};

export default AdminHome;
