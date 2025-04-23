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
  // List of specializations - TrainerProfile
  const listSpecializations = () => {
    return httpRequest({
      method: "get",
      url: `/user/specializations`,
    });
  };
  // MemberManagement
  const getPendingConnectRequests = () => {
    return httpRequest({
      method: "get",
      url: `/trainer/connect-requests/pending`,
    });
  };
  // MemberManagement
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
  // MemberManagement
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
  // MemberManagement
  const getConnectedMembers = () => {
    return httpRequest({
      method: "get",
      url: `/trainer/connected-members`,
    });
  };
  // SessionRequests
  const getPendingAppointments = () => {
    return httpRequest({
      method: "get",
      url: `/trainer/appointments/pending`,
    });
  };  
  // SessionRequests
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
  // MySessions
  const getApprovedAppointments = () => {
    return httpRequest({
      method: "get",
      url: `/trainer/appointments/approved`,
    });
  };
  // TrainerAvailability
  const updateAvailability = (availabilitySlots) => {
    return httpRequest({
      method: "post",
      url: "/trainer/availability",
      data: {
        availabilitySlots,
      },
    });
  };
  // TrainerAvailability
  const getAvailability = () => {
    return httpRequest({
      method: "get",
      url: `/trainer/availability`,
    });
  };  
  // TrainerProfile
  const updateTrainerProfile = (data) => {
    return httpRequest({
      method: "put",
      url: "/trainer/profile",
      data,
    });
  };
  // TrainerProfile
  const getTrainerProfile = () => {
    return httpRequest({
      method: "get",
      url: "/trainer/profile",
    });
  };
  // MySessions
  const completeAppointment = (appointmentId) => {
    return httpRequest({
      method: "put",
      url: "/trainer/appointment/complete",
      data: {
        appointmentId,
      },
    });
  };
  // MemberProgress
  const getAppointmentsGroupedByMember = () => {
    return httpRequest({
      method: "get",
      url: "/trainer/appointments/by-member",
    });
  };  
  // SessionRequests
  const getAlternativeTrainers = () => {
    return httpRequest({
      method: "get",
      url: "/trainer/alternative-trainers",
    });
  };
  // SessionRequests
  const rejectAppointment = (appointmentId, responseMessage, alternativeTrainerId, alternativeTrainerName) => {
    return httpRequest({
      method: "put",
      url: "/trainer/appointment/reject",
      data: {
        appointmentId,
        responseMessage,
        alternativeTrainerId,
        alternativeTrainerName,
      },
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
    getAvailability,
    updateTrainerProfile,
    getTrainerProfile,
    completeAppointment,
    getAppointmentsGroupedByMember,
    getAlternativeTrainers,
    rejectAppointment
  };
};
export default useTrainerApi;
