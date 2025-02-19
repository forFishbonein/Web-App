import React, { useState } from "react";
import {
  Container,
  TextField,
  Button,
  Typography,
  Paper,
} from "@mui/material";
import axios from "axios";

const ForgotPassword = ({ onCancel }) => {
  const [email, setEmail] = useState("");
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");

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

    try {
      // Replace with your actual API endpoint
      const response = await axios.post("http://localhost:8060/auth/forgot-password", {
        email,
      });

      setMessage(response.data.message || "Check your email for password reset instructions.");
    } catch (error) {
      setError(error.response?.data?.message || "Something went wrong. Please try again.");
    }
  };

  return (
    <Container maxWidth="sm" sx={{ marginTop: "20px"}}>
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
        <Button
          variant="text"
          fullWidth
          sx={{ mt: 2, color: "#023047", textDecoration: "underline", textTransform: "none" }}
          onClick={onCancel}
        >
          Back to Login
        </Button>
      </Paper>
    </Container>
  );
};

export default ForgotPassword;
