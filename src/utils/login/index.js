import { getStore, removeStore, setStore } from "@/utils/storage";
import { tokenStore, redirectStore } from "@/pages/login";
import useStore from "@/pinia";


const type = {
  loginOut: 'loginOut',
  loginIn: 'loginIn',
  loginOut401: 'loginOut401',
  loginOut403: 'loginOut403',
}

// 重置计时器
const resetTimer = (type) => {
  if (type !== timer.type) {
    timer.num = '0'
    timer.type = type
  }
}

const timer = {
  num: '0',
  type: type.loginOut
}
const endTime = 500
export const isLoginOut = () => {
  const isLogin = getStore({
    name: tokenStore
  })
  if (!isLogin) {
    loginOut401Message()
    return {
      token: false
    }
  }
  return {
    token: isLogin
  }
}

export const loginOut401Message = () => {
  const now = new Date().getTime()
  resetTimer(type.loginOut401)
  if (now - timer.num > endTime) {
    timer.num = now
    uni.showToast({
      icon: "error",
      title: "无权限，请重新登录",
    });
    clearLoginInfo()
    uni.navigateTo({
      url: '/pages/login/index',
    });
  }
}
export const loginOut403Message = () => {
  const now = new Date().getTime()
  resetTimer(type.loginOut403)
  if (now - timer.num > endTime) {
    timer.num = now
    uni.showToast({
      icon: "warning",
      title: "登录过期，请重新登录",
    });
    clearLoginInfo()
    uni.navigateTo({
      url: '/pages/login/index',
    });
  }
}

export const loginInMessage = () => {
  uni.showToast({
    icon: "success",
    title: "登录成功",
  });
}

export const loginOut = () => {
  const now = new Date().getTime()
  resetTimer(type.loginOut)
  if (now - timer.num > endTime) {
    timer.num = now
    // 保存当前路由
    setStore({
      name: redirectStore,
      content: 'router.currentRoute.value.fullPath'
    })
    removeStore({
      name: tokenStore
    })
    clearLoginInfo()
    uni.navigateTo({
      url: '/pages/login/index',
    });
  }
}

export const loginIn = (token) => {
  console.log(1);
  const now = new Date().getTime()
  resetTimer(type.loginIn)
  console.log(2, now - timer.num, timer, now);
  if (now - timer.num > endTime) {
    console.log(3);
    timer.num = now
    loginInMessage()
    setStore({
      name: tokenStore,
      content: token,
    })
    // 重定向到之前的页面, 不存在则跳转到首页
    const redirect = getStore({
      name: redirectStore
    })
    uni.navigateTo({
      url: redirect ? redirect : '/pages/home/index',
    });
  }
}

// 清除登录信息
export const clearLoginInfo = () => {
  const user = useStore().user
  user.setUserInfo({})
}