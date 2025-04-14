import React, { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import Box from "@mui/material/Box";
import IconButton from "@mui/material/IconButton";
import Button from "@mui/material/Button";
import Badge from "@mui/material/Badge";
import NotificationsIcon from "@mui/icons-material/Notifications";
import Popover from "@mui/material/Popover";
import Typography from "@mui/material/Typography";
import Header from "../header/HeaderComponent"; // Import Admin Header
// import AdminNotification from "../notification/AdminNotification";
import useNotificationApi from "../../apis/notification";

// Define Admin Navigation Pages
const pages = [
  { name: "Dashboard Overview", path: "/admin/overview" },
  { name: "Member Management", path: "/admin/members" },
  { name: "Trainer Management", path: "/admin/trainers" },
  { name: "Session Oversight", path: "/admin/sessions" },
  { name: "Settings", path: "/admin/settings" }
];

const AdminDashboard = () => {
  const navigate = useNavigate();
  const location = useLocation(); // Get current route
  const [anchorEl, setAnchorEl] = useState(null);
  const [badgeContent, setBadgeContent] = useState(0);
  
  // Fetch Notifications
  const { getNotificationList, markNotificationAsRead, deleteNotification } = useNotificationApi();

  useEffect(() => {
    const fetchData = async () => {
      const res = await getNotificationList(1, 10000);
      setBadgeContent(res.data.records.filter(e => e.isRead === false).length);
    };
    fetchData();
  }, []);

  // Open Notification Popover
  const handleClick = (event) => {
    setAnchorEl(event.currentTarget.parentElement);
  };

  // Close Notification Popover
  const handleClose = () => {
    setAnchorEl(null);
  };

  const open = Boolean(anchorEl);
  const id = open ? "admin-popover" : undefined;

  return (
    <>
      <Header>
        {/* Admin Navigation Menu */}
        <Box sx={{ flexGrow: 1, display: "flex", marginLeft: 5 }}>
          {pages.map((page) => (
            <Button
              key={page.name}
              variant="text"
              onClick={() => navigate(page.path)}
              sx={{
                my: 2,
                display: "block",
                marginRight: 2,
                fontSize: "16px",
                textTransform: "none",
                fontWeight: "bold",
                color: location.pathname.includes(page.path) ? "white" : "gray",
                "&:hover": { color: !location.pathname.includes(page.path) ? "lightgray" : "white", backgroundColor: "transparent" },
                "&:focus": { backgroundColor: "transparent" }
              }}
            >
              {page.name}
            </Button>
          ))}
        </Box>

        {/* Notification Icon */}
        <Box sx={{
          flexGrow: 0,
          mr: 2.5,
          width: "120px",
          display: "flex",
          justifyContent: "flex-end"
        }}>
          <IconButton size="large" color="inherit" onClick={handleClick}>
            <Badge badgeContent={badgeContent} color="error">
              <NotificationsIcon />
            </Badge>
          </IconButton>
        </Box>
      </Header>

      {/* Notification Popover */}
      <Popover
        id={id}
        open={open}
        anchorEl={anchorEl}
        onClose={handleClose}
        anchorOrigin={{
          vertical: "bottom",
        }}
        keepMounted={false}
        PaperProps={{
          sx: {
            mt: 1.5,
            overflow: "visible",
            "::before": {
              content: '""',
              display: "block",
              position: "absolute",
              width: 0,
              height: 0,
              borderLeft: "8px solid transparent",
              borderRight: "8px solid transparent",
              borderBottom: "8px solid #fff",
              top: 0,
              left: "46%",
              transform: "translateX(-50%) translateY(-100%)",
            },
          },
        }}
      >
        {/* <AdminNotification
          getNotificationList={getNotificationList}
          markNotificationAsRead={markNotificationAsRead}
          setBadgeContent={setBadgeContent}
          badgeContent={badgeContent}
          deleteNotification={deleteNotification}
        /> */}
      </Popover>
    </>
  );
};

export default AdminDashboard;