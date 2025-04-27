import React, { useState } from "react";
import { Outlet, useNavigate, useLocation } from "react-router-dom";
import TrainerDashboard from "../../components/dashboard/TrainerDasboard";
import Drawer from "@mui/material/Drawer";
import Box from "@mui/material/Box";
import List from "@mui/material/List";
import Divider from "@mui/material/Divider";
import ListItem from "@mui/material/ListItem";
import ListItemButton from "@mui/material/ListItemButton";
import ListItemIcon from "@mui/material/ListItemIcon";
import ListItemText from "@mui/material/ListItemText";
import IconButton from "@mui/material/IconButton";
// Icons
import DashboardIcon from "@mui/icons-material/Dashboard";
import PeopleAltIcon from "@mui/icons-material/PeopleAlt";
import EventNoteIcon from "@mui/icons-material/EventNote";
import CalendarTodayIcon from "@mui/icons-material/CalendarToday";
import FitnessCenterIcon from "@mui/icons-material/FitnessCenter";
import TrendingUpIcon from "@mui/icons-material/TrendingUp";
import ChevronLeftIcon from "@mui/icons-material/ChevronLeft";
import ChevronRightIcon from "@mui/icons-material/ChevronRight";
import HistoryIcon from "@mui/icons-material/History";
import EventAvailableIcon from "@mui/icons-material/EventAvailable";
import AccountCircleIcon from "@mui/icons-material/AccountCircle";

const drawerWidth = 250;
const miniDrawerWidth = 60;

const pages = [
  { name: "Home", path: "/trainer/home", icon: <DashboardIcon /> },
  { name: "Member Management", path: "/trainer/member-management", icon: <PeopleAltIcon /> },
  { name: "Session Requests", path: "/trainer/session-requests", icon: <EventNoteIcon /> },
  { name: "My Sessions", path: "/trainer/upcoming-sessions", icon: <CalendarTodayIcon /> },
  { name: "Workout Plans", path: "/trainer/workout-plans", icon: <FitnessCenterIcon /> },
  { name: "Member Progress", path: "/trainer/member-progress", icon: <TrendingUpIcon /> },
  { name: "History", path: "/trainer/history", icon: <HistoryIcon /> },
  { name: "Availability", path: "/trainer/availability", icon: <EventAvailableIcon /> },
  { name: "Profile", path: "/trainer/profile", icon: <AccountCircleIcon /> },
];

function TrainerLayout() {
  const [drawerOpen, setDrawerOpen] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();
  const DrawerList = () => (
    <Drawer
      variant="permanent"
      sx={{
        width: drawerOpen ? drawerWidth : miniDrawerWidth,
        flexShrink: 0,
        "& .MuiDrawer-paper": {
          width: drawerOpen ? drawerWidth : miniDrawerWidth,
          // height: "100vh",
          boxSizing: "border-box",
          // marginTop: "70px",
          overflowX: "hidden",
          transition: "width 0.3s",
          zIndex: "1000"
        },
      }}
    >
      {/* 占位 AppBar 的高度 */}
      <Box sx={{ height: '10vh', flexShrink: 0 }} />
      <Box sx={{ display: "flex", justifyContent: drawerOpen ? "flex-end" : "center", p: 1 }}>
        <IconButton onClick={() => setDrawerOpen(!drawerOpen)}>
          {drawerOpen ? <ChevronLeftIcon /> : <ChevronRightIcon />}
        </IconButton>
      </Box>
      <Divider />
      <List>
        {pages.map((page) => {
          const isSelected = location.pathname === page.path;
          return (
            <ListItem key={page.name} disablePadding sx={{ display: "block" }}>
              <ListItemButton
                onClick={() => navigate(page.path)}
                selected={isSelected}
                sx={{
                  minHeight: 48,
                  justifyContent: drawerOpen ? "initial" : "center",
                  px: 2.5,
                  backgroundColor: isSelected
                    ? (theme) => theme.palette.secondary.main + "20"
                    : "inherit",
                  "&.Mui-selected": {
                    backgroundColor: (theme) => theme.palette.secondary.main + "20",
                    color: (theme) => theme.palette.primary.main,
                    "& .MuiListItemIcon-root": {
                      color: "white",
                    },
                  },
                }}
              >
                <ListItemIcon
                  sx={{
                    minWidth: 0,
                    mr: drawerOpen ? 2 : "auto",
                    justifyContent: "center",
                  }}
                >
                  {page.icon}
                </ListItemIcon>
                {drawerOpen && <ListItemText primary={page.name} />}
              </ListItemButton>
            </ListItem>
          );
        })}
      </List>
    </Drawer>
  );

  return (
    <>
      {/* Top AppBar */}
      < TrainerDashboard drawerOpen={drawerOpen} />
      {/* 占位：刚好和 AppBar 等高 */}
      < div style={{ height: "10vh" /* px */, flexShrink: 0 }
      } />
      {/* Sidebar Drawer */}
      <DrawerList />

      {/* Main Content Area */}
      <div
        style={{
          marginLeft: drawerOpen ? `${drawerWidth}px` : `${miniDrawerWidth}px`,
          padding: "24px",
          transition: "margin-left 0.3s ease",
          // minHeight: "calc(100vh - 70px)",
          overflowY: "auto",
          maxHeight: "90vh",
        }}
      >
        <Outlet />
      </div>
    </>
  );
}

export default TrainerLayout;
