import { ConfigEnv, defineConfig, loadEnv } from "vite";
import uni from "@dcloudio/vite-plugin-uni";
import Unocss from "unocss/vite";
import AutoImport from "unplugin-auto-import/vite";

// https://vitejs.dev/config/
export default defineConfig((mode: ConfigEnv) => {
  const env = loadEnv(mode.mode, process.cwd());
  return {
    plugins: [
      uni({
        // 开启响应式语法糖
        vueOptions: {
          reactivityTransform: true,
        },
      }),
      Unocss(),
      AutoImport({
        dts: "src/typings/auto-imports.d.ts",
        imports: ["vue", "uni-app", "pinia"],
        dirs: ["src/composables"],
      }),
    ],
    server: {
      port: 8088,
      hmr: true, // 启用热更新
      proxy: {
        "/guopw": {
          target: env.VITE_PMS_APP_BASE_URL, // 目标服务器地址
          changeOrigin: true, // 是否修改请求头中的 Origin 字段
          rewrite: (path) => path.replace(/^\/guopw/, ""),
        },
      },
    },
  };
});
