import { useCallback } from "react";

// code App ID
const APP_ID = "190688044";

const useCaptcha = () => {
  // Trigger verification code
  // need logic //Verify the logic of the code
  const onCaptchaShow = useCallback((onSuccess, onFailure) => {
    try {
      const captcha = new TencentCaptcha(
        APP_ID,
        (res) => callback(res, onSuccess, onFailure),
        {}
      );
      captcha.show();
    } catch (error) {
      loadErrorCallback(onFailure);
    }
  }, []);

  //logic simulation // Remove the verification code (optional, just switch between the two)
  // const onCaptchaShow = useCallback((onSuccess, onFailure) => {
  //   //Call the callback directly and provide fake data.
  //   const ticket = `trerror_1001_${APP_ID}_${Math.floor(Date.now() / 1000)}`;
  //   callback(
  //     {
  //       ret: 0,
  //       randstr: "@" + Math.random().toString(36).substr(2),
  //       ticket: ticket,
  //     },
  //     onSuccess,
  //     onFailure
  //   );
  // }, []);

  // Process the verification code results
  const callback = useCallback((res, onSuccess, onFailure) => {
    console.log("callback:", res);
    if (res.ret === 0) {
      const randstr = res.randstr;
      const ticket = res.ticket;
      // console.log("randstr:", randstr);
      // console.log("ticket:", ticket);
      if (onSuccess) {
        onSuccess(ticket, randstr);
      }
    } else {
      if (onFailure) {
        onFailure("Captcha verification failed. Please try again.");
      }
    }
  }, []);

  // Handle the failure to load the verification code
  const loadErrorCallback = useCallback(
    (onFailure) => {
      const ticket = `trerror_1001_${APP_ID}_${Math.floor(Date.now() / 1000)}`;
      if (onFailure) {
        onFailure("Captcha JS failed to load. Please try again.");
      }
      // Even when it fails, it won't stop the logic. Just keep going
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
