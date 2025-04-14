<template>
  <div class="register-box">
    <div class="register-logo">
      <img src="~@/assets/images/logo_tj.png" width="45" />
      <h1 class="mb-0 ml-2 text-3xl font-bold">社区智能巡检后台管理系统</h1>
    </div>
    <a-form layout="horizontal" :model="registerFormModel" @submit.prevent="handleRegister">
      <a-form-item>
        <a-input v-model:value="registerFormModel.adminName" size="large" placeholder="用户名">
          <template #prefix> <Icon icon="ant-design:user-outlined" /> </template>
        </a-input>
      </a-form-item>
      <a-form-item>
        <a-input v-model:value="registerFormModel.adminPhone" size="large" placeholder="手机号">
          <template #prefix> <Icon icon="ant-design:mobile-outlined" /> </template>
        </a-input>
      </a-form-item>
      <a-form-item>
        <a-input
          v-model:value="registerFormModel.password"
          size="large"
          type="password"
          placeholder="密码"
          autocomplete="new-password"
        >
          <template #prefix> <Icon icon="ant-design:lock-outlined" /></template>
        </a-input>
      </a-form-item>
      <a-form-item>
        <a-input
          v-model:value="registerFormModel.confirmPassword"
          size="large"
          type="password"
          placeholder="确认密码"
          autocomplete="new-password"
        >
          <template #prefix> <Icon icon="ant-design:lock-outlined" /></template>
        </a-input>
      </a-form-item>
      <a-form-item>
        <a-button type="primary" html-type="submit" size="large" :loading="loading" block>
          注册
        </a-button>
      </a-form-item>
      <!-- 返回登录按钮 -->
      <a-form-item>
        <a-button type="link" block @click="goToLogin">已有账号？点击登录</a-button>
      </a-form-item>
    </a-form>
  </div>
</template>

<script setup lang="ts">
  import { ref } from 'vue';
  import { useRoute, useRouter } from 'vue-router';
  import { message, Modal } from 'ant-design-vue';
  import { Icon } from '@/components/basic/icon';
  import { useUserStore } from '@/store/modules/user';
  // import Api from '@/api/';
  import { to } from '@/utils/awaitTo';

  const route = useRoute();
  const router = useRouter();
  const userStore = useUserStore();

  const loading = ref(false);
  // const captcha = ref('');
  const registerFormModel = ref({
    adminName: '',
    password: '',
    confirmPassword: '',
    adminPhone: '',
  });

  // const updateCaptcha = async () => {
  //   const data = await Api.captcha.captchaCaptchaByImg({ width: 100, height: 50 });
  //   captcha.value = data.img;
  //   loginFormModel.value.captchaId = data.id;
  // };
  // updateCaptcha();

  const handleRegister = async () => {
    // 注册逻辑（如手机号、密码验证）
    if (registerFormModel.value.password !== registerFormModel.value.confirmPassword) {
      message.error('密码和确认密码不一致！');
      return;
    }
    message.loading('注册中...', 0);
    loading.value = true;
    console.log(registerFormModel.value);
    // params.password = md5(password)

    // 执行注册逻辑
    const [err] = await to(userStore.register(registerFormModel.value));

    if (err) {
      message.destroy();
      Modal.error({
        title: () => '提示',
        content: () => err.message,
      });
      // updateCaptcha();
    } else {
      message.destroy();
      message.success('注册成功！');
      setTimeout(() => router.replace((route.query.redirect as string) || '/'));
    }
    loading.value = false;
  };

  const goToLogin = () => {
    router.replace('/login');
  };
</script>

<style lang="less" scoped>
  .register-box {
    display: flex;
    flex-direction: column;
    align-items: center;
    width: 100vw;
    height: 100vh;
    padding-top: 240px;
    background: url('@/assets/login.svg');
    background-size: 100%;

    .register-logo {
      display: flex;
      align-items: center;
      margin-bottom: 30px;

      .svg-icon {
        font-size: 48px;
      }
    }

    :deep(.ant-form) {
      width: 400px;

      .ant-col {
        width: 100%;
      }

      .ant-form-item-label {
        padding-right: 6px;
      }
    }
  }
</style>
