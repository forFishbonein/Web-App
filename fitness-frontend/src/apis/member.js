import useAxios from "../request";
// We can manage the interfaces globally
const useMemberApi = () => {
  let { httpRequest } = useAxios();
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
  const getDynamicAppointmentStatistics = (startDate, endDate) => {
    return httpRequest({
      method: "get",
      url: `/member/appointments/statistics/dynamic?startDate=${startDate}&endDate=${endDate}`,
    });
  };
  const getUpcomingAppointments = (page, pageSize, status) => {
    return httpRequest({
      method: "get",
      url: `/member/appointments/upcoming?page=${page}&pageSize=${pageSize}&status=${status}`,
    });
  };
  const getHistoricalAppointments = (page, pageSize, status) => {
    return httpRequest({
      method: "get",
      url: `/member/appointments/history?page=${page}&pageSize=${pageSize}&status=${status}`,
    });
  };
  const cancelAppointment = (appointmentId) => {
    return httpRequest({
      method: "put",
      url: `/member/appointment/cancel/${appointmentId}`,
    });
  };
  const getFitnessCentreLocations = () => {
    return httpRequest({
      method: "get",
      url: `/user/locations`,
    });
  };

  return {
    bookASession,
    membertGetTrainerAvailability,
    getDynamicAppointmentStatistics,
    getUpcomingAppointments,
    getHistoricalAppointments,
    cancelAppointment,
    getFitnessCentreLocations,
  };
};
export default useMemberApi;
