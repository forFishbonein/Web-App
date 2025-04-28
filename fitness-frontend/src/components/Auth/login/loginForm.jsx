import React, { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate, Link } from "react-router-dom";
import "./LoginForm.css";
import {
  TextField,
  Button,
  Container,
  Box,
  IconButton,
  InputAdornment,
  Typography,
  Divider,
} from "@mui/material";
import { Visibility, VisibilityOff } from "@mui/icons-material";

import useLoginApi from "../../../apis/login.js";
import useUserApi from "../../../apis/user.js";
import useTrainerApi from "../../../apis/trainer.js";
import useAdminApi from "../../../apis/admin.js";
import { useUserStore } from "../../../store/useUserStore.js"; // Zustand Store
import { useSnackbar } from "../../../utils/Hooks/SnackbarContext.jsx";
import useCaptcha from "../../../utils/Hooks/useCaptcha.js";
import GoogleLoginButton from "./google/LoginButton.jsx";
import FacebookLoginButton from "./facebook/LoginButton.jsx";
const LoginForm = ({ roleLogin }) => {
  const { showSnackbar } = useSnackbar();
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

  const [errors, setErrors] = useState({});
  const [message, setMessage] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  const validate = () => {
    let tempErrors = {};
    tempErrors.email = formData.email
      ? /.+@.+\..+/.test(formData.email)
        ? ""
        : "Invalid email format"
      : "Email is required";
    tempErrors.password = formData.password ? "" : "Password is required";
    setErrors(tempErrors);
    return Object.values(tempErrors).every((x) => x === "");
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  // before
  // const handleSubmit = async (e) => {
  //   e.preventDefault();
  //   if (validate()) {
  //     try {
  //       const response = await axios.post("http://localhost:8060/auth/login", {
  //         email: formData.email,
  //         password: formData.password,
  //       });
  //       if (response.status === 200) {
  //         setMessage("Login Successful!");
  //         navigate("/home"); // Redirect to home
  //       }
  //     } catch (error) {
  //       setMessage(
  //         error.response?.data?.message || "Login failed. Please try again."
  //       );
  //     }
  //   }
  // };

  // now
  const { passwordLogin } = useLoginApi();
  const { getUserInfo } = useUserApi();
  const { getTrainerInfo } = useTrainerApi();
  const { getAdminInfo } = useAdminApi();
  const setToken = useUserStore((state) => state.setToken);
  const { onCaptchaShow } = useCaptcha();
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (validate()) {
      //captcha logic
      onCaptchaShow(
        async (ticket, randstr) => {
          try {
            const res = await passwordLogin(
              formData.email,
              formData.password,
              ticket,
              randstr,
              roleLogin
            ); //real logic
            const newToken = res.data.token; //real logic
            const role = res.data.role;
            let getInfoFun = getUserInfo;
            if (role === "member") {
              getInfoFun = getUserInfo;
            } else if (role === "trainer") {
              getInfoFun = getTrainerInfo;
            } else if (role === "admin") {
              getInfoFun = getAdminInfo;
            }
            await setToken(newToken, role, getInfoFun);
            // await setToken(newToken, "admin", getInfoFun);
            showSnackbar({ message: "Login Successful!", severity: "success" });
            console.log("Login Successful!", role);
          } catch (error) {
            if (error) {
              //Error handling should be done, otherwise the try-catch will not be able to see the error directly after the try-catch, resulting in the failure to find the problem
              showSnackbar({
                message: error.message || "Login failed. Please try again.",
                severity: "error",
              });
            }
          }
        },
        (error) => {
          showSnackbar({ message: error, severity: "error" });
        }
      );
    }
  };
  return (
    <Container maxWidth="sm">
      <Box>
        <form onSubmit={handleSubmit}>
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
                endAdornment: formData.password ? (
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
          <Box
            display="flex"
            justifyContent="space-between"
            alignItems="center"
            mt={1}
          >
            <Link variant="body2" to="/forgot-password">
              <Button
                variant="contained"
                sx={{
                  color: "#ffffff",
                  textDecorationColor: "#023047",
                  textTransform: "none",
                }}
              >
                Forgot password?
              </Button>
            </Link>
          </Box>
          {message && (
            <Typography variant="body2" color="green" sx={{ mt: 2 }}>
              {message}
            </Typography>
          )}
          <Button
            type="submit"
            variant="contained"
            fullWidth
            className="login-btn"
          >
            Login
          </Button>
        </form>
      </Box>
      {roleLogin === "member" && (
        <>
          <Box display="flex" alignItems="center" my={1}>
            <Divider sx={{ flex: 1 }} />
            <Typography sx={{ mx: 1 }}>OR</Typography>
            <Divider sx={{ flex: 1 }} />
          </Box>

          {/* Social Login Buttons */}
          <Box display="flex" justifyContent="center" gap={2}>
            <GoogleLoginButton type="login" />
            <FacebookLoginButton />
          </Box>
        </>
      )}
    </Container>
  );
};

export default LoginForm;
