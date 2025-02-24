import useAxios from "../request";
// We can manage the interfaces globally
const useAdminApi = () => {
  let { httpRequest } = useAxios();
  const getAdminInfo = (token) => {
    return httpRequest({
      method: "get",
      url: `/admin/profile`,
      headers: {
        Authorization: token ? `Bearer ${token}` : "",
      },
    });
  };
  return {
    getAdminInfo,
  };
};
export default useAdminApi;
