<!--
 * @Author: jt 2602818429@qq.com
 * @Date: 2023-11-30 16:21:52
 * @LastEditors: jt 2602818429@qq.com
 * @LastEditTime: 2023-12-21 14:45:59
 * @FilePath: \jt-design\src\App.vue
 * @Description: 这是默认设置,请设置`customMade`, 打开koroFileHeader查看配置 进行设置: https://github.com/OBKoro1/koro1FileHeader/wiki/%E9%85%8D%E7%BD%AE
-->

<template>
  <div class="main">
    <Header v-if="newRoute != '/login'">
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
        <el-menu-item  v-if="!item.children && item.meta?item.meta.show:false" :index="item.path">
          {{ item.name }}
        </el-menu-item>
        <el-sub-menu :index="item.path" v-else-if="item.meta?item.meta.show:false">
          <template #title>{{ item.name }}</template>
          <el-menu-item v-for="childItem in item.children" :index="childItem.path">{{childItem.name  }}</el-menu-item>
        </el-sub-menu>
      </template>
      </el-menu>
    </Header>
    <div class="body-cont">
      <router-view></router-view>
    </div>
  </div>
</template>

<script setup lang="ts">
import Header from './components/common/header.vue'
import { ref,watch} from 'vue'
import router from './router';
import { useRoute } from "vue-router";
//获取路由器列表
const routers = router.options.routes

//监听路由变化
const route = useRoute();
const newRoute = ref(route.path)
watch(()=>route.path,(newPath)=>{
  newRoute.value = newPath
},{immediate:true})
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
      .body-cont{
        flex: 1;
      }
  }

</style>
