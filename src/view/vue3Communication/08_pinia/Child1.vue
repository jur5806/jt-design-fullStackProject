<template>
  <div class="child1">
    {{ infoStore.count }}
    <p @click="updateTodo">{{ todoStore.arr }}{{todoStore.total}}</p>
  </div>
</template>

<script setup lang="ts">
import {userTestStore} from "@/store/index";
//获取小仓库对象
let infoStore = userTestStore();

//引入组合式API函数仓库
import {comUserTestStore} from "@/store/comIndex";
let todoStore = comUserTestStore();

//点击p段落去修改仓库的数据
const updateTodo = () => {
  todoStore.updateTodo();
};
</script>

<style scoped>
.child1 {
  width: 200px;
  height: 200px;
  background: hotpink;
}
</style>