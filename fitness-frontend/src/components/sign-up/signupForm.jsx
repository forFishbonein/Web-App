import React, { useState } from "react";
import axios from "axios";
import "./SignupForm.css";
import {
  TextField,
  Button,
  Checkbox,
  FormControlLabel,
  Container,
  Typography,
  Box,
  IconButton,
  InputAdornment,
  Divider,
} from "@mui/material";
import { Visibility, VisibilityOff } from "@mui/icons-material";
import { Google as GoogleIcon, Facebook as FacebookIcon } from "@mui/icons-material";

const SignupForm = ({ onSubmit }) => {
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    dateOfBirth: "",
    address: "",
    email: "",
    password: "",
    confirmPassword: "",
    terms: false,
  });

  const [errors, setErrors] = useState({});
  const [showPassword, setShowPassword] = useState(false); // Toggle password visibility
  const [showConfirmPassword, setShowConfirmPassword] = useState(false); // Toggle confirm password visibility
  const [message, setMessage] = useState("");

  const validate = () => {
    let tempErrors = {};
    tempErrors.firstName = formData.firstName ? "" : "First name is required";
    tempErrors.lastName = formData.lastName ? "" : "Last name is required";
    tempErrors.dateOfBirth = formData.dateOfBirth ? "" : "Date of Birth is required";
    tempErrors.address = formData.address ? "" : "Address is required";
    tempErrors.email = formData.email
      ? /.+@.+\..+/.test(formData.email)
        ? ""
        : "Invalid email format"
      : "Email is required";
    tempErrors.password =
      formData.password.length >= 6 &&
        /[A-Z]/.test(formData.password) &&
        /\d/.test(formData.password)
        ? ""
        : "Password must be at least 6 characters, include one uppercase letter and one number";
    tempErrors.confirmPassword =
      formData.confirmPassword === formData.password
        ? ""
        : "Passwords do not match";
    tempErrors.terms = formData.terms ? "" : "You must agree to the terms";
    setErrors(tempErrors);
    return Object.values(tempErrors).every((x) => x === "");
  };

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData({ ...formData, [name]: type === "checkbox" ? checked : value });
  };


  const handleSubmit = async (e) => {
    e.preventDefault();
    if (validate()) {
      onSubmit({
        address: "111",
        email: "haowhenhai@163.com"
      });
      onCaptchaShow();
    }
  };
  //captcha logic
  function onCaptchaShow() {
    try {
      const captcha = new TencentCaptcha('190688044', callback, {});
      captcha.show();
    } catch (error) {
      loadErrorCallback();
    }
  }

  function callback(res) {
    console.log('callback:', res);
    if (res.ret === 0) {
      const randstr = res.randstr;
      const ticket = res.ticket;
      try {
        // real logic
        // const response = await axios.post("http://localhost:8060/auth/signup", {
        //   firstName: formData.firstName,
        //   lastName: formData.lastName,
        //   dateOfBirth: formData.dateOfBirth,
        //   address: formData.address,
        //   email: formData.email,
        //   password: formData.password,
        //   randstr: randstr, // need to send to backend
        //   ticket: ticket,
        // });
        onSubmit(formData);
        setMessage(
          response.data.message ||
          "Signup successful! Check your email for verification."
        );
      } catch (error) {
        setMessage(
          error.response?.data?.message || "Signup failed. Please try again."
        );
      }
    } else {
      setMessage(
        "Captcha verification failed. Please try again."
      );
    }
  }
  // Defines captcha js load error handlers
  function loadErrorCallback() {
    var appid = '190688044';
    var ticket = 'trerror_1001_' + appid + '_' + Math.floor(new Date().getTime() / 1000);
    callback({
      ret: 500,
      randstr: '@' + Math.random().toString(36).substr(2),
      ticket: ticket,
      errorCode: 1001,
      errorMessage: 'jsload_error',
    });
  }

  return (
    <Container maxWidth="sm">
      <Box>
        <form onSubmit={handleSubmit}>
          <div style={{ display: "flex", flexDirection: "row", gap: "10px" }}>
            <TextField
              fullWidth
              label="First Name"
              name="firstName"
              value={formData.firstName}
              onChange={handleChange}
              error={!!errors.firstName}
              helperText={errors.firstName}
              margin="normal"
              size="small"
            />
            <TextField
              fullWidth
              label="Last Name"
              name="lastName"
              value={formData.lastName}
              onChange={handleChange}
              error={!!errors.lastName}
              helperText={errors.lastName}
              margin="normal"
              size="small"
            />
          </div>
          <TextField
            fullWidth
            label="Date of Birth"
            name="dateOfBirth"
            type="date"
            value={formData.dateOfBirth}
            onChange={handleChange}
            error={!!errors.dateOfBirth}
            helperText={errors.dateOfBirth}
            margin="normal"
            slotProps={{
              inputLabel: { shrink: true },
            }}
            size="small"
          />
          <TextField
            fullWidth
            label="Address"
            name="address"
            value={formData.address}
            onChange={handleChange}
            error={!!errors.address}
            helperText={errors.address}
            margin="normal"
            size="small"
          />
          <TextField
            fullWidth
            label="Email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            error={!!errors.email}
            helperText={errors.email}
            margin="normal"
            size="small"
          />
          <TextField
            fullWidth
            label="Password"
            type={showPassword ? "text" : "password"}
            name="password"
            value={formData.password}
            onChange={handleChange}
            error={!!errors.password}
            helperText={errors.password}
            margin="normal"
            size="small"
            slotProps={{
              input: {
                endAdornment: formData.password ? ( // Show eye icon only when input is not empty
                  <InputAdornment position="end">
                    <IconButton
                      onClick={() => setShowPassword(!showPassword)}
                      edge="end"
                    >
                      {showPassword ? <VisibilityOff /> : <Visibility />}
                    </IconButton>
                  </InputAdornment>
                ) : null,
              },
            }}
          />
          <TextField
            fullWidth
            label="Confirm Password"
            type={showConfirmPassword ? "text" : "password"}
            name="confirmPassword"
            value={formData.confirmPassword}
            onChange={handleChange}
            error={!!errors.confirmPassword}
            helperText={errors.confirmPassword}
            margin="normal"
            size="small"
            slotProps={{
              input: {
                endAdornment: formData.confirmPassword ? ( // Show eye icon only when input is not empty
                  <InputAdornment position="end">
                    <IconButton
                      onClick={() =>
                        setShowConfirmPassword(!showConfirmPassword)
                      }
                      edge="end"
                    >
                      {showConfirmPassword ? <VisibilityOff /> : <Visibility />}
                    </IconButton>
                  </InputAdornment>
                ) : null,
              },
            }}
          />
          <FormControlLabel
            control={
              <Checkbox
                name="terms"
                checked={formData.terms}
                onChange={handleChange}
              />
            }
            label="I agree to the Terms and Conditions"
          />
          {errors.terms && (
            <Typography color="error" variant="body2">
              {errors.terms}
            </Typography>
          )}
          <Button
            className="signup-btn"
            type="submit"
            variant="contained"
            fullWidth
          >
            Sign Up
          </Button>
        </form>
      </Box>

      {/* Divider with OR */}
      <Box display="flex" alignItems="center" my={1}>
        <Divider sx={{ flex: 1 }} />
        <Typography sx={{ mx: 1 }}>OR</Typography>
        <Divider sx={{ flex: 1 }} />
      </Box>

      {/* Social Login Buttons */}
      <Box display="flex" justifyContent="center" gap={2}>
        <Button
          variant="contained"
          startIcon={<GoogleIcon />}
          sx={{
            backgroundColor: "#DB4437",
            color: "white",
            "&:hover": { backgroundColor: "#C1351D" },
            flex: 1, // Makes buttons equal width
          }}
        >
          Google
        </Button>
        <Button
          variant="contained"
          startIcon={<FacebookIcon />}
          sx={{
            backgroundColor: "#1877F2",
            color: "white",
            "&:hover": { backgroundColor: "#145DBF" },
            flex: 1, // Makes buttons equal width
          }}
        >
          Facebook
        </Button>
      </Box>
    </Container>
  );
};

export default SignupForm;
