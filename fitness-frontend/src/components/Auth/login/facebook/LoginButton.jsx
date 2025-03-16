import React, { useEffect } from 'react';
import FacebookIcon from '@mui/icons-material/Facebook';
import {
  Button,
} from "@mui/material";
const LoginButton = () => {
  // 定义登录状态回调函数
  const statusChangeCallback = (response) => {
    console.log('Facebook login status:', response);
    // 在这里处理登录状态，比如保存 token、更新状态等
    // 假设已经拿到了 response.status === 'connected'
    window.FB.api(
      '/me',
      { fields: 'email,name,birthday' },  // 需要什么字段就写什么
      function (userInfo) {
        console.log('User info from FB:', userInfo);
        // userInfo 里会包含 { id, name, email } 等
      }
    );
  };

  // 点击按钮时调用 FB.login
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
    // 定义 fbAsyncInit 方法，在 SDK 加载后初始化
    window.fbAsyncInit = function () {
      window.FB.init({
        appId: '1156467402586370',      // 替换为你的 appId
        cookie: true,
        xfbml: true,
        version: 'v11.0',     // 替换为你使用的 API 版本，例如 v11.0
      });
      window.FB.AppEvents.logPageView();
      // 可选：初始化后直接检测登录状态
      // window.FB.getLoginStatus((response) => {
      //   statusChangeCallback(response);
      // });
    };

    // 动态加载 Facebook SDK 脚本
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
  }, []); // 空依赖数组，组件挂载时只执行一次

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
