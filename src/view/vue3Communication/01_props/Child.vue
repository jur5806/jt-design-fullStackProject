<!--
 * @Author: jt 2602818429@qq.com
 * @Date: 2023-12-08 14:07:18
 * @LastEditors: jt 2602818429@qq.com
 * @LastEditTime: 2023-12-13 13:37:34
 * @FilePath: \jt-design\src\view\vue3Communication\01_props\Child.vue
 * @Description: 这是默认设置,请设置`customMade`, 打开koroFileHeader查看配置 进行设置: https://github.com/OBKoro1/koro1FileHeader/wiki/%E9%85%8D%E7%BD%AE
-->
<template>
  <div class="son">
       <h1>我是子组件:曹植</h1>
       <p>{{props.info}}</p>
       <p>{{props.money}}</p>
      <!--props可以省略前面的名字--->
       <p>{{info}}</p>
       <p>{{money}}</p>
       <button @click="updateProps">修改props数据</button>
  </div>
</template>

<script setup lang="ts">
//需要使用到defineProps方法去接受父组件传递过来的数据
//defineProps是Vue3提供方法,不需要引入直接使用
let props = defineProps(['info','money']); //数组|对象写法都可以
//按钮点击的回调
const updateProps = ()=>{
  // props.money+=10;  props:只读的
  console.log(props.info)
}
</script>

<style scoped>
.son{
  width: 400px;
  height: 200px;
  background: hotpink;
}
</style>