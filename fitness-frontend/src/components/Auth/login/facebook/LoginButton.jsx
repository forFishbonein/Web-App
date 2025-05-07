import React, { useEffect } from 'react';
import FacebookIcon from '@mui/icons-material/Facebook';
import {
  Button,
} from "@mui/material";
import { useSnackbar } from "../../../../utils/Hooks/SnackbarContext.jsx";
const LoginButton = () => {
  const { showSnackbar } = useSnackbar();
  const statusChangeCallback = (response) => {
    console.log('Facebook login status:', response);
    window.FB.api(
      '/me',
      { fields: 'email,name,birthday' },
      function (userInfo) {
        // alert(JSON.stringify(userInfo));
        /**
         * {
            "email": "haowhenhai@gmail.com",
            "name": "Wenhai Hao",
            "id": "122093462504803824"
           }
         */
        console.log('User info from FB:', userInfo);
        handleFBLoginResponse(userInfo);
      }
    );
  };
  const handleFBLoginResponse = async (userInfo) => {
    // Here response.credential is a JWT token that can be sent to the backend to authenticate or resolve user information
    console.log("userInfo from FB: ", userInfo);
    try {
      showSnackbar({ message: "Login Successful!", severity: "success" });
      // const res = await googleLoginForMember(response);
      // const newToken = res.data.token;
      // //No token is registered to be audited by default
      // if (!newToken) {
      //   showSnackbar({ message: "Automatic registration succeeded! Please wait for administrator review", severity: "success" });
      // } else {
      //   //You can log in with a token
      //   await setToken(newToken, "member", getUserInfo);
      //   showSnackbar({ message: "Login Successful!", severity: "success" });
      // }
    } catch (error) {
      if (error) {
        //Error handling should be done, otherwise the try-catch will not be able to see the error directly after the try-catch, resulting in the failure to find the problem
        showSnackbar({ message: error.message || "Failed. Please try again.", severity: "error" });
      }
    }
  };
  const handleFBLogin = () => {
    console.log("login start"); //Because the packaging is removed by default from console.log, we can't see any output because docker-compose is equivalent to packaging
    //Because the packaging is removed by default from console.log, we can't see any output because docker-compose is equivalent to packaging
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
