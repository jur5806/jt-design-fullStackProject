<!--
 * @Author: jt 2602818429@qq.com
 * @Date: 2023-12-08 14:07:19
 * @LastEditors: jt 2602818429@qq.com
 * @LastEditTime: 2023-12-14 12:41:37
 * @FilePath: \jt-design\src\view\vue3Communication\08_pinia\Child.vue
 * @Description: 这是默认设置,请设置`customMade`, 打开koroFileHeader查看配置 进行设置: https://github.com/OBKoro1/koro1FileHeader/wiki/%E9%85%8D%E7%BD%AE
-->
<template>
  <div class="child">
    <h1>{{ infoStore.count }}---{{infoStore.total}}</h1>
    <button @click="updateCount">点击我修改仓库数据</button>
  </div>
</template>

<script setup lang="ts">
import {userTestStore} from "@/store";
//获取小仓库对象
let infoStore = userTestStore();
console.log(infoStore);
//修改数据方法
const updateCount = () => {
  //仓库调用自身的方法去修改仓库的数据
  infoStore.updateNum(66,77);
};
</script>

<style scoped>
.child {
  width: 200px;
  height: 200px;
  background: yellowgreen;
}
</style>