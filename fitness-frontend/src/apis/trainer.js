import useAxios from "../request";
// We can manage the interfaces globally
const useTrainerApi = () => {
  let { httpRequest } = useAxios();
  const getTrainerList = (page, pageSize, specializations, workplace) => {
    return httpRequest({
      method: "get",
      url: `/member/listTrainers?page=${page}&pageSize=${pageSize}&specializations=${specializations}&workplace=${workplace}`,
    });
  };
  const getTrainerInfo = (token) => {
    return httpRequest({
      method: "get",
      url: `/trainer/profile`,
      headers: {
        Authorization: token ? `Bearer ${token}` : "",
      },
    });
  };
  const connectTrainer = (data) => {
    return httpRequest({
      method: "post",
      url: `/member/connect-trainer`,
      data,
    });
  };
  const listSpecializations = () => {
    return httpRequest({
      method: "get",
      url: `/user/specializations`,
    });
  };
  const getPendingConnectRequests = () => {
    return httpRequest({
      method: "get",
      url: `/trainer/connect-requests/pending`,
    });
  };
  const acceptConnectRequest = (requestId, responseMessage = "") => {
    return httpRequest({
      method: "put",
      url: `/trainer/connect-request/accept`,
      data: {
        requestId,
        responseMessage,
      },
    });
  };
  const rejectConnectRequest = (requestId, responseMessage = "") => {
    return httpRequest({
      method: "put",
      url: `/trainer/connect-request/reject`,
      data: {
        requestId,
        responseMessage,
      },
    });
  };
  const getConnectedMembers = () => {
    return httpRequest({
      method: "get",
      url: `/trainer/connected-members`,
    });
  };
  const getPendingAppointments = () => {
    return httpRequest({
      method: "get",
      url: `/trainer/appointments/pending`,
    });
  };  
  const acceptAppointment = (appointmentId, responseMessage = "") => {
    return httpRequest({
      method: "put",
      url: `/trainer/appointment/accept`,
      data: {
        appointmentId,
        responseMessage,
      },
    });
  };  
  const getApprovedAppointments = () => {
    return httpRequest({
      method: "get",
      url: `/trainer/appointments/approved`,
    });
  };
  const updateAvailability = (availabilitySlots) => {
    return httpRequest({
      method: "post",
      url: "/trainer/availability",
      data: {
        availabilitySlots,
      },
    });
  };  
  const updateTrainerProfile = (data) => {
    return httpRequest({
      method: "put",
      url: "/trainer/profile",
      data,
    });
  };
  const getTrainerProfile = () => {
    return httpRequest({
      method: "get",
      url: "/trainer/profile",
    });
  };
  
  return {
    getTrainerList,
    getTrainerInfo,
    connectTrainer,
    listSpecializations,
    getPendingConnectRequests,
    acceptConnectRequest,
    rejectConnectRequest,
    getConnectedMembers,
    getPendingAppointments,
    acceptAppointment,
    getApprovedAppointments,
    updateAvailability,
    updateTrainerProfile,
    getTrainerProfile,
  };
};
export default useTrainerApi;
