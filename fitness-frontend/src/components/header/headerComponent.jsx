import React, { useState, useEffect } from "react";
import Box from "@mui/material/Box";
import { AppBar, Toolbar, Typography, Avatar, Dialog, DialogTitle, DialogContent, Stack, TextField, DialogActions, Button } from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import Menu from "@mui/material/Menu";
import MenuItem from "@mui/material/MenuItem";
import IconButton from "@mui/material/IconButton";
import { useUserStore } from "../../store/useUserStore";
import useUserApi from "../../apis/user";
import { useSnackbar } from "../../utils/Hooks/SnackbarContext.jsx";
const Header = ({ firstName, lastName, children }) => {
  const { showSnackbar } = useSnackbar();
  // Generate avatar initials
  const initials = `${firstName?.charAt(0) ?? ""}${lastName?.charAt(0) ?? ""}`;
  const [anchorElUser, setAnchorElUser] = React.useState(null);
  const { updateUserInfo } = useUserApi();
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

  // Dialog logic
  const userInfo = useUserStore((state) => state.userInfo);
  const [open, setOpen] = useState(false);
  const [updating, setUpdating] = useState(false);
  const [formData, setFormData] = useState({ name: "", dateOfBirth: "", address: "", email: "" });
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
  const handleProfile = () => {
    setOpen(true);
  }
  const handleChange = (event) => {
    setFormData({ ...formData, [event.target.name]: event.target.value });
  };
  const handleCancle = () => {
    setFormData({
      name: userInfo.name || "",
      dateOfBirth: userInfo.dateOfBirth || "",
      address: userInfo.address || "",
      email: userInfo.email || ""
    });
    setUpdating(false);
  };
  const handleClose = () => {
    setUpdating(false);
    setOpen(false);
  }
  const handleSubmit = async (event) => {
    event.preventDefault();
    try {
      console.log("profile:", formData);
      await updateUserInfo(formData.address, formData.dateOfBirth, formData.name);
      showSnackbar({ message: "Update Successful!", severity: "success" });
      setOpen(false);
      setUpdating(false);
    } catch (e) {
      if (e) {
        showSnackbar({ message: "Update Failed! Please try again.", severity: "error" });
      }
    }
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
            <MenuItem key="Profile" onClick={handleProfile}>
              <Typography sx={{ textAlign: "center" }}>Profile</Typography>
            </MenuItem>
            <MenuItem key="Logout" onClick={handleLogout}>
              <Typography sx={{ textAlign: "center" }}>Logout</Typography>
            </MenuItem>
          </Menu>
        </Box>
        {/* Dialog logic */}
        <Dialog open={open} onClose={handleClose} maxWidth="sm" fullWidth>
          <DialogTitle>{userInfo.role.charAt(0).toUpperCase() + userInfo.role.slice(1)} Profile
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
                label="DateOfBirth"
                name="dateOfBirth"
                value={formData.dateOfBirth}
                onChange={handleChange}
                fullWidth
                required
                disabled={!updating}
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
            {updating ? <Button onClick={handleCancle} variant="contained" color="error">Cancel</Button> : <Button onClick={() => setUpdating(true)} color="secondary">Update</Button>}

            {updating && <Button onClick={handleSubmit} variant="contained" color="success">
              Submit
            </Button>}
          </DialogActions>
        </Dialog>
      </Toolbar>
    </AppBar>
  );
};

export default Header;
