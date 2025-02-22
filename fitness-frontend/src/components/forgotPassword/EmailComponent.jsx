import React, { useState } from "react";
import {
  Container,
  TextField,
  Button,
  Typography,
  Paper,
} from "@mui/material";
import { Link, useNavigate } from "react-router-dom";
import "./EmailComponent.css";
import useCaptcha from "../../utils/Hooks/useCaptcha.js";
import useLoginApi from "../../apis/login.js";
import { useSnackbar } from "../../utils/Hooks/SnackbarContext.jsx";

const EmailComponent = ({ onCancel }) => {
  const [email, setEmail] = useState("");
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");
  const navigate = useNavigate();
  const { showSnackbar } = useSnackbar();
  const { onCaptchaShow } = useCaptcha();
  const { forgetPassword } = useLoginApi();
  const handleChange = (event) => {
    setEmail(event.target.value);
    setError("");
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    if (!email) {
      setError("Email is required");
      return;
    }
    onCaptchaShow(async (ticket, randstr) => {
      try {
        // Replace with your actual API endpoint
        // let res = await forgetPassword(email, ticket, randstr); //real logic
        let res = {};
        showSnackbar({ message: res?.data?.message || "Check your email for password reset instructions.", severity: "success" });
        navigate("/authenticate", { state: { activeTab: 1 } });
      } catch (error) {
        if (error) {
          setError(error?.response?.data?.message || "Something went wrong. Please try again.");
        }
      }
    },
      (error) => {
        showSnackbar({ message: error, severity: "error" });
      }
    )
  };

  return (
    <Container maxWidth="sm" sx={{ marginTop: "20px" }}>
      <Paper elevation={3} sx={{ padding: "20px", borderRadius: "10px", textAlign: "center" }}>
        <Typography variant="h5" fontWeight="bold" sx={{ mb: 2 }}>
          Forgot Password?
        </Typography>

        <Typography variant="body1" sx={{ mt: 2, mb: 3 }}>
          Enter your email address below and we’ll send you a link to reset your password.
        </Typography>

        <form onSubmit={handleSubmit}>
          <TextField
            fullWidth
            label="Email Address"
            type="email"
            variant="outlined"
            value={email}
            onChange={handleChange}
            error={!!error}
            helperText={error}
            margin="normal"
            size="small"
          />

          <Button
            className="update-btn"
            type="submit"
            variant="contained"
            color="primary"
            fullWidth
            sx={{ mt: 2, padding: "10px", fontWeight: "bold", backgroundColor: "#023047" }}
          >
            Send Reset Link
          </Button>
        </form>

        {message && (
          <Typography variant="body2" color="green" sx={{ mt: 2 }}>
            {message}
          </Typography>
        )}

        {/* Back to Login */}
        <Link to="/authenticate" state={{ activeTab: 1 }}>
          <Button
            variant="text"
            fullWidth
            sx={{ mt: 2, color: "#023047", textDecoration: "underline", textTransform: "none" }}
            onClick={onCancel}
          >
            Back to Login
          </Button>
        </Link>
      </Paper>
    </Container>
  );
};

export default EmailComponent;