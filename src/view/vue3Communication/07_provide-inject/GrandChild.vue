<!--
 * @Author: jt 2602818429@qq.com
 * @Date: 2023-12-08 14:07:19
 * @LastEditors: jt 2602818429@qq.com
 * @LastEditTime: 2023-12-14 15:38:35
 * @FilePath: \jt-design\src\view\vue3Communication\07_provide-inject\GrandChild.vue
 * @Description: 这是默认设置,请设置`customMade`, 打开koroFileHeader查看配置 进行设置: https://github.com/OBKoro1/koro1FileHeader/wiki/%E9%85%8D%E7%BD%AE
-->
<template>
  <div class="child1">
    <h1>孙子组件</h1>
    <p>{{car}}</p>
    <button @click="updateCar">更新数据</button>
  </div>
</template>

<script setup lang="ts">
import {inject,ref} from 'vue';
//注入祖先组件提供数据
//需要参数:即为祖先提供数据的key
let car = inject('TOKEN') || ref('');
const updateCar = ()=>{
   car  = '自行车';
}
</script>

<style scoped>
.child1 {
  width: 200px;
  height: 200px;
  background: red;
}
</style>