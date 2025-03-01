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

  return {
    getTrainerList,
    getTrainerInfo,
    connectTrainer,
  };
};
export default useTrainerApi;
