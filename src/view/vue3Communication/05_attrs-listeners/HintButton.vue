<!--
 * @Author: jt 2602818429@qq.com
 * @Date: 2023-12-08 14:07:18
 * @LastEditors: jt 2602818429@qq.com
 * @LastEditTime: 2023-12-14 15:25:54
 * @FilePath: \jt-design\src\view\vue3Communication\05_attrs-listeners\HintButton.vue
 * @Description: 这是默认设置,请设置`customMade`, 打开koroFileHeader查看配置 进行设置: https://github.com/OBKoro1/koro1FileHeader/wiki/%E9%85%8D%E7%BD%AE
-->
<template>
  <div :title="title">
     <el-button :="$attrs"></el-button>   
  </div>
</template>

<script setup lang="ts">
//引入useAttrs方法:获取组件标签身上属性与事件
import {useAttrs} from 'vue';
//此方法执行会返回一个对象
let $attrs = useAttrs();

//万一用props接受title
defineProps(['title']);
//props与useAttrs方法都可以获取父组件传递过来的属性与属性值
//但是props接受了useAttrs方法就获取不到了
console.log($attrs);
</script>

<style scoped>
</style>