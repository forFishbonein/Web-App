import React, { useState, useRef } from "react";
import axios from "axios";
import { TextField, Button, Box, Typography } from "@mui/material";
import Grid from "@mui/material/Grid2";
import "./VerificationForm.css"
import useLoginApi from "../../apis/login";
import { useSnackbar } from "../../utils/Hooks/SnackbarContext.jsx";
const VerificationForm = ({ onVerified, email }) => {
  const { showSnackbar } = useSnackbar();
  console.log(email);
  const [otp, setOtp] = useState(new Array(6).fill(""));
  const [error, setError] = useState("");
  const inputRefs = useRef([]);
  const { verifyCode } = useLoginApi();
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
      await verifyCode(otp.join(""), email); //real logic
      onVerified();
      showSnackbar({ message: "Verification successful! You can login.", severity: "success" });
    } catch (error) {
      if (error) {
        setError(
          error?.response.data?.message || "Invalid OTP, please try again"
        );
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