<template>
  <div class="container">
    <!-- 注册区域，包含 ModelTab 与 DeviceTab -->
    <div class="register-section">
      <div class="register-card">
        <ModelTab @success="handleModelRegisterSuccess" @error="handleRegisterError" />
      </div>
      <div class="register-card">
        <DeviceTab @success="handleDeviceRegisterSuccess" @error="handleRegisterError" />
      </div>
    </div>
  </div>
</template>

<script>
  import ModelTab from '@/views/split/components/ModelTab.vue';
  import DeviceTab from '@/views/split/components/DeviceTab.vue';

  export default {
    name: 'RegisterPage',
    components: { ModelTab, DeviceTab },
    methods: {
      handleModelRegisterSuccess() {
        this.$message.success('模型注册成功');
      },
      handleDeviceRegisterSuccess() {
        this.$message.success('设备注册成功');
      },
      handleRegisterError(error) {
        this.$message.error(error);
      },
    },
  };
</script>

<style scoped>
  /* ...existing container/register-section/register-card 样式... */
  .container {
    max-width: 1200px;
    margin: 0 auto;
    padding: 20px;
  }

  .register-section {
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 20px;
    margin-bottom: 30px;
  }

  .register-card {
    display: flex;
    flex-direction: column;
    height: 100%;
    border-radius: 8px;
  }
</style>
