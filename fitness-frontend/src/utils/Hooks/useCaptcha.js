import { useCallback } from "react";

// 验证码 App ID
const APP_ID = "190688044";

const useCaptcha = () => {
  // 触发验证码
  const onCaptchaShow = useCallback((onSuccess, onFailure) => {
    // try {
    // const captcha = new TencentCaptcha(
    //   APP_ID,
    //   (res) => callback(res, onSuccess, onFailure),
    //   {}
    // );
    // captcha.show();
    const ticket = `trerror_1001_${APP_ID}_${Math.floor(Date.now() / 1000)}`;
    callback(
      {
        ret: 0,
        randstr: "@" + Math.random().toString(36).substr(2),
        ticket: ticket,
        // errorCode: 1001,
        // errorMessage: "jsload_error",
      },
      onSuccess,
      onFailure
    );
    // } catch (error) {
    //   loadErrorCallback(onFailure);
    // }
  }, []);

  // 处理验证码结果
  const callback = useCallback((res, onSuccess, onFailure) => {
    console.log("callback:", res);
    if (res.ret === 0) {
      const randstr = res.randstr;
      const ticket = res.ticket;
      console.log("randstr:", randstr);
      console.log("ticket:", ticket);
      if (onSuccess) {
        onSuccess(ticket, randstr);
      }
    } else {
      if (onFailure) {
        onFailure("Captcha verification failed. Please try again.");
      }
    }
  }, []);

  // 处理验证码加载失败
  const loadErrorCallback = useCallback(
    (onFailure) => {
      const ticket = `trerror_1001_${APP_ID}_${Math.floor(Date.now() / 1000)}`;
      if (onFailure) {
        onFailure("Captcha JS failed to load. Please try again.");
      }
      callback(
        {
          ret: 500,
          randstr: "@" + Math.random().toString(36).substr(2),
          ticket: ticket,
          errorCode: 1001,
          errorMessage: "jsload_error",
        },
        null,
        onFailure
      );
    },
    [callback]
  );

  return { onCaptchaShow };
};

export default useCaptcha;
