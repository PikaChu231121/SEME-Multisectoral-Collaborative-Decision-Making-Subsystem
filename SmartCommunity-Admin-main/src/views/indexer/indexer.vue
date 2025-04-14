<template>
  <div class="app">
    <nav class="nav">
      <router-link to="/">首页</router-link> |
      <router-link to="/about">关于</router-link>
    </nav>
    <router-view />
  </div>
</template>

<script>
  export default {
    name: 'App',
  };
</script>

<!--<template>-->
<!--  <div class="home">-->
<!--    <h1>{{ title }}</h1>-->
<!--    <div class="content">-->
<!--      <counter-component />-->
<!--      <todo-list />-->
<!--    </div>-->
<!--  </div>-->
<!--</template>-->

<!--// src/views/Home.vue-->
<!--<script>-->
<!--  import CounterComponent from '@/components/CounterComponent.vue';-->
<!--  import TodoList from '@/components/TodoList.vue';-->

<!--  export default {-->
<!--    name: 'Home',-->
<!--    components: {-->
<!--      CounterComponent,-->
<!--      TodoList,-->
<!--    },-->
<!--    data() {-->
<!--      return {-->
<!--        title: '欢迎使用 Vue!',-->
<!--      };-->
<!--    },-->
<!--  };-->
<!--</script>-->

<style>
  .app {
    color: #2c3e50;
    font-family: Arial, sans-serif;
    -webkit-font-smoothing: antialiased;
    -moz-osx-font-smoothing: grayscale;
    text-align: center;
  }

  .nav {
    padding: 30px;
  }

  .nav a {
    margin: 0 10px;
    color: #2c3e50;
    font-weight: bold;
    text-decoration: none;
  }

  .nav a.router-link-exact-active {
    color: #42b983;
  }
</style>

<!--<style scoped>-->
<!--  .home {-->
<!--    padding: 20px;-->
<!--  }-->

<!--  .content {-->
<!--    max-width: 800px;-->
<!--    margin: 0 auto;-->
<!--  }-->
<!--</style>-->
