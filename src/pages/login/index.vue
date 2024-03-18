<template>
  <view class="login">
    <view class="login-box">
      <uv-form
        labelPosition="left"
        :model="loginParsms"
        :rules="rules"
        ref="formRef"
      >
        <uv-form-item label="用户名" labelWidth="50px" prop="loginParsms.userName" borderBottom>
          <uv-input placeholder="请输入用户名" border="surround" v-model="loginParsms.userName"></uv-input>
        </uv-form-item>
        <uv-form-item label="密码" labelWidth="50px" prop="loginParsms.passWord" borderBottom>
          <uv-input placeholder="请输入密码" v-model="loginParsms.passWord"  border="surround"> </uv-input>
        </uv-form-item>
        <uv-button
          type="primary"
          text="提交"
          customStyle="margin-top: 10px"
          @click="submit"
        ></uv-button>
      </uv-form>
    </view>
  </view>
</template>
<script setup lang="ts">
const loginParsms = reactive({
  userName: "",
  passWord: "",
});
const formRef = ref<any>(null);

const rules = {
  "loginParsms.userName": {
    type: "string",
    required: true,
    message: "请填写用户名",
    trigger: ["blur", "change"],
  },
  "loginParsms.passWord": {
    type: "string",
    required: true,
    message: "请填写密码",
    trigger: ["blur", "change"],
  },
};

// 提交
const submit = () => {
  console.log(loginParsms);
  // 如果有错误，会在catch中返回报错信息数组，校验通过则在then中返回true
  formRef.value
    .validate()
    .then((res) => {
      uni.showToast({
        icon: "success",
        title: "校验通过",
      });
    })
    .catch((errors) => {
      uni.showToast({
        icon: "error",
        title: "校验失败",
      });
    });
};
</script>
<style lang="scss" scoped></style>
