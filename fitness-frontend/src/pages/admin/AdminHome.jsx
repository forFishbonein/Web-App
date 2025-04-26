import React, {useState, useEffect} from "react";
import { Box, Typography, Grid, Paper } from "@mui/material";
import PeopleAltIcon from "@mui/icons-material/PeopleAlt";
import FitnessCenterIcon from "@mui/icons-material/FitnessCenter";
import EventNoteIcon from "@mui/icons-material/EventNote";
import useAdminApi from "../../apis/admin";

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
  const { getPendingUsers } = useAdminApi();
  
  const [pendingMembers, setPendingMembers] = useState(0);
  const [pendingTrainers, setPendingTrainers] = useState(0);

  const [totalMembers, setTotalMembers] = useState(0);
  const [totalTrainers, setTotalTrainers] = useState(0);

  const fetchPendingCounts = async () => {
    try {
      // Pending
      const res = await getPendingUsers();
      const records = res.data?.records || [];

      const pendingMembersCount = records.filter((user) => user.role === "member").length;
      const pendingTrainersCount = records.filter((user) => user.role === "trainer").length;

      setPendingMembers(pendingMembersCount);
      setPendingTrainers(pendingTrainersCount);

      // Total
      const allRes = await getAllUsers();
      const allUsers = allRes.data?.records || [];

      const totalMembersCount = allUsers.filter((user) => user.role === "member").length;
      const totalTrainersCount = allUsers.filter((user) => user.role === "trainer").length;

      setTotalMembers(totalMembersCount);
      setTotalTrainers(totalTrainersCount);
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
          />
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <StatCard
            title="Total Members"
            value={totalMembers}
            icon={<PeopleAltIcon fontSize="inherit" />}
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
          />
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <StatCard
            title="Total Trainers"
            value={totalTrainers}
            icon={<FitnessCenterIcon fontSize="inherit" />}
          />
        </Grid>
      </Grid>
    </Box>
  );
};

export default AdminHome;
