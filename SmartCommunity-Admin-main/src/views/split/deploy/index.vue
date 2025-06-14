<template>
  <div class="container">
    <h2>模型部署</h2>
    <!-- 直接展示统一的 ModelDeployment 组件，不再依赖 modelId -->
    <ModelDeployment />
  </div>
</template>

<script>
  import ModelDeployment from '@/views/split/components/ModelDeployment.vue';
  export default {
    name: 'DeploymentPage',
    components: { ModelDeployment },
  };
</script>

<style scoped>
  /* ...existing container 样式... */
  .container {
    max-width: 1200px;
    margin: 0 auto;
    padding: 20px;
    border-radius: 8px;
    background: white;
    box-shadow: 0 2px 4px rgb(0 0 0 / 10%);
  }
</style>
