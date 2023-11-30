
<template>
  <!-- <div>
    <a href="https://vitejs.dev" target="_blank">
      <img src="/vite.svg" class="logo" alt="Vite logo" />
    </a>
    <a href="https://vuejs.org/" target="_blank">
      <img src="./assets/vue.svg" class="logo vue" alt="Vue logo" />
    </a>
  </div> -->
  <div> pinia : {{ Test.current }} --- {{ Test.name }}</div>
  <div> pinia2 : {{ current }} --- {{ name }}</div>
  <div> 异步 : {{ Test.user}}</div>
  <button @click="changeStore">change</button>
  <button @click="reset">reset</button>
  <HelloWorld msg="Vite + Vue" />
</template>

<script setup lang="ts">
import { userTestStore } from './store'
import { storeToRefs } from 'pinia'
import HelloWorld from './components/HelloWorld.vue'

const Test = userTestStore()
const {current, name} = storeToRefs(Test);

const changeStore = ()=>{
  Test.setCurrent(475)
  Test.setPromise()
  console.log(current,name)
}
const reset =()=>{
  Test.$reset()
}


</script>


<style scoped>
.logo {
  height: 6em;
  padding: 1.5em;
  will-change: filter;
  transition: filter 300ms;
}
.logo:hover {
  filter: drop-shadow(0 0 2em #646cffaa);
}
.logo.vue:hover {
  filter: drop-shadow(0 0 2em #42b883aa);
}
</style>
