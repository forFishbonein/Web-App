import React from "react";
import Box from "@mui/material/Box";
import IconButton from "@mui/material/IconButton";
import Badge from "@mui/material/Badge";
import NotificationsIcon from "@mui/icons-material/Notifications";
import Header from "../header/headerComponent";

function TrainerDashboard({ drawerOpen }) {
  return (
    <Header drawerOpen={drawerOpen}>
      <Box sx={{ flexGrow: 0, mr: 2 }}>
        <IconButton size="large" color="inherit">
          <Badge badgeContent={17} color="error">
            <NotificationsIcon />
          </Badge>
        </IconButton>
      </Box>
    </Header>
  );
}

export default TrainerDashboard;
