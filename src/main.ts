import { createSSRApp } from "vue";
import App from "./App.vue";
import "uno.css";
import { createPinia } from "pinia";
import piniaPluginPersistedstate from "pinia-plugin-persistedstate";
import "./styles/index.scss";

// 引入Pinia和持久缓存的设置
const pinia = createPinia();
pinia.use(piniaPluginPersistedstate);
export function createApp() {
  const app = createSSRApp(App).use(pinia);
  return {
    app,
  };
}
