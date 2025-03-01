import useAxios from "../request";
// We can manage the interfaces globally
const useUserApi = () => {
  let { httpRequest } = useAxios();
  const getUserInfo = (token) => {
    return httpRequest({
      method: "get",
      url: `/member/user-profile`, //example
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
  const bookASession = (data) => {
    return httpRequest({
      method: "post",
      url: `/member/appointment`,
      data,
    });
  };
  const membertGetTrainerAvailability = (trainerId) => {
    return httpRequest({
      method: "get",
      url: `/member/trainer/${trainerId}/availability`,
    });
  };
  return {
    getUserInfo,
    updateUserInfo,
    bookASession,
    membertGetTrainerAvailability,
  };
};
export default useUserApi;
