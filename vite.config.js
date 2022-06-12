// vite.config.js
import { defineConfig } from "vite";
import vue from "@vitejs/plugin-vue";
import dynamicImportVars from "@rollup/plugin-dynamic-import-vars";
import { viteExternalsPlugin } from "vite-plugin-externals";
import path from "path";

module.exports = defineConfig({
  plugins: [
    vue(),
    viteExternalsPlugin({
      taskday: "Components",
      vue: "Vue",
    }),
  ],
  build: {
    lib: {
      entry: path.resolve(__dirname, "resources/js/plugin.ts"),
      name: "plugin",
    },
    rollupOptions: {
      plugins: [dynamicImportVars()],
    },
  },
});
