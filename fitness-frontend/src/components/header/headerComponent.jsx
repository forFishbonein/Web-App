import React from "react";
import { Tabs, Tab, Box } from "@mui/material";

const Header = ({ tabs, onTabClick }) => {

  return (
    <Box
      sx={{
        backgroundColor: "#023047",
        padding: "10px 10px",
      }}
    >
      <Tabs
        aria-label="navigation tabs"
      >
        {tabs.map((tab, index) => (
          <Tab
            key={index}
            label={tab.label}
            onClick={() => onTabClick(tab.role)}
            sx={{
              color: "white",
              "&:hover": { color: "#f4d35e",textDecoration: "underline" }
            }}
          />
        ))}
      </Tabs>
    </Box>
  );
};

export default Header;
