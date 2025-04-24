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
  // PendingMemberApplications and PendingTrainerApplications
  const getPendingUsers = (params = {}) => {
    return httpRequest({
      method: "GET",
      url: "/admin/pending-users",
      params,
    });
  };

  // PendingMemberApplications
  const approveApplication = (email) => {
    return httpRequest({
      method: "POST",
      url: "/admin/approve",
      data: { email },
    });
  };

  // PendingMemberApplications
  const rejectApplication = (email) => {
    return httpRequest({
      method: "POST",
      url: "/admin/reject",
      data: { email },
    });
  };

  // AllMembers
  const getAllUsers = (params = {}) => {
    return httpRequest({
      method: "GET",
      url: "/admin/users",
      params,
    });
  };
  
  return {
    getAdminInfo,
    getPendingUsers,
    approveApplication,
    rejectApplication,
    getAllUsers,
  };
};
export default useAdminApi;
