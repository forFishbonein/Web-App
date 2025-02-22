import React from "react";
import Box from "@mui/material/Box";
import { AppBar, Toolbar, Typography, Avatar } from "@mui/material";
import Tooltip from "@mui/material/Tooltip";
import Menu from "@mui/material/Menu";
import MenuItem from "@mui/material/MenuItem";
import AdbIcon from "@mui/icons-material/Adb";
import IconButton from "@mui/material/IconButton";
import { useUserStore } from "../../store/useUserStore";
const Header = ({ firstName, lastName, children }) => {
  // Generate avatar initials
  const initials = `${firstName?.charAt(0) ?? ""}${lastName?.charAt(0) ?? ""}`;
  const [anchorElUser, setAnchorElUser] = React.useState(null);
  // Open user menu dropdown
  const handleOpenUserMenu = (event) => {
    setAnchorElUser(event.currentTarget);
  };

  // Close user menu dropdown
  const handleCloseUserMenu = () => {
    setAnchorElUser(null);
  };
  const { setUserInfo, setToken } = useUserStore();
  const handleLogout = () => {
    setUserInfo({}); // clear zustand data
    setToken("");
  };
  return (
    <AppBar position="static" sx={{ backgroundColor: "#023047", padding: "2px 20px", height: "10vh", display: "flex", justifyContent: "center" }}>
      <Toolbar sx={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        {/* Application Name */}
        <Typography variant="h4" sx={{ color: "white", fontWeight: "bold" }}>
          FitQuest
        </Typography>
        {/* the slot */}
        {children}
        {/* User Avatar with Initials */}
        <Box sx={{ flexGrow: 0 }}>
          <IconButton onClick={handleOpenUserMenu} sx={{ p: 0 }}>
            <Avatar sx={{ bgcolor: "#f4d35e", color: "#023047", fontWeight: "bold", cursor: "pointer" }}>
              {initials.toUpperCase()}
            </Avatar>
          </IconButton>
          {/* <Tooltip title="Open settings">
          </Tooltip> */}
          <Menu
            sx={{ mt: "45px" }}
            anchorEl={anchorElUser}
            anchorOrigin={{
              vertical: "top",
              horizontal: "right",
            }}
            keepMounted
            transformOrigin={{
              vertical: "top",
              horizontal: "right",
            }}
            open={Boolean(anchorElUser)}
            onClose={handleCloseUserMenu}
          >
            <MenuItem key="Profile">
              <Typography sx={{ textAlign: "center" }}>Profile</Typography>
            </MenuItem>
            <MenuItem key="Logout" onClick={handleLogout}>
              <Typography sx={{ textAlign: "center" }}>Logout</Typography>
            </MenuItem>
          </Menu>
        </Box>

      </Toolbar>
    </AppBar>
  );
};

export default Header;
