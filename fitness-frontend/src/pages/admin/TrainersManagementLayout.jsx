import React from "react";
import { Box, Tabs, Tab, Paper } from "@mui/material";
import { useLocation, useNavigate, Outlet } from "react-router-dom";

const tabPaths = ["/admin/Trainers/pending-applications", "/admin/Trainers/all"];

const TrainersManagementLayout = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const currentTab = tabPaths.findIndex((path) => location.pathname === path);

  const handleTabChange = (e, newValue) => {
    navigate(tabPaths[newValue]);
  };

  return (
    <Box>
      <Paper
        elevation={1}
        sx={{
          mb: 2,
          borderRadius: 1,
          overflow: "hidden",
          backgroundColor: "primary.main",
        }}
      >
        <Tabs
          value={currentTab}
          onChange={handleTabChange}
          variant="fullWidth"
          TabIndicatorProps={{
            style: {
              height: "4px",
              backgroundColor: "#ffffff", // white underline
            },
          }}
          sx={{
            "& .MuiTab-root": {
              textTransform: "none",
              fontWeight: 600,
              fontSize: 16,
              color: "primary.contrastText", // white text
              py: 1.5,
            },
            "& .Mui-selected": {
              backgroundColor: "rgba(255, 255, 255, 0.15)", // subtle white shade
            },
            "& .MuiTabs-flexContainer": {
              justifyContent: "space-between",
            },
          }}
        >
          <Tab label="Pending Applications" />
          <Tab label="All Trainers" />
        </Tabs>
      </Paper>

      <Outlet />
    </Box>
  );
};

export default TrainersManagementLayout;
