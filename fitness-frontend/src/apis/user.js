import useAxios from "../request";
// We can manage the interfaces globally
const useUserApi = () => {
  let { httpRequest } = useAxios();
  const getUserInfo = (token) => {
    return httpRequest({
      method: "get",
      url: `/member/user-profile`,
      headers: {
        Authorization: token ? `Bearer ${token}` : "",
      },
    });
  };
  const updateUserInfo = (address, dateOfBirth, name) => {
    return httpRequest({
      method: "post",
      url: `/user/user-profile`,
      data: {
        address,
        dateOfBirth,
        name,
      },
    });
  };
  const unSubscribe = () => {
    return httpRequest({
      method: "put",
      url: `/member/unsubscribe`,
    });
  };
  return {
    getUserInfo,
    updateUserInfo,
    unSubscribe,
  };
};
export default useUserApi;
