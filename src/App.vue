<!--
 * @Author: jt 2602818429@qq.com
 * @Date: 2023-11-30 16:21:52
 * @LastEditors: jt 2602818429@qq.com
 * @LastEditTime: 2023-12-08 15:05:56
 * @FilePath: \jt-design\src\App.vue
 * @Description: 这是默认设置,请设置`customMade`, 打开koroFileHeader查看配置 进行设置: https://github.com/OBKoro1/koro1FileHeader/wiki/%E9%85%8D%E7%BD%AE
-->

<template>
  <div class="main">
    <Header>
      <el-menu
        :default-active="activeIndex"
        class="el-menu-demo"
        mode="horizontal"
        background-color="#232529"
        text-color="#fff"
        active-text-color="#ffd04b"
        @select="handleSelect"
      >
      <template v-for="item in routers" :key="item.path">
        <el-menu-item  v-if="!item.children" :index="item.path">
          {{ item.name }}
        </el-menu-item>
        <el-sub-menu :index="item.path" v-else>
          <template #title>{{ item.name }}</template>
          <el-menu-item v-for="childItem in item.children" :index="childItem.path">{{childItem.name  }}</el-menu-item>
        </el-sub-menu>
      </template>  
      
        <!-- <el-menu-item index="1">Processing Center</el-menu-item>
        <el-sub-menu index="2">
          <template #title>Workspace</template>
          <el-menu-item index="2-1">item one</el-menu-item>
          <el-menu-item index="2-2">item two</el-menu-item>
          <el-menu-item index="2-3">item three</el-menu-item>
          <el-sub-menu index="2-4">
            <template #title>item four</template>
            <el-menu-item index="2-4-1">item one</el-menu-item>
            <el-menu-item index="2-4-2">item two</el-menu-item>
            <el-menu-item index="2-4-3">item three</el-menu-item>
          </el-sub-menu>
        </el-sub-menu>
        <el-menu-item index="3" disabled>Info</el-menu-item>
        <el-menu-item index="4">Orders</el-menu-item> -->
      </el-menu>
    </Header>
    <div>
      <div><router-view></router-view></div>
    </div>
  </div>
</template>

<script setup lang="ts">
import Header from './components/common/header.vue'
import { ref } from 'vue'
import router from './router';

//获取路由器列表
const routers = router.options.routes
console.log(routers)

const activeIndex = ref('1')
const handleSelect = (key: string) => {
  router.push(key);
}


</script>


<style scoped lang="less">
  .main {
      display: flex;
      flex-direction: column;
      height: 100vh;
      width: 100%;
      overflow: hidden;
  }

</style>
