import { defineConfig } from "vite";
import uni from "@dcloudio/vite-plugin-uni";
import Unocss from 'unocss/vite'
import AutoImport from 'unplugin-auto-import/vite'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [uni({
    // 开启响应式语法糖 
    vueOptions: { 
      reactivityTransform: true
    } 
  }), Unocss(),
  AutoImport({
    dts: 'src/typings/auto-imports.d.ts',
    imports: ['vue', 'uni-app', 'pinia'],
    dirs: ['src/composables']
})]
});
