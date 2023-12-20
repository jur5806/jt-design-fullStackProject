import { defineStore} from 'pinia';
import {ref,computed} from 'vue';
import {Names} from './store_name';

export const comUserTestStore = defineStore( Names.COMTEST,()=>{
  let todos = ref([{id:1,title: '吃饭'},{id:2,title: '睡觉'},{id:3,title: '打豆豆'}])
  let arr = ref([1,2,3,4,5])
  const total = computed(() => {
    return arr.value.reduce((prev, next) => {
        return prev + next;
    }, 0)
})
  
  return {
    todos,
    arr,
    total,
    updateTodo(){
      todos.value.push({id:4,title:'组合式api方法'})
    }
  }

})


