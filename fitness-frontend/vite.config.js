import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import strip from "@rollup/plugin-strip";
export default defineConfig({
  plugins: [
    react(),
    //Remove the debugging code
    strip({
      include: ["**/*.js", "**/*.jsx"],
      functions: ["console.log", "assert.*"],
      debugger: true,
      // functions: ["console.debug", "debugLog"]
    }),
  ],
  build: {
    rollupOptions: {
      output: {
        manualChunks(id) {
          if (id.includes("node_modules")) {
            // Type all the react series into the same vendor-react.js
            if (
              id.match(/node_modules\/react($|\/)/) ||
              id.match(/node_modules\/react-dom($|\/)/)
            ) {
              return "vendor-react";
            }
            // Other splitting strategies...
            if (id.includes("node_modules/lodash")) return "vendor-lodash";
            if (id.includes("node_modules/@mui")) return "vendor-mui";
          }
        },
      },
    },
    // Small bags are smaller and faster
    cssCodeSplit: true,
    sourcemap: false,
    minify: "esbuild",
    chunkSizeWarningLimit: 500,
  },
});
