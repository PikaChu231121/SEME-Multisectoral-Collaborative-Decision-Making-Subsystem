<template>
  <ProConfigProvider>
    <router-view :key="key" #="{ Component }">
      <component :is="Component" />
    </router-view>
  </ProConfigProvider>
</template>

<script setup>
  import { computed } from 'vue';
  import { useRoute } from 'vue-router';
  // 路由中添加key解决切换路由时页面不展示内容，刷新后才展示内容问题
  const route = useRoute();
  const key = computed(() => {
    return route.path + Math.random();
  });
</script>
