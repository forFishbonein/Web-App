/**
 * @description [ axios encapsulation]
 */
import axios from "axios";
import config from "./config";
import { useUserStore } from "../store/useUserStore";
import { useLoadingStore } from "../store/useLoadingStore";
import { errorNotifier } from "../utils/Hooks/SnackbarContext.jsx";
const useAxios = () => {
  const token = useUserStore((state) => state.token); // get token
  const setLoading = useLoadingStore((state) => state.setLoading);
  // const [needLoadingRing, setNeedLoadingRing] = useState(true);
  const service = axios.create({
    baseURL: config.baseApi,
    // timeout: 10000,
    timeout: 0,
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
      //Only interfaces that require a loading ring need to be set to true
      if (!config.meta?.noNeedLoadingRing) {
        setLoading(true);
      }
      return config;
    },
    function (error) {
      setLoading(false);
      return Promise.reject(error);
    }
  );
  service.interceptors.response.use(
    (response) => {
      setLoading(false);
      const res = response?.data;
      if (res?.code !== 200) {
        console.log("response：", res, { response });
        console.log("If code is not 200, an error is reported by default");
        // If message is not set, let the page handle it
        if (res?.message && res?.code) {
          errorNotifier.showError(res.message);
          return Promise.reject(); //This place must be returned; otherwise, you won't know there's an error in the code. By default, it will return resolve! It will cause the code logic in the page to execute downward unexpectedly
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
      setLoading(false);
      // Only axios errors are handled here
      errorNotifier.showError(error?.message || "Error");
      return Promise.reject(); //An error must be returned; otherwise, it will cause the code logic in the page to execute downward unexpectedly
    }
  );
  return { httpRequest: service };
}
export default useAxios;
