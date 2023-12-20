<!--
 * @Author: jt 2602818429@qq.com
 * @Date: 2023-12-08 14:07:18
 * @LastEditors: jt 2602818429@qq.com
 * @LastEditTime: 2023-12-14 15:32:23
 * @FilePath: \jt-design\src\view\vue3Communication\06_ref-children-parent\Daughter.vue
 * @Description: 这是默认设置,请设置`customMade`, 打开koroFileHeader查看配置 进行设置: https://github.com/OBKoro1/koro1FileHeader/wiki/%E9%85%8D%E7%BD%AE
-->
<template>
  <div class="dau">
     <h1>我是闺女曹杰{{money}}</h1>
     <button @click="handler($parent)">点击我爸爸给我10000元</button>
  </div>
</template>

<script setup lang="ts">
import {ref} from 'vue';
//闺女钱数
let money = ref(999999);
//闺女按钮点击回调
const handler = ($parent:any)=>{
   money.value+=10000;
   $parent.money-=10000;
}
</script>

<style scoped>
.dau{
  width: 300px;
  height: 300px;
  background: hotpink;
}
</style>