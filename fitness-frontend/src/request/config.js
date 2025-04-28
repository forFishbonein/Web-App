export default {
  env: process.env.NODE_ENV,
  title: "Fitness App",
  baseUrl: "", // 网页根路径
  baseApi: "/api", // 永远走 nginx 反向代理，开发代理同理
  // baseApi: "http://localhost:8080", // 永远走 nginx 反向代理，开发代理同理
};
