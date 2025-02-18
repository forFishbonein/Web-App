import React from "react";
import { AppBar, Toolbar, Typography, Tabs, Tab } from "@mui/material";

const Header = ({ onTabClick }) => {
  const tabs = [
    { label: "Member", role: "member" },
    { label: "Trainer", role: "trainer" }
  ];

  return (
    <AppBar position="static" sx={{ backgroundColor: "#023047", padding: "2px 20px" }}>
      <Toolbar sx={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        {/* Application Name */}
        <Typography variant="h4" sx={{ color: "white", fontWeight: "bold" }}>
          FitQuest
        </Typography>

        {/* Navigation Tabs */}
        <Tabs aria-label="navigation tabs">
          {tabs.map((tab, index) => (
            <Tab
              key={index}
              label={tab.label}
              onClick={() => onTabClick(tab.role)}
              sx={{
                color: "white",
                "&:hover": { color: "#f4d35e", textDecoration: "underline" }
              }}
            />
          ))}
        </Tabs>
      </Toolbar>
    </AppBar>
  );
};

export default Header;