import React, { useState, useRef } from "react";
import axios from "axios";
import { TextField, Button, Box, Typography } from "@mui/material";
import Grid from "@mui/material/Grid2";
import "./VerificationForm.css"

const VerificationForm = ({ onVerified, email }) => {
  console.log(email);
  const [otp, setOtp] = useState(new Array(6).fill(""));
  const [error, setError] = useState("");
  const inputRefs = useRef([]);

  const handleChange = (e, index) => {
    const value = e.target.value.replace(/[^0-9]/g, "");
    if (value.length > 1) return;

    const newOtp = [...otp];
    newOtp[index] = value;
    setOtp(newOtp);

    if (value && index < 5) {
      inputRefs.current[index + 1].focus();
    }
  };

  const handleKeyDown = (e, index) => {
    if (e.key === "Backspace" && !otp[index] && index > 0) {
      inputRefs.current[index - 1].focus();
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (otp.join("").length !== 6) {
      setError("Please enter the full OTP");
      return;
    }
    setError("");

    try {
      const response = await axios.post("http://localhost:8060/auth/verify", {
        email: email,
        verificationCode: otp.join(""),
      });
      if (response.status === 200) {
        console.log("Verification successful!");
        onVerified();
      } else {
        setError(response.data?.message || "Invalid OTP, please try again");
      }
    } catch (error) {
      console.error("API Error:", error.response || error);
      if (error.response) {
        setError(
          error.response.data?.message || "Invalid OTP, please try again"
        );
      } else if (error.request) {
        setError("No response from server. Please try again later.");
      } else {
        setError("Something went wrong, please try again later.");
      }
    }
  };

  return (
    <Grid
      xs={12}
      md={6}
      container
      justifyContent="center"
      alignItems="center"
      direction="column"
      sx={{ width: "600px", height: "650px", textAlign: "center" }} // 让整个界面垂直 & 水平居中
    >
      <Typography variant="h5" gutterBottom>
        Verify
      </Typography>
      <Typography variant="body2" color="textSecondary" gutterBottom>
        Your code was sent to {email}
      </Typography>
      <form onSubmit={handleSubmit}>
        <Box display="flex" justifyContent="center" gap={1} my={2}>
          {otp.map((digit, index) => (
            <TextField
              key={index}
              inputRef={(el) => (inputRefs.current[index] = el)}
              value={digit}
              onChange={(e) => handleChange(e, index)}
              onKeyDown={(e) => handleKeyDown(e, index)}
              variant="outlined"
              size="small"
              slotProps={{
                input: {
                  maxLength: 1,
                  style: {
                    textAlign: "center",
                    fontSize: "20px",
                    width: "40px",
                  },
                },
              }}
            />
          ))}
        </Box>
        {error && <Typography color="error">{error}</Typography>}
        <Button type="submit" variant="contained" className="verify-btn" fullWidth>
          Verify
        </Button>
      </form>
      <Typography variant="body2" color="textSecondary" mt={2}>
        Didn’t receive code? <a href="#">Request again</a>
      </Typography>
    </Grid>
  );
};

export default VerificationForm;