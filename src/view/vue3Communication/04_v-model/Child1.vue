<!--
 * @Author: jt 2602818429@qq.com
 * @Date: 2023-12-08 14:07:18
 * @LastEditors: jt 2602818429@qq.com
 * @LastEditTime: 2023-12-08 18:58:43
 * @FilePath: \jt-design\src\view\vue3Communication\04_v-model\Child1.vue
 * @Description: 这是默认设置,请设置`customMade`, 打开koroFileHeader查看配置 进行设置: https://github.com/OBKoro1/koro1FileHeader/wiki/%E9%85%8D%E7%BD%AE
-->
<template>
  <div class="child2">
    <h1>同时绑定多个v-model</h1>
    <button @click="handler">pageNo{{ pageNo }}</button>
    <button @click="$emit('update:pageSize', pageSize + 4)">
      pageSize{{ pageSize }}
    </button>
  </div>
</template>

<script setup lang="ts">
let props = defineProps(["pageNo", "pageSize"]);
let $emit = defineEmits(["update:pageNo", "update:pageSize"]);
//第一个按钮的事件回调
const handler = () => {
  $emit("update:pageNo", props.pageNo + 3);
};
</script>

<style scoped>
.child2 {
  width: 300px;
  height: 100px;
  background: hotpink;
  display: flex;
}
</style>