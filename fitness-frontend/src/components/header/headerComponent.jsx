import React, { useState, useEffect } from "react";
import Box from "@mui/material/Box";
import {
  AppBar,
  Toolbar,
  Typography,
  Avatar,
  Dialog,
  DialogTitle,
  DialogContent,
  Stack,
  TextField,
  DialogActions,
  Button,
  Menu,
  MenuItem,
  IconButton
} from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import { useUserStore } from "../../store/useUserStore";
import useUserApi from "../../apis/user";
import { useSnackbar } from "../../utils/Hooks/SnackbarContext.jsx";
import { useNavigate } from "react-router-dom";

const drawerWidth = 250;
const miniDrawerWidth = 60;

const Header = ({ firstName, lastName, children, drawerOpen }) => {
  const { showSnackbar } = useSnackbar();
  const initials = `${firstName?.charAt(0) ?? ""}${lastName?.charAt(0) ?? ""}`;
  const [anchorElUser, setAnchorElUser] = useState(null);
  const { updateUserInfo } = useUserApi();
  const { setUserInfo, setToken } = useUserStore();
  const userInfo = useUserStore((state) => state.userInfo);
  const isGoogle = useUserStore((state) => state.userInfo?.isGoogle);
  const navigate = useNavigate();

  // Avatar menu handlers
  const handleOpenUserMenu = (event) => setAnchorElUser(event.currentTarget);
  const handleCloseUserMenu = () => setAnchorElUser(null);
  const handleLogout = () => {
    setUserInfo({});
    setToken("");
  };

  // Dialog logic
  const [open, setOpen] = useState(false);
  const [updating, setUpdating] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    dateOfBirth: "",
    address: "",
    email: ""
  });

  useEffect(() => {
    if (userInfo) {
      setFormData({
        name: userInfo.name || "",
        dateOfBirth: userInfo.dateOfBirth || "",
        address: userInfo.address || "",
        email: userInfo.email || ""
      });
    }
  }, [userInfo]);

  const handleProfile = () => setOpen(true);

  const handleChange = (event) => {
    setFormData({ ...formData, [event.target.name]: event.target.value });
  };

  const handleCancle = () => {
    setFormData({
      name: userInfo.role === "member" || "admin" ? userInfo.name : userInfo.trainerProfile.name,
      dateOfBirth: userInfo.dateOfBirth || "",
      address: userInfo.address || "",
      email: userInfo.email || ""
    });
    setUpdating(false);
  };

  const handleClose = () => {
    setUpdating(false);
    setOpen(false);
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    try {
      await updateUserInfo(formData.address, formData.dateOfBirth, formData.name);
      showSnackbar({ message: "Update Successful!", severity: "success" });
      setOpen(false);
      setUpdating(false);
    } catch (e) {
      showSnackbar({ message: "Update Failed! Please try again.", severity: "error" });
    }
  };

  const handleResetPassword = () => {
    navigate("/reset-password?token=default");
  };

  const handleSetPassword = () => {
    navigate(`/forgot-password?email=${userInfo.email}&setPassword=true`);
  };

  return (
    <AppBar
      position="static"
      sx={{
        backgroundColor: "#023047",
        padding: "2px 20px",
        height: "10vh",
        display: "flex",
        justifyContent: "center",
      }}
    >
      <Toolbar
        sx={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          pl: drawerOpen ? `${drawerWidth}px` : `${miniDrawerWidth}px`,
          transition: "padding 0.3s ease",
        }}
      >
        {/* App Title */}
        <Typography variant="h4" sx={{ color: "white", fontWeight: "bold" }}>
          FitQuest
        </Typography>

        {/* Slot for injected content (menu toggle, notifications, etc.) */}
        {children}

        {/* Avatar + Menu */}
        <Box sx={{ flexGrow: 0 }}>
          <IconButton onClick={handleOpenUserMenu} sx={{ p: 0 }}>
            <Avatar
              sx={{
                bgcolor: "#f4d35e",
                color: "#023047",
                fontWeight: "bold",
                cursor: "pointer"
              }}
            >
              {initials.toUpperCase()}
            </Avatar>
          </IconButton>

          <Menu
            sx={{ mt: "45px" }}
            anchorEl={anchorElUser}
            anchorOrigin={{ vertical: "top", horizontal: "right" }}
            transformOrigin={{ vertical: "top", horizontal: "right" }}
            open={Boolean(anchorElUser)}
            onClose={handleCloseUserMenu}
          >
            <MenuItem onClick={handleProfile}>
              <Typography sx={{ textAlign: "center" }}>Profile</Typography>
            </MenuItem>
            <MenuItem onClick={handleLogout}>
              <Typography sx={{ textAlign: "center" }}>Logout</Typography>
            </MenuItem>
          </Menu>
        </Box>

        {/* Profile Dialog */}
        <Dialog open={open} onClose={handleClose} maxWidth="sm" fullWidth>
          <DialogTitle>
            {userInfo.role.charAt(0).toUpperCase() + userInfo.role.slice(1)} Profile
            <IconButton
              aria-label="close"
              onClick={handleClose}
              sx={{
                position: "absolute",
                right: 8,
                top: 8,
                color: (theme) => theme.palette.grey[500],
              }}
            >
              <CloseIcon />
            </IconButton>
          </DialogTitle>
          <DialogContent>
            <Stack spacing={2} mt={1}>
              <TextField
                label="Name"
                name="name"
                value={formData.name}
                onChange={handleChange}
                fullWidth
                required
                disabled={!updating}
              />
              <TextField
                label="Date of Birth"
                name="dateOfBirth"
                type="date"
                value={formData.dateOfBirth}
                onChange={handleChange}
                fullWidth
                required
                disabled={!updating}
                InputLabelProps={{ shrink: true }}
              />
              <TextField
                label="Address"
                name="address"
                value={formData.address}
                onChange={handleChange}
                fullWidth
                required
                disabled={!updating}
              />
              <TextField
                label="Email"
                name="email"
                type="email"
                value={formData.email}
                onChange={handleChange}
                fullWidth
                required
                disabled
              />
            </Stack>
          </DialogContent>
          <DialogActions>
            {!isGoogle ? (
              <Button variant="contained" color="warning" onClick={handleResetPassword}>
                Update Password
              </Button>
            ) : (
              <Button variant="contained" color="warning" onClick={handleSetPassword}>
                Set Password
              </Button>
            )}
            {updating ? (
              <Button onClick={handleCancle} variant="outlined" color="error">
                Cancel
              </Button>
            ) : (
              <Button onClick={() => setUpdating(true)} variant="contained" color="secondary">
                Update
              </Button>
            )}
            {updating && (
              <Button onClick={handleSubmit} variant="contained" color="success">
                Submit
              </Button>
            )}
          </DialogActions>
        </Dialog>
      </Toolbar>
    </AppBar>
  );
};

export default Header;