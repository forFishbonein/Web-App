/**
 * @description [ axios encapsulation]
 */
import axios from "axios";
import config from "./config";
import { useUserStore } from "../store/useUserStore";
const useAxios = () => {

  const token = useUserStore((state) => state.token); // get token
  const service = axios.create({
    baseURL: config.baseApi,
    timeout: 10000,
    // withCredentials: true,
    headers: {
      "Content-Type": "application/json",
    },
  });
  service.interceptors.request.use(
    async function (config) {
      console.log(`${config.url}，token：${token}`)
      if (token && !config.headers["Authorization"]) {
        config.headers['Authorization'] = `Bearer ${token}`;
      }
      return config;
    },
    function (error) {
      return Promise.reject(error);
    }
  );
  service.interceptors.response.use(
    (response) => {
      const res = response?.data;
      if (res.code !== 200) {
        console.log("response：", response);
        console.log("If code is not 200, an error is reported by default");
        return Promise.reject(new Error(res.message || "Error"));
      } else {
        //Direct return response.data
        return response.data;
      }
    },
    (error) => {
      const res = error?.response;
      if (res) {
        console.log("error.response信息：")
        console.log(JSON.stringify(error.response))
        //Here can use a pop-up to print an error message
      } else {
        console.log("error信息：")
        console.log(JSON.stringify(error))
      }
      return Promise.reject(error);
    }
  );
  return { httpRequest: service };
}
export default useAxios;
