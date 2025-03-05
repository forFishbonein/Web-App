import React, { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import Box from "@mui/material/Box";
import IconButton from "@mui/material/IconButton";
import Button from "@mui/material/Button";
import Badge from "@mui/material/Badge";
import NotificationsIcon from "@mui/icons-material/Notifications";
import Header from "../header/headerComponent";
import Popover from '@mui/material/Popover';
import Typography from '@mui/material/Typography';
import MemberNotification from "../notification/MemberNotification";
import useNotificationApi from "../../apis/notification"
// Define navigation menu items
const pages = [
  { name: "Trainers", path: "/member/trainers" },
  // { name: "Applications", path: "/member/applications" },
  { name: "Sessions", path: "/member/sessions" },
  { name: "Locations", path: "/member/locations" },
];


function MemberDashboard() {
  const navigate = useNavigate();
  const location = useLocation(); // get now router
  const [anchorEl, setAnchorEl] = React.useState(null);

  const handleClick = (event) => {
    //Bind to the parent container
    setAnchorEl(event.currentTarget.parentElement);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };
  const { getNotificationList, markNotificationAsRead, deleteNotification } = useNotificationApi();
  const open = Boolean(anchorEl);
  const id = open ? 'simple-popover' : undefined;
  let [badgeContent, setBadgeContent] = useState(0);
  useEffect(() => {
    const fetchData = async () => {
      const res = await getNotificationList(1, 10000);
      setBadgeContent(res.data.records.filter(e => e.isRead === false).length)
    };
    fetchData();
  }, []);
  return (

    <>
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
                textTransform: "none",
                fontWeight: "bold",
                color: location.pathname.includes(page.path) ? "white" : "gray",
                "&:hover": { color: !location.pathname.includes(page.path) ? "lightgray" : "white", backgroundColor: "transparent" },
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
        <Box sx={{
          flexGrow: 0,
          mr: 2.5,
          width: "120px",
          display: "flex",
          justifyContent: "flex-end"
        }} >
          <IconButton size="large" color="inherit" onClick={handleClick}>
            <Badge badgeContent={badgeContent} color="error">
              <NotificationsIcon />
            </Badge>
          </IconButton>
        </Box>
      </Header>
      <Popover
        id={id}
        open={open}
        anchorEl={anchorEl}
        onClose={handleClose}
        anchorOrigin={{
          vertical: 'bottom',
          // horizontal: 'center',
        }}
        // Adding will cause components to move unexpectedly
        // transformOrigin={{
        //   vertical: 'top',
        //   horizontal: 'right',
        // }}
        keepMounted={false}
        PaperProps={{
          sx: {
            // 让 Paper 有足够的上边距，给箭头腾出空间
            mt: 1.5,
            // 允许三角形箭头溢出
            overflow: "visible",
            // 使用伪元素 ::before 来画箭头
            "::before": {
              content: '""',
              display: "block",
              position: "absolute",
              // 三角形尺寸
              width: 0,
              height: 0,
              // 三角形边框
              borderLeft: "8px solid transparent",
              borderRight: "8px solid transparent",
              borderBottom: "8px solid #fff", // 箭头颜色
              // 让箭头出现在 Paper 顶部
              top: 0,
              // 箭头水平居中（可根据实际情况微调）
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
          deleteNotification={deleteNotification} />
      </Popover>
    </>
  );
}

export default MemberDashboard;
