import React from "react";
import { AppBar, Toolbar, Typography, Avatar } from "@mui/material";

const Header = ({ firstName, lastName }) => {
  // Generate avatar initials
  const initials = `${firstName?.charAt(0) ?? ""}${lastName?.charAt(0) ?? ""}`;

  return (
    <AppBar position="static" sx={{ backgroundColor: "#023047", padding: "2px 20px" }}>
      <Toolbar sx={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        {/* Application Name */}
        <Typography variant="h4" sx={{ color: "white", fontWeight: "bold" }}>
          FitQuest
        </Typography>

        {/* User Avatar with Initials */}
        <Avatar sx={{ bgcolor: "#f4d35e", color: "#023047", fontWeight: "bold", cursor: "pointer" }}>
          {initials.toUpperCase()}
        </Avatar>
      </Toolbar>
    </AppBar>
  );
};

export default Header;
