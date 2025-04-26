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

  // Center Management APIs
  const getFitnessCentres = () => {
    return httpRequest({
      method: "GET",
      url: "/admin/fitness-centres",
    });
  };

  const addFitnessCentre = (data) => {
    return httpRequest({
      method: "POST",
      url: "/admin/fitness-centres",
      data,
    });
  };

  const getFitnessCentreById = (id) => {
    return httpRequest({
      method: "GET",
      url: `/admin/fitness-centres/${id}`,
    });
  };

  const updateFitnessCentre = (id, data) => {
    return httpRequest({
      method: "PUT",
      url: `/admin/fitness-centres/${id}`,
      data,
    });
  };

  const deleteFitnessCentre = (id) => {
    return httpRequest({
      method: "DELETE",
      url: `/admin/fitness-centres/${id}`,
    });
  };

  const getSpecializations = () => {
    return httpRequest({
      method: "GET",
      url: "/admin/specializations",
    });
  };

  // Specialisation Management APIs
  const addSpecialization = (data) => {
    return httpRequest({
      method: "POST",
      url: "/admin/specializations",
      data,
    });
  };

  const deleteSpecialization = (id) => {
    return httpRequest({
      method: "DELETE",
      url: `/admin/specializations/${id}`,
    });
  };

  return {
    getAdminInfo,
    getPendingUsers,
    approveApplication,
    rejectApplication,
    getAllUsers,
    getFitnessCentres,
    addFitnessCentre,
    getFitnessCentreById,
    updateFitnessCentre,
    deleteFitnessCentre,
    getSpecializations,
    addSpecialization,
    deleteSpecialization,
  };
};
export default useAdminApi;
