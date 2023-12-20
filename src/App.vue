<!--
 * @Author: jt 2602818429@qq.com
 * @Date: 2023-11-30 16:21:52
 * @LastEditors: jt 2602818429@qq.com
 * @LastEditTime: 2023-12-20 10:31:23
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
      <h1>测试</h1>
      </el-menu>
    </Header>
    <div>
      <div><router-view></router-view></div>
    </div>
  </div>
</template>

<script setup lang="ts">
import Header from './components/common/header.vue'
import { ref,onMounted} from 'vue'
import router from './router';
import request from '@/utils/request'
onMounted(()=>{
  request({
  url: '/api/user/login',
  method: "post",
  data: {
    username: 'admin',
    password: '111111'
  }
})
})
//获取路由器列表
const routers = router.options.routes
console.log(routers)

const activeIndex = ref('1')
const handleSelect = (key: string) => {
  router.push(key);
}


</script>


<style scoped lang="scss">

  .main {
      display: flex;
      flex-direction: column;
      height: 100vh;
      width: 100%;
      overflow: hidden;
  }

</style>
