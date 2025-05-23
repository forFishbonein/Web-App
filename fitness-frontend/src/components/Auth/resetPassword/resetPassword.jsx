import React, { useEffect, useState } from "react";
import {
  TextField,
  Button,
  Container,
  Box,
  Typography,
  IconButton,
  InputAdornment,
  Alert,
} from "@mui/material";
import { Visibility, VisibilityOff } from "@mui/icons-material";
import { useNavigate, useSearchParams } from "react-router-dom";
import "./resetPassword.css";
import { useUserStore } from "../../../store/useUserStore";
import useLoginApi from "../../../apis/login";
const ResetPassword = () => {
  const navigate = useNavigate();
  const { setUserInfo, setToken } = useUserStore();
  // If there is a userRole, it means that you are logged in
  const userRole = useUserStore((state) => state.userInfo?.role);
  const isGoogle = useUserStore((state) => state.userInfo?.isGoogle);
  const handleLogout = () => {
    setUserInfo({}); // clear zustand data
    setToken("");
    navigate("/authenticate", { state: { activeTab: 1 } });
  };
  const [searchParams] = useSearchParams();
  const token = searchParams.get("token"); // Get token from URL

  const [formData, setFormData] = useState({
    currentPassword: "",
    newPassword: "",
    confirmNewPassword: "",
  });

  const [errors, setErrors] = useState({});
  const [message, setMessage] = useState("");
  const [showPassword, setShowPassword] = useState({
    current: false,
    new: false,
    confirm: false,
  });
  const { resetPassword, changePassword } = useLoginApi();
  useEffect(() => {
    if (!token) {
      // If the user is NOT logged in & there's no token, redirect to login
      navigate("/authenticate", { state: { activeTab: 1 } });
    }
  }, [token, navigate]);

  const validate = () => {
    let tempErrors = {};

    if (userRole && !isGoogle) {
      tempErrors.currentPassword = formData.currentPassword ? "" : "Current password is required";
    }

    tempErrors.newPassword =
      formData.newPassword.length >= 6 ? "" : "New password must be at least 6 characters";
    tempErrors.confirmNewPassword =
      formData.confirmNewPassword === formData.newPassword ? "" : "Passwords do not match";

    setErrors(tempErrors);
    return Object.values(tempErrors).every((x) => x === "");
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleTogglePasswordVisibility = (field) => {
    setShowPassword((prev) => ({ ...prev, [field]: !prev[field] }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (validate()) {
      try {
        if (userRole && !isGoogle) {
          await changePassword(formData.newPassword, formData.currentPassword);
          setTimeout(() => {
            handleLogout();
          }, 1000);
        } else {
          await resetPassword(formData.newPassword, token);
          setTimeout(() => {
            handleLogout();
          }, 2000);
        }
        setMessage("Password successfully updated!");
      } catch (error) {
        setMessage(error?.response?.data?.message || "Password reset failed.");
      }
    }
  };

  return (
    <Container maxWidth="sm">
      <Box textAlign="center" mt={5}>
        <Typography variant="h4" gutterBottom>
          {userRole && !isGoogle ? "Reset Password" : "Create New Password"}
        </Typography>
      </Box>
      <form onSubmit={handleSubmit}>
        {/* Show Current Password Field Only for Logged-in Users */}
        {userRole && !isGoogle && (
          <TextField
            fullWidth
            label="Current Password"
            type={showPassword.current ? "text" : "password"}
            name="currentPassword"
            value={formData.currentPassword}
            onChange={handleChange}
            error={!!errors.currentPassword}
            helperText={errors.currentPassword}
            margin="normal"
            size="small"
            InputProps={{
              endAdornment: (
                <InputAdornment position="end">
                  <IconButton onClick={() => handleTogglePasswordVisibility("current")}>
                    {showPassword.current ? <VisibilityOff /> : <Visibility />}
                  </IconButton>
                </InputAdornment>
              ),
            }}
          />
        )}

        {/* New Password */}
        <TextField
          fullWidth
          label="New Password"
          type={showPassword.new ? "text" : "password"}
          name="newPassword"
          value={formData.newPassword}
          onChange={handleChange}
          error={!!errors.newPassword}
          helperText={errors.newPassword}
          margin="normal"
          size="small"
          InputProps={{
            endAdornment: (
              <InputAdornment position="end">
                <IconButton onClick={() => handleTogglePasswordVisibility("new")}>
                  {showPassword.new ? <VisibilityOff /> : <Visibility />}
                </IconButton>
              </InputAdornment>
            ),
          }}
        />

        {/* Confirm New Password */}
        <TextField
          fullWidth
          label="Confirm New Password"
          type={showPassword.confirm ? "text" : "password"}
          name="confirmNewPassword"
          value={formData.confirmNewPassword}
          onChange={handleChange}
          error={!!errors.confirmNewPassword}
          helperText={errors.confirmNewPassword}
          margin="normal"
          size="small"
          InputProps={{
            endAdornment: (
              <InputAdornment position="end">
                <IconButton onClick={() => handleTogglePasswordVisibility("confirm")}>
                  {showPassword.confirm ? <VisibilityOff /> : <Visibility />}
                </IconButton>
              </InputAdornment>
            ),
          }}
        />

        {/* Display Success or Error Message */}
        {message && <Alert severity={message.includes("successful") ? "success" : "error"}>{message}</Alert>}

        {/* Submit Button */}
        <Button type="submit"
          // className="update-btn"
          variant="contained" fullWidth sx={{ mt: 3 }}>
          {userRole ? isGoogle ? "Set Password" : "Update Password" : "Reset Password"}
        </Button>
      </form>
    </Container>
  );
};

export default ResetPassword;
