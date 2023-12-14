<!--
 * @Author: jt 2602818429@qq.com
 * @Date: 2023-12-08 14:07:18
 * @LastEditors: jt 2602818429@qq.com
 * @LastEditTime: 2023-12-08 16:14:20
 * @FilePath: \jt-design\src\view\vue3Communication\03_event-bus\EventBusTest.vue
 * @Description: 这是默认设置,请设置`customMade`, 打开koroFileHeader查看配置 进行设置: https://github.com/OBKoro1/koro1FileHeader/wiki/%E9%85%8D%E7%BD%AE
-->
<template>
  <div class="box">
    <h1>全局事件总线$bus,兄弟之间参数传递</h1>
    <hr />
    <div class="container">
      <Child1></Child1>
      <Child2></Child2>
    </div>
  </div>
</template>

<script setup lang="ts">
//引入子组件
import Child1 from "./Child1.vue";
import Child2 from "./Child2.vue";
</script>

<style scoped>
.box {
  width: 100vw;
  height: 400px;
  background: yellowgreen;
}
.container{
  display: flex;
  justify-content: space-between;
}
</style>