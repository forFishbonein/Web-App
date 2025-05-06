export default {
  env: process.env.NODE_ENV,
  title: "Fitness App",
  baseUrl: "", // Web page root path
  baseApi: "/api", // Always use nginx reverse proxy, and the same applies to development proxies
  // baseApi: "http://localhost:8080",
};
