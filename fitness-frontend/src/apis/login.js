import useAxios from "../request";
// We can manage the interfaces globally
const useLoginApi = () => {
  let { httpRequest } = useAxios();
  const passwordLogin = (email, password) => {
    return httpRequest({
      method: "post",
      url: `/auth/user/password/login`, //example
      data: {
        email,
        password,
      },
    });
  };
  const getCaptcha = (email) => {
    return httpRequest({
      method: "get",
      url: `/auth/captcha/${email}`,
    });
  };
  return {
    passwordLogin,
    getCaptcha,
  };
};
export default useLoginApi;
