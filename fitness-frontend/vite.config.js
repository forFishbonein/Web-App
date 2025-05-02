import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import strip from "@rollup/plugin-strip";
import viteCompression from "vite-plugin-compression";
export default defineConfig({
  plugins: [
    react(),
    strip({
      include: ["**/*.js", "**/*.jsx"],
      functions: ["console.log", "assert.*"],
      debugger: true, // 也可以 strip debugger
      // functions: ["console.debug", "debugLog"] //如果用了debugLog工具类
    }),
    // viteCompression({
    //   verbose: true,
    //   disable: false,
    //   deleteOriginFile: false,
    //   threshold: 10240, // 超过 10 KB 才压
    //   algorithm: "brotliCompress",
    //   ext: ".br",
    // }),
  ],
  build: {
    rollupOptions: {
      output: {
        manualChunks(id) {
          // 把所有 react 系列都打到同一个 vendor-react.js
          if (id.includes("node_modules")) {
            if (
              id.match(/node_modules\/react($|\/)/) ||
              id.match(/node_modules\/react-dom($|\/)/)
            ) {
              return "vendor-react";
            }
            // 其它拆分策略…
            if (id.includes("node_modules/lodash")) return "vendor-lodash";
            if (id.includes("node_modules/@mui")) return "vendor-mui"; //（按需引入后只含用到的组件）
            // return "vendor-others"; //这个不行，会导致依赖混乱
          }
          //这个也不行，因为动态引入本来就有默认拆包了
          // if (id.includes("src/pages/member")) {
          //   return "member-pages";
          // }
        },
      },
    },
    // 下面几个可选，小包更小更快
    cssCodeSplit: true,
    sourcemap: false,
    minify: "esbuild",
    chunkSizeWarningLimit: 500,
  },
});
