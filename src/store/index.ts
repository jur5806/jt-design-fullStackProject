/*
 * @Author: jt 2602818429@qq.com
 * @Date: 2023-11-29 15:48:43
 * @LastEditors: jt 2602818429@qq.com
 * @LastEditTime: 2023-12-14 12:44:02
 * @FilePath: \jt-design\src\store\index.ts
 * @Description: 这是默认设置,请设置`customMade`, 打开koroFileHeader查看配置 进行设置: https://github.com/OBKoro1/koro1FileHeader/wiki/%E9%85%8D%E7%BD%AE
 */
import {defineStore} from 'pinia'
import {Names} from './store_name'
type User = {
  name: String,
  age: number
}
let result: User = {
  name: 'John',
  age: 36
}
const setUserList = ():Promise<User> =>{
  return new Promise((resolve)=>{
    setTimeout(() => {
      resolve(result)
    }, 1);
  })
}

export const userTestStore = defineStore(Names.TEST, {
  state: ()=>{
    return {
      user: <User>{},
      current : 1,
      name: "蒋婷",
      count: 99,
      list: [1,2,3,4,5,6,7,8,9,10,11,12]
    }
  },
  //computed 修饰一些值
  getters :{
    total(){
      return this.list.reduce((prev,next)=>{ return prev+next},0)
    }

  },
  //methods 可以做同步异步  提交state
  actions:{
    async setPromise(){//异步
      let r = await setUserList()
      this.user = r
      this.setCurrent('55') 
    },
    setCurrent(value: number){//同步
      this.current = value
    },
    updateNum(a: number,b: number){
      this.count += a
    }
  }
})