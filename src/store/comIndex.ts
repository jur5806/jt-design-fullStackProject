import { defineStore} from 'pinia';
import {ref} from 'vue';
import {Names} from './store_name';

export const comUserTestStore = defineStore( Names.COMTEST,()=>{
  let todos = ref([{id:1,title: '吃饭'},{id:2,title: '睡觉'},{id:3,title: '打豆豆'}])
  
  return {
    todos,
    updateTodo(){
      todos.value.push({id:4,title:'组合式api方法'})
    }
  }

})


