/**
 * @description [ axios encapsulation]
 */
import axios, { AxiosError } from "axios";
import config from "./config";
import { useUserStore } from "../store/useUserStore";
import { errorNotifier } from "../utils/Hooks/SnackbarContext.jsx";
const useAxios = () => {
  const token = useUserStore((state) => state.token); // get token
  const service = axios.create({
    baseURL: config.baseApi,
    timeout: 10000,
    withCredentials: true,
    headers: {
      "Content-Type": "application/json",
    },
  });

  service.interceptors.request.use(
    async function (config) {
      // console.log(`${config.url}，token：${token}`)
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
      if (res?.code !== 200) {
        console.log("response：", res, { response });
        console.log("If code is not 200, an error is reported by default");
        // If message is not set, let the page handle it
        if (res?.message && res?.code) {
          errorNotifier.showError(res.message);
          return Promise.reject(); //这个地方必须要返回，否则不知道代码出了错误，默认会返回 resolve 的！会导致页面中代码逻辑意外向下执行
        } else { //If message is not set, let the page handle it
          console.log("error：", res);
          return Promise.reject(new Error(""));
        }
      } else {
        //Direct return response.data
        return res;
      }
    },
    (error) => {
      // Only axios errors are handled here
      errorNotifier.showError(error?.message || "Error");
      return Promise.reject(); //必须返回错误，否则会导致页面中代码逻辑意外向下执行
    }
  );
  return { httpRequest: service };
}
export default useAxios;
