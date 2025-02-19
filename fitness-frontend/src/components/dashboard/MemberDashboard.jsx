import React from "react";
import { useNavigate, useLocation } from "react-router-dom";
import Box from "@mui/material/Box";
import IconButton from "@mui/material/IconButton";
import Button from "@mui/material/Button";
import Badge from "@mui/material/Badge";
import NotificationsIcon from "@mui/icons-material/Notifications";
import Header from "../header/headerComponent";
// Define navigation menu items
const pages = [
  { name: "Trainers", path: "/member/trainers" },
  // { name: "Applications", path: "/member/applications" },
  { name: "Sessions", path: "/member/sessions" }
];


function MemberDashboard() {
  const navigate = useNavigate();
  const location = useLocation(); // get now router

  return (
    <Header>
      {/* Web navigation menu */}
      <Box sx={{ flexGrow: 1, display: "flex", marginLeft: 5 }}>
        {pages.map((page) => (
          <Button
            key={page.name}
            variant="text"
            onClick={() => navigate(page.path)} // Navigate to corresponding page
            sx={{
              my: 2,
              display: "block",
              marginRight: 2,
              fontSize: "16px",
              color: location.pathname === page.path ? "white" : "gray",
              "&:hover": { color: location.pathname !== page.path ? "lightgray" : "white", backgroundColor: "transparent" },
              "&:focus": {
                backgroundColor: "transparent"
              }
            }}
          >
            {page.name}
          </Button>
        ))}
      </Box>

      {/* Notification icon */}
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

export default MemberDashboard;
