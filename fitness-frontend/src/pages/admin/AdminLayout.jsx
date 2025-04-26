import React, { useState } from "react";
import { Outlet, useNavigate, useLocation } from "react-router-dom";
import AdminDashboard from "../../components/dashboard/AdminDashboard";
import {
  Drawer,
  Box,
  List,
  Divider,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  IconButton,
} from "@mui/material";

// Icons
import DashboardIcon from "@mui/icons-material/Dashboard";
import PeopleAltIcon from "@mui/icons-material/PeopleAlt";
import FitnessCenterIcon from "@mui/icons-material/FitnessCenter";
import EventNoteIcon from "@mui/icons-material/EventNote";
import SettingsIcon from "@mui/icons-material/Settings";
import ChevronLeftIcon from "@mui/icons-material/ChevronLeft";
import ChevronRightIcon from "@mui/icons-material/ChevronRight";

const drawerWidth = 250;
const miniDrawerWidth = 60;

const pages = [
  { name: "Dashboard", path: "/admin/home", icon: <DashboardIcon /> },
  { name: "Members Management", path: "/admin/members", icon: <PeopleAltIcon /> },
  { name: "Trainers Management", path: "/admin/trainers", icon: <FitnessCenterIcon /> },
  { name: "Center Management", path: "/admin/centers", icon: <EventNoteIcon /> },
  { name: "Specialisation Management", path: "/admin/specialisations", icon: <EventNoteIcon /> },
];

function AdminLayout() {
  const [drawerOpen, setDrawerOpen] = useState(true);
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
          boxSizing: "border-box",
          marginTop: "70px",
          overflowX: "hidden",
          transition: "width 0.3s",
        },
      }}
    >
      <Box sx={{ display: "flex", justifyContent: drawerOpen ? "flex-end" : "center", p: 1 }}>
        <IconButton onClick={() => setDrawerOpen(!drawerOpen)}>
          {drawerOpen ? <ChevronLeftIcon /> : <ChevronRightIcon />}
        </IconButton>
      </Box>
      <Divider />
      <List>
        {pages.map((page) => {
          const isSelected = location.pathname.startsWith(page.path);
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
    <div>
      {/* Top Admin AppBar */}
      <AdminDashboard drawerOpen={drawerOpen} />

      {/* Sidebar Drawer */}
      <DrawerList />

      {/* Main Content Area */}
      <div
        style={{
          marginLeft: drawerOpen ? `${drawerWidth}px` : `${miniDrawerWidth}px`,
          padding: "24px",
          transition: "margin-left 0.3s ease",
          minHeight: "calc(100vh - 70px)",
          overflowY: "auto",
          maxHeight: "90vh",
        }}
      >
        <Outlet />
      </div>
    </div>
  );
}

export default AdminLayout;