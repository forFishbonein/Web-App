import React, { useEffect } from 'react';
import FacebookIcon from '@mui/icons-material/Facebook';
import {
  Button,
} from "@mui/material";
const LoginButton = () => {
  const statusChangeCallback = (response) => {
    console.log('Facebook login status:', response);
    window.FB.api(
      '/me',
      { fields: 'email,name,birthday' },
      function (userInfo) {
        console.log('User info from FB:', userInfo);
      }
    );
  };

  const handleFBLogin = () => {
    if (window.FB) {
      window.FB.login(
        (response) => {
          statusChangeCallback(response);
        },
        { scope: 'public_profile,email' }
      );
    }
  };

  useEffect(() => {
    window.fbAsyncInit = function () {
      window.FB.init({
        appId: '1156467402586370', 
        cookie: true,
        xfbml: true,
        version: 'v11.0', 
      });
      window.FB.AppEvents.logPageView();
    };

    //Facebook SDK
    (function (d, s, id) {
      let js,
        fjs = d.getElementsByTagName(s)[0];
      if (d.getElementById(id)) {
        return;
      }
      js = d.createElement(s);
      js.id = id;
      js.src = 'https://connect.facebook.net/en_US/sdk.js';
      fjs.parentNode.insertBefore(js, fjs);
    })(document, 'script', 'facebook-jssdk');
  }, []); 

  return (
    <Button
      variant="contained"
      startIcon={<FacebookIcon />}
      sx={{
        backgroundColor: "#1877F2",
        color: "white",
        "&:hover": { backgroundColor: "#145DBF" },
        flex: 1,
      }}
      onClick={handleFBLogin}
    >
      Facebook
    </Button>
  );
};

export default LoginButton;
