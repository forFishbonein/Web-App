import useAxios from "../request";
// We can manage the interfaces globally
const useLoginApi = () => {
  let { httpRequest } = useAxios();
  const passwordLogin = (email, password, ticket, randStr, role) => {
    return httpRequest({
      method: "post",
      url: `/user/login`,
      data: {
        email,
        password,
        captchaRandstr: randStr,
        captchaTicket: ticket,
        role,
      },
    });
  };
  const googleLoginForMember = (idToken) => {
    return httpRequest({
      method: "post",
      url: `/user/google-login`,
      data: {
        idToken,
      },
    });
  };
  const getCaptchaAndSignUp = (data) => {
    return httpRequest({
      method: "post",
      url: `/user/signup`,
      data,
    });
  };
  const verifyCode = (code, email) => {
    return httpRequest({
      method: "post",
      url: `/user/verify-code`,
      data: {
        code,
        email,
      },
    });
  };
  const forgetPassword = (email, ticket, randStr) => {
    return httpRequest({
      method: "post",
      url: `/user/forgot-password`,
      data: {
        email,
        captchaRandstr: randStr,
        captchaTicket: ticket,
      },
    });
  };
  const resetPassword = (newPassword, token) => {
    return httpRequest({
      method: "post",
      url: `/user/reset-password`,
      data: {
        newPassword,
        token,
      },
    });
  };
  const changePassword = (newPassword, oldPassword) => {
    return httpRequest({
      method: "post",
      url: `/user/change-password`,
      data: {
        newPassword,
        oldPassword,
      },
    });
  };
  return {
    passwordLogin,
    googleLoginForMember,
    getCaptchaAndSignUp,
    verifyCode,
    forgetPassword,
    resetPassword,
    changePassword,
  };
};
export default useLoginApi;
