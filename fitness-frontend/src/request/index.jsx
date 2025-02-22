/**
 * @description [ axios encapsulation]
 */
import axios from "axios";
import config from "./config";
import { useUserStore } from "../store/useUserStore";
import { errorNotifier } from "../utils/Hooks/SnackbarContext.jsx";
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
      //Normally, the exception code returned by the back end will still go here
      if (res?.code !== 200) {
        console.log("response：", res);
        console.log("If code is not 200, an error is reported by default");
        return Promise.reject({ response }); // Force the error handling logic
      } else {
        //Direct return response.data
        return res;
      }
    },
    (error) => {
      // From code! ==200 logic jump over
      const res = error?.response;
      console.log(res);
      // As long as you set code then the back end must set message
      if (res?.data?.message && res?.data?.code) {
        // error.message = res.data.message;
        errorNotifier.showError(res.data.message);
        alert(111)
        return Promise.reject();
      } else if (error?.message) { //Otherwise, let the page handle it
        console.log("error.message：", error?.message, error);
        // errorNotifier.showError(error?.message);
        alert(222)
        return Promise.reject(error);
      } else { //Otherwise, let the page handle it
        console.log("error：", error);
        alert(333)
        return Promise.reject(error);
      }
    }
  );
  return { httpRequest: service };
}
export default useAxios;
