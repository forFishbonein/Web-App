import useAxios from "../request";
// We can manage the interfaces globally
const useTrainerApi = () => {
  let { httpRequest } = useAxios();
  const getTrainerList = (page, pageSize, specializations, workplace) => {
    return httpRequest({
      method: "get",
      url: `/trainer/listTrainers?page=${page}&pageSize=${pageSize}&specializations=${specializations}&workplace=${workplace}`,
    });
  };
  return {
    getTrainerList,
  };
};
export default useTrainerApi;
