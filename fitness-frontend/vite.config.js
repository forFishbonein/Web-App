import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import strip from "@rollup/plugin-strip";
export default defineConfig({
  plugins: [
    react(),
    strip({
      include: ["**/*.js", "**/*.jsx"],
      functions: ["console.log", "assert.*"],
      debugger: true, // 也可以 strip debugger
      // functions: ["console.debug", "debugLog"] //如果用了debugLog工具类
    }),
  ],
  build: {
    rollupOptions: {
      output: {
        manualChunks(id) {
          if (id.includes("node_modules")) {
            return "vendor"; // 把所有依赖打到 vendor.js
          }
          if (id.includes("src/pages/member")) {
            return "member-pages"; // 专门为会员页拆一个包
          }
          // 需要再加其它规则就写在这里
        },
      },
    },
    chunkSizeWarningLimit: 500, // KB
  },
});
