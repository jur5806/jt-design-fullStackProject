<!--
 * @Author: jt 2602818429@qq.com
 * @Date: 2023-12-14 16:42:54
 * @LastEditors: jt 2602818429@qq.com
 * @LastEditTime: 2023-12-15 13:52:57
 * @FilePath: \jt-design\src\components\SvgIcon\index.vue
 * @Description: 这是默认设置,请设置`customMade`, 打开koroFileHeader查看配置 进行设置: https://github.com/OBKoro1/koro1FileHeader/wiki/%E9%85%8D%E7%BD%AE
-->
<template>
  <svg :style="{width,height}">
      <!-- use标签的fill 属性可以调颜色 xlink:href执行用哪个图标 -->
      <use :xlink:href="prefix + name"></use>
  </svg>
  </template>
  
  <script setup lang='ts'>
  import { defineProps } from 'vue';
  defineProps({
      //xlink:href 前缀
      prefix:{
          type: String,
          default: '#icon-'
      },
      name: String,
      width: {
          type: String,
          default: '16px'
      },
      height: {
          type: String,
          default: '16px'
      },
  })
  
  </script>
  <style scoped lang='scss'>
      
  </style>