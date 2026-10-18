import { defineConfig } from "vite";
import { fileURLToPath } from "node:url";
import { resolve } from "node:path";

const rootDir = fileURLToPath(new URL(".", import.meta.url));

export default defineConfig({
  build: {
    rollupOptions: {
      input: {
        main: resolve(rootDir, "index.html"),
        login: resolve(rootDir, "login/index.html"),
        signup: resolve(rootDir, "signup/index.html"),
        dashboard: resolve(rootDir, "dashboard/index.html"),
        updateAccount: resolve(rootDir, "dashboard/updateAccount/index.html"),
        changePassword: resolve(rootDir, "dashboard/changePassword/index.html"),
        createNote: resolve(rootDir, "dashboard/createNote/index.html"),
        deleteAccount: resolve(rootDir, "dashboard/deleteAccount/index.html"),
        notes: resolve(rootDir, "dashboard/notes/index.html"),
      },
    },
  },
});
