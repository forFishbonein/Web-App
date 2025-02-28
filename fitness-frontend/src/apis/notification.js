import useAxios from "../request";
// We can manage the interfaces globally
const useNotificationApi = () => {
  let { httpRequest } = useAxios();
  const getNotificationList = (page, pageSize) => {
    return httpRequest({
      method: "get",
      url: `/member/notifications?page=${page}&pageSize=${pageSize}`,
    });
  };
  const markNotificationAsRead = (notificationId) => {
    return httpRequest({
      method: "put",
      url: `/member/notifications/${notificationId}/read`,
    });
  };
  const deleteNotification = (notificationId) => {
    return httpRequest({
      method: "delete",
      url: `/member/notifications/${notificationId}`,
    });
  };
  return {
    getNotificationList,
    markNotificationAsRead,
    deleteNotification,
  };
};
export default useNotificationApi;
