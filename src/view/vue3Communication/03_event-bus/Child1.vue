<!--
 * @Author: jt 2602818429@qq.com
 * @Date: 2023-12-08 14:07:18
 * @LastEditors: jt 2602818429@qq.com
 * @LastEditTime: 2023-12-13 14:42:18
 * @FilePath: \jt-design\src\view\vue3Communication\03_event-bus\Child1.vue
 * @Description: 这是默认设置,请设置`customMade`, 打开koroFileHeader查看配置 进行设置: https://github.com/OBKoro1/koro1FileHeader/wiki/%E9%85%8D%E7%BD%AE
-->
<template>
  <div class="child1">
    <h3>我是子组件1:曹植</h3>
    <h3>{{ wifes }}</h3>
  </div>
</template>
<script setup lang="ts">
import $bus from "@/bus";
//组合式API函数
import { onMounted,ref } from "vue";
//组件挂载完毕的时候,当前组件绑定一个事件,接受将来兄弟组件传递的数据
let wifes= ref('www')
onMounted(() => {
  //第一个参数:即为事件类型  第二个参数:即为事件回调
  $bus.on("car", (car) => {
    console.log(car);
  });
  $bus.on('wife', (wife)=>{
    console.log(wife.wife)
    wifes.value = wife.wife

  })
});
</script>

<style scoped>
.child1 {
  width: 300px;
  height: 300px;
  background: hotpink;
}
</style>