<template>
  <div>
    <uv-button
      type="primary"
      text="退出登录"
      customStyle="margin-top: 10px"
      @click="loginOutClick"
    ></uv-button>
    <uv-modal
      ref="modal"
      title="提示"
      content="确认退出登录吗？"
      :showCancelButton="true"
      @confirm="confirm"
    ></uv-modal>
  </div>
</template>
<script setup lang="ts">
import { isLoginOut, loginOut } from "@/utils/login";
import { onShow } from "@dcloudio/uni-app";

onShow(() => {
  isLoginOut();
});

const modal = ref<any>(false);
const loginOutClick = () => {
  modal.value && modal.value.open();
};

// 确认退出
const confirm = () => {
  // 清除token
  loginOut();
};
</script>
<style lang="scss" scoped></style>
