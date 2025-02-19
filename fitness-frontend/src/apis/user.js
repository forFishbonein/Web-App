import useAxios from "../request";
// We can manage the interfaces globally
const useUserApi = () => {
  let { httpRequest } = useAxios();
  const getUserInfo = (token) => {
    return httpRequest({
      method: "post",
      url: `/userinfo`, //example
      headers: {
        Authorization: token ? `Bearer ${token}` : "",
      },
    });
  };
  return {
    getUserInfo,
  };
};
export default useUserApi;
