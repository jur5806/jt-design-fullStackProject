<!--
 * @Author: jt 2602818429@qq.com
 * @Date: 2023-11-30 16:21:52
 * @LastEditors: jt 2602818429@qq.com
 * @LastEditTime: 2023-11-30 18:14:29
 * @FilePath: \jt-design\src\App.vue
 * @Description: 这是默认设置,请设置`customMade`, 打开koroFileHeader查看配置 进行设置: https://github.com/OBKoro1/koro1FileHeader/wiki/%E9%85%8D%E7%BD%AE
-->

<template>
  <Header></Header>
  <div>
    <el-button >Click me</el-button>
    <router-link to="/about">Go to About</router-link>
    <br />
    <router-link to="/">Go to Home</router-link>
    <div><router-view></router-view></div>
  </div>
</template>

<script setup lang="ts">
import Header from './components/common/header.vue'



</script>


<style scoped>

</style>
