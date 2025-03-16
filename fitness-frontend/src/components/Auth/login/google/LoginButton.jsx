/*
 * @FilePath: LoginButton.jsx
 * @Author: Aron
 * @Date: 2025-03-05 15:07:18
 * @LastEditors: Please set LastEditors
 * @LastEditTime: 2025-03-08 15:24:10
 * Copyright: 2025 xxxTech CO.,LTD. All Rights Reserved.
 * @Descripttion:
 */
import React, { useState, useEffect } from "react";
import {
  Button
} from "@mui/material";
import useLoginApi from "../../../../apis/login.js";
import useUserApi from "../../../../apis/user.js";
import { useSnackbar } from "../../../../utils/Hooks/SnackbarContext.jsx";
import { useUserStore } from "../../../../store/useUserStore.js"; // Zustand Store
import { Google as GoogleIcon } from "@mui/icons-material";
function LoginButton({ type }) {
  const { googleLoginForMember } = useLoginApi();
  const { getUserInfo } = useUserApi();
  const { showSnackbar } = useSnackbar();
  const setToken = useUserStore((state) => state.setToken);
  useEffect(() => {
    /* global google */
    google.accounts.id.initialize({
      client_id: "642557482063-q866pb3tlp0blvso126q2i2si40qn6oh.apps.googleusercontent.com",
      callback: handleCredentialResponse,
    });
    // google.accounts.id.renderButton(
    //   document.getElementById("google-signin-button"),
    //   {
    //     theme: "filled_blue",
    //     size: "large",
    //     width: 400,
    //   }
    // );
  }, []);

  const handleCredentialResponse = async (response) => {
    // Here response.credential is a JWT token that can be sent to the backend to authenticate or resolve user information
    console.log("Encoded JWT ID token: ", response.credential);
    try {
      const res = await googleLoginForMember(response.credential);
      const newToken = res.data.token;
      //No token is registered to be audited by default
      if (!newToken) {
        showSnackbar({ message: "Automatic registration succeeded! Please wait for administrator review", severity: "success" });
      } else {
        //You can log in with a token
        await setToken(newToken, "member", getUserInfo);
        showSnackbar({ message: "Login Successful!", severity: "success" });
      }
    } catch (error) {
      if (error) {
        //Error handling should be done, otherwise the try-catch will not be able to see the error directly after the try-catch, resulting in the failure to find the problem
        showSnackbar({ message: error.message || "Failed. Please try again.", severity: "error" });
      }
    }
  };
  const handleGoogleLoginClick = () => {
    if (window.google) {
      google.accounts.id.prompt((notification) => {
        console.log("Google prompt notification:", notification);
      });
    }
  };
  return (<>


    {/* Social Login Buttons */}
    {/* <Box display="flex" justifyContent="center" gap={2}>
      <div id="google-signin-button"></div>
    </Box> */}
    <Button
      variant="contained"
      startIcon={<GoogleIcon />}
      sx={{
        backgroundColor: "#DB4437",
        color: "white",
        "&:hover": { backgroundColor: "#C1351D" },
        flex: 1,
      }}
      onClick={handleGoogleLoginClick}
    >
      Google
    </Button>
  </>);
}

export default LoginButton;