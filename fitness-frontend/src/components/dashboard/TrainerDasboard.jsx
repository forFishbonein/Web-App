import React, { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import Box from "@mui/material/Box";
import IconButton from "@mui/material/IconButton";
import Button from "@mui/material/Button";
import Badge from "@mui/material/Badge";
import NotificationsIcon from "@mui/icons-material/Notifications";
import Header from "../header/headerComponent";
import Drawer from '@mui/material/Drawer';
import List from '@mui/material/List';
import Divider from '@mui/material/Divider';
import ListItem from '@mui/material/ListItem';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemText from '@mui/material/ListItemText';
import InboxIcon from '@mui/icons-material/MoveToInbox';
import MailIcon from '@mui/icons-material/Mail';
// Define navigation menu items
const pages = [
  {
    name: "Applications",
    path: "/trainer/applications",
    items: [
      { name: "Training application", path: "/trainer/applications/training" },
      { name: "Appointment application", path: "/trainer/applications/appointment" },
    ]
  },
  {
    name: "Sessions",
    path: "/trainer/trainings",
    items: [
      { name: "The sessions I take", path: "/trainer/trainings/session" },
      { name: "The members I teach", path: "/trainer/trainings/member" },
    ]
  }
];
function TrainerDasboard() {
  const navigate = useNavigate();
  const location = useLocation(); // get now router
  const [open, setOpen] = useState(false);
  const [drawerItems, setDrawerItems] = useState([]);
  const toggleDrawer = (newOpen) => () => {
    setOpen(newOpen);
  };
  const handleNavClick = (index) => () => {
    console.log(index);
    setDrawerItems(pages[index].items);
    setOpen(true);
  }
  const DrawerList = () => {
    return (
      <Box sx={{ width: 250 }} role="presentation" onClick={toggleDrawer(false)}>
        <List>
          {drawerItems.map((item, index) => (
            <div key={item.name}>
              <ListItem disablePadding>
                <ListItemButton onClick={() => navigate(item.path)}>
                  <ListItemIcon>
                    <InboxIcon />
                  </ListItemIcon>
                  <ListItemText primary={item.name} />
                </ListItemButton>
              </ListItem>
              {index !== drawerItems.length - 1 ? <Divider /> : <></>}
            </div>
          ))}
        </List>
      </Box>
    );
  }
  return (
    <Header>
      {/* Web navigation menu */}
      <Box sx={{ flexGrow: 1, display: "flex", marginLeft: 5 }}>
        {pages.map((page, index) => (
          <Button
            key={page.name}
            variant="text"
            onClick={handleNavClick(index)} // Open drawer
            sx={{
              my: 2,
              display: "block",
              marginRight: 2,
              fontSize: "16px",
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
      <Box sx={{ flexGrow: 0, mr: 2 }}>
        <IconButton size="large" color="inherit">
          <Badge badgeContent={17} color="error">
            <NotificationsIcon />
          </Badge>
        </IconButton>
      </Box>
      <Drawer open={open} onClose={toggleDrawer(false)}>
        {DrawerList()}
      </Drawer>
    </Header>
  );
}

export default TrainerDasboard;
