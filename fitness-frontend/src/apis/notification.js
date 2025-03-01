import useAxios from "../request";
// We can manage the interfaces globally
const useNotificationApi = () => {
  let { httpRequest } = useAxios();
  const getNotificationList = (page, pageSize) => {
    return httpRequest({
      method: "get",
      url: `/user/notifications?page=${page}&pageSize=${pageSize}`,
    });
  };
  const markNotificationAsRead = (notificationId) => {
    return httpRequest({
      method: "put",
      url: `/user/notifications/${notificationId}/read`,
    });
  };
  const deleteNotification = (notificationId) => {
    return httpRequest({
      method: "delete",
      url: `/user/notifications/${notificationId}`,
    });
  };
  return {
    getNotificationList,
    markNotificationAsRead,
    deleteNotification,
  };
};
export default useNotificationApi;
