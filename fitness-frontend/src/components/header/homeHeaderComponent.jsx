import React from "react";
import { AppBar, Toolbar, Typography, Tabs, Tab } from "@mui/material";

const Header = ({ onTabClick }) => {
  const tabs = [
    { label: "Member", role: "member" },
    { label: "Trainer", role: "trainer" },
    { label: "Admin", role: "admin" }
  ];
  const [tabValue, setTabValue] = React.useState(0);
  return (
    <AppBar position="static" sx={{ backgroundColor: "#023047", padding: "2px 20px", height: "10vh", display: "flex", flexDirection: "column", justifyContent: "center" }}>
      <Toolbar sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", color: "#fff" }}>
        {/* Application Name */}
        <Typography variant="h4" sx={{ color: "white", fontWeight: "bold" }}>
          FitQuest
        </Typography>

        {/* Navigation Tabs */}
        <Tabs value={tabValue} aria-label="navigation tabs" onChange={(event, newValue) => setTabValue(newValue)}
          textColor="inherit"            // Let all the text use the color of the parent container (AppBar)
        // indicatorColor="secondary"     // The underline is in secondary color
        >
          {tabs.map((tab, index) => (
            <Tab
              key={index}
              label={tab.label}
              value={index}
              onClick={() => onTabClick(tab.role)}
              sx={{
                color: "white",
                "&:hover": { color: "#f4d35e", textDecoration: "underline" }
              }}
            />
          ))}
        </Tabs>
      </Toolbar>
    </AppBar >
  );
};

export default Header;