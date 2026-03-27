import { type Plugin, defineConfig } from "vite-plus";
import vue from "@vitejs/plugin-vue";
import VueI18nPlugin from "@intlify/unplugin-vue-i18n";
import { resolve } from "node:path";
import AutoImport from "unplugin-auto-import/vite";
import Components from "unplugin-vue-components/vite";
import { URL, fileURLToPath } from "node:url";

// @ts-expect-error process is a nodejs global
const host = process.env.TAURI_DEV_HOST;

// https://vite.dev/config/
export default defineConfig(async () => ({
  plugins: [
    vue(),
    VueI18nPlugin.vite({
      include: [resolve(__dirname, "./i18n/locales/**")],
      runtimeOnly: false,
    }),
    AutoImport({
      dts: "auto-imports.d.ts",
      imports: ["vue", "pinia", "vee-validate", "vue-i18n"],
      include: [/\.vue$/, /\.vue\?vue/, /\.ts$/],
      dirs: [
        "src/composables/**",
        "src/stores/**",
        "src/constants/**",
        "src/types/**",
        "src/directives/**",
        "src/db/**",
      ],
    }) as Plugin,
    Components({
      dirs: ["src/components/**"],
    }) as Plugin,
  ],
  resolve: {
    alias: {
      "@": fileURLToPath(new URL("./src", import.meta.url)),
    },
  },
  css: {
    preprocessorOptions: {
      scss: {
        silenceDeprecations: ["import", "mixed-decls", "color-functions", "global-builtin"],
      },
    },
  },
  // Vite options tailored for Tauri development and only applied in `tauri dev` or `tauri build`
  //
  // 1. prevent Vite from obscuring rust errors
  clearScreen: false,
  // 2. tauri expects a fixed port, fail if that port is not available
  server: {
    port: 1420,
    strictPort: true,
    host: host || false,
    hmr: host
      ? {
          protocol: "ws",
          host,
          port: 1421,
        }
      : undefined,
    watch: {
      // 3. tell Vite to ignore watching `src-tauri`
      ignored: ["**/src-tauri/**"],
    },
  },
}));
