<template>
  <view class="login">
    <view class="login-box">
      <uv-form
        labelPosition="left"
        :model="signParsms"
        :rules="rules"
        ref="formRef"
      >
        <uv-form-item
          label="用户名"
          labelWidth="65px"
          prop="username"
          borderBottom
        >
          <uv-input
            placeholder="请输入用户名"
            border="surround"
            v-model="signParsms.username"
          ></uv-input>
        </uv-form-item>
        <uv-form-item
          label="密码"
          labelWidth="65px"
          prop="password"
          borderBottom
        >
          <uv-input
            placeholder="请输入密码"
            type="password"
            v-model="signParsms.password"
            border="surround"
          >
          </uv-input>
        </uv-form-item>
        <uv-form-item
          label="确认密码"
          labelWidth="65px"
          prop="newpassword"
          borderBottom
        >
          <uv-input
            placeholder="请输入密码"
            v-model="signParsms.newpassword"
            type="password"
            border="surround"
          >
          </uv-input>
        </uv-form-item>
        <uv-button
          type="primary"
          text="注册"
          customStyle="margin-top: 10px"
          @click="submit"
        ></uv-button>
        <view class="flex-center login" @click="loginClick">登录</view>
      </uv-form>
    </view>
  </view>
</template>
<script setup lang="ts">
import { reactive, ref } from "vue";
import { generateRandomString } from "../../utils";
import { aesEncrypt } from "../../utils/ase";
import { register } from "@/server/modules/login";
import useStore from "@/pinia";

const signParsms = reactive({
  username: "",
  password: "",
  newpassword: "",
});
const formRef = ref<any>(null);
const { user } = useStore()

// 自定义校验规则
const validatePass = (rule, value, callback) => {
  console.log(signParsms.password, value, "kknnn");
  if (signParsms.password !== value) {
    callback(new Error("两次输入密码不一致!"));
  } else {
    callback();
  }
};
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
  newpassword: [
    {
      type: "string",
      required: true,
      message: "请填写密码",
      trigger: ["blur", "change"],
    },
    { min: 6, max: 11, message: "长度在 3 到 11 个字符", trigger: "blur" }, // 自定义校验规则
    { validator: validatePass, trigger: "blur" },
  ],
};

// 提交
const submit = () => {
  // 如果有错误，会在catch中返回报错信息数组，校验通过则在then中返回true
  formRef.value
    .validate()
    .then((res) => {
      handleSign();
    })
    .catch((errors) => {
      
    });
};

const handleSign = async () => {
  //加密
  const key = generateRandomString(16);
  const obj = JSON.parse(JSON.stringify(signParsms));
  obj.password = await aesEncrypt(obj.password, key);
  obj.newpassword = "";
  obj.key = key;
  const res = await register(obj);
  if (!res.data) {
    return;
  }
  const data = res.data;
  switch (data.status) {
    case 200:
      user.setLoginParams({
         username: signParsms.username,
         password: signParsms.password
      })
      // 注册成功
      uni.showToast({
        icon: "success",
        title: data.msg,
      });
      uni.navigateTo({
        url: "/pages/login/index",
      });
      break;
    case 400:
      // 注册失败, 取消验证码
      uni.showToast({
        icon: "error",
        title: data.msg,
      });
      break;
  }
};

// 登录
const loginClick = () => {
  uni.navigateTo({
    url: "/pages/login/index",
  });
};
</script>
<style lang="scss" scoped>
.login {
  color: #5e98f6;
  margin-top: 16rpx;
}
</style>
