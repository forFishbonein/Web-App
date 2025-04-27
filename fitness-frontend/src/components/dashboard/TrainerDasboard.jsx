// import React from "react";
// import Box from "@mui/material/Box";
// import IconButton from "@mui/material/IconButton";
// import Badge from "@mui/material/Badge";
// import NotificationsIcon from "@mui/icons-material/Notifications";
// import Header from "../header/headerComponent";

// function TrainerDashboard({ drawerOpen }) {
//   return (
//     <Header drawerOpen={drawerOpen}>
//       <Box sx={{ flexGrow: 0, mr: 2 }}>
//         <IconButton size="large" color="inherit">
//           <Badge badgeContent={17} color="error">
//             <NotificationsIcon />
//           </Badge>
//         </IconButton>
//       </Box>
//     </Header>
//   );
// }

// export default TrainerDashboard;
import React, { useState, useEffect } from "react";
import { Box, IconButton, Badge, Popover } from "@mui/material";
import NotificationsIcon from "@mui/icons-material/Notifications";
import Header from "../header/headerComponent";
import useNotificationApi from "../../apis/notification";
import MemberNotification from "../notification/MemberNotification"; // Using MemberNotification for now

function TrainerDashboard({ drawerOpen }) {
  const [anchorEl, setAnchorEl] = useState(null);
  const [badgeContent, setBadgeContent] = useState(0);

  const { getNotificationList, markNotificationAsRead, deleteNotification } = useNotificationApi();

  const handleClick = (event) => {
    setAnchorEl(event.currentTarget.parentElement);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const open = Boolean(anchorEl);
  const id = open ? "trainer-notification-popover" : undefined;

  const fetchNotifications = async () => {
    try {
      const res = await getNotificationList(1, 10000);
      const unreadCount = res.data.records.filter((e) => e.isRead === false).length;
      setBadgeContent(unreadCount);
    } catch (error) {
      console.error("Failed to fetch notifications", error);
    }
  };

  useEffect(() => {
    fetchNotifications();

    // Auto-refresh notifications every 30 seconds
    const interval = setInterval(() => {
      fetchNotifications();
    }, 30000);

    return () => clearInterval(interval);
  }, []);

  return (
    <div style={{ position: "fixed", top: "0", zIndex: "10000", width: "100%" }}>
      <Header drawerOpen={drawerOpen}>
        {/* Notification Bell */}
        <Box sx={{
          flexGrow: 1, display: "flex",
          justifyContent: "flex-end",
          mr: 2
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
        <MemberNotification
          getNotificationList={getNotificationList}
          markNotificationAsRead={markNotificationAsRead}
          setBadgeContent={setBadgeContent}
          badgeContent={badgeContent}
          deleteNotification={deleteNotification}
        />
      </Popover>
    </div>
  );
}

export default TrainerDashboard;
