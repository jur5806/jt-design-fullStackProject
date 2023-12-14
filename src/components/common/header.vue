<!--
 * @Author: jt 2602818429@qq.com
 * @Date: 2023-11-30 18:01:24
 * @LastEditors: jt 2602818429@qq.com
 * @LastEditTime: 2023-12-08 14:55:12
 * @FilePath: \jt-design\src\components\common\header.vue
 * @Description: 这是默认设置,请设置`customMade`, 打开koroFileHeader查看配置 进行设置: https://github.com/OBKoro1/koro1FileHeader/wiki/%E9%85%8D%E7%BD%AE
-->
<template>
  <div class="header-nab">
    <div class="g-left-logo">
      logo
    </div>
    <div class="navbar">
      <!-- 插槽位置 -->
      <slot></slot>
    </div>
    <div class="custom-info">
      <el-icon color="#409EFC"><UserFilled /></el-icon>
    </div>
  </div>
</template>

<script setup lang='ts'>
import {ref, reactive} from 'vue';
</script>
<style scoped lang="less">
.header-nab{
  background-color: #232529;
  border-bottom: 1px solid #000;
  display: flex;
  align-items: center;
  padding: 0 10px;
  height: 62px;
  width: 100%;
  justify-content: space-between;
  .g-left-logo{
    font-size: large;
    color: #fff;
  }
  .navbar{
    min-width: 500px;
  }
  .custom-info{
    i{
      font-size: 26px;
    }
  }
}
</style>