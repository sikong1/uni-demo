<template>
  <view class="login">
    <view class="login-box">
      <uv-form
        labelPosition="left"
        :model="loginParsms"
        :rules="rules"
        ref="formRef"
      >
        <uv-form-item
          label="用户名"
          labelWidth="50px"
          prop="username"
          borderBottom
        >
          <uv-input
            placeholder="请输入用户名"
            border="surround"
            v-model="loginParsms.username"
          ></uv-input>
        </uv-form-item>
        <uv-form-item
          label="密码"
          labelWidth="50px"
          prop="password"
          borderBottom
        >
          <uv-input
            placeholder="请输入密码"
            type="password"
            v-model="loginParsms.password"
            border="surround"
          >
          </uv-input>
        </uv-form-item>
        <uv-button
          type="primary"
          text="登录"
          customStyle="margin-top: 10px"
          @click="submit"
        ></uv-button>
        <view class="flex-center sign" @click="signClick">注册</view>
      </uv-form>
    </view>
  </view>
</template>
<script setup lang="ts">
import { onMounted, reactive, ref } from "vue";
import { generateRandomString } from "../../utils";
import { aesEncrypt } from "../../utils/ase";
import { login } from "@/server/modules/login";
import useStore from "@/pinia";
import { loginIn } from "@/utils/login";

const loginParsms = reactive({
  username: "",
  password: "",
});
const formRef = ref<any>(null);
const { user } = useStore();

onLoad(() => {
  loginParsms.username = user.loginParams.username;
  loginParsms.password = user.loginParams.password;
  user.setLoginParams({
    username: "",
    password: "",
  });
});

const rules = {
  username: [
    {
      type: "string",
      required: true,
      message: "请填写用户名",
      trigger: ["blur", "change"],
    },
    { min: 3, max: 5, message: "长度在 3 到 5 个字符", trigger: "blur" },
  ],
  password: [
    {
      type: "string",
      required: true,
      message: "请填写密码",
      trigger: ["blur", "change"],
    },
    { min: 6, max: 11, message: "长度在 3 到 11 个字符", trigger: "blur" },
  ],
};

// 提交
const submit = () => {
  // 如果有错误，会在catch中返回报错信息数组，校验通过则在then中返回true
  formRef.value
    .validate()
    .then((res) => {
      handleLogin();
    })
    .catch((errors) => {});
};

const handleLogin = async () => {
  //加密
  const key = generateRandomString(16);
  const params = {
    username: loginParsms.username,
    password: "",
    key: key,
  };
  params.password = await aesEncrypt(loginParsms.password, key);
  params.key = key;
  const res = await login(params);
  if (res.data.status === 200) {
    // 将user信息存入localStorage
    user.setUserInfo(res.data.user);
    loginIn(res.data.token);
  } else if (res.data.status === 400) {
    uni.showToast({
      icon: "error",
      title: res.data.msg,
    });
  }
};

// 注册
const signClick = () => {
  uni.navigateTo({
    url: "/pages/sign/index",
  });
};
</script>
<style lang="scss" scoped>
.sign {
  color: #5e98f6;
  margin-top: 16rpx;
}
</style>
