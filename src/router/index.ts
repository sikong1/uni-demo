import { routes } from "./routes";
import { isLoginOut, whiteRouterArr } from "@/utils/login";

const list = ["navigateTo", "redirectTo", "reLaunch", "switchTab"];
list.forEach((item) => {
  uni.addInterceptor(item, {
    invoke(e) {
      const url = e.url.split("?")[0];
      console.log(url, "itemitemitem");
      const currentRoute = routes.find((item) => {
        return url === item.path;
      });
      // 如果是跳转登录、注册页，直接放行
      if (whiteRouterArr.includes(url)) {
        return e;
      }

      // 其他页面需要判断是否有token
      isLoginOut();

      return e;
    },
    fail(err) {
      // 失败回调拦截
      console.log(err);
    },
  });
});
