import { defineConfig } from "vite";

export default defineConfig({
  base: "/PARKHOUND/",
  build: {
    sourcemap: true,
    rollupOptions: {
      input: {
        main: "index.html",
        about: "about.html",
        contact: "contact.html",
      },
    },
  },
});
