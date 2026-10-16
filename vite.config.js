import { defineConfig } from "vite";
import { resolve } from "path";

export default defineConfig({
  build: {
    rollupOptions: {
      input: {
        main: resolve(import.meta.dirname, "index.html"),
        login: resolve(import.meta.dirname, "login/index.html"),
        dashboard: resolve(import.meta.dirname, "dashboard/index.html"),
      },
    },
  },
});