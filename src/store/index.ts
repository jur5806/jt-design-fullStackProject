/*
 * @Author: jt 2602818429@qq.com
 * @Date: 2023-11-29 15:48:43
 * @LastEditors: jt 2602818429@qq.com
 * @LastEditTime: 2023-12-21 11:55:56
 * @FilePath: \jt-design\src\store\index.ts
 * @Description: 这是默认设置,请设置`customMade`, 打开koroFileHeader查看配置 进行设置: https://github.com/OBKoro1/koro1FileHeader/wiki/%E9%85%8D%E7%BD%AE
 */
import {defineStore} from 'pinia'
import { reqLogin } from '@/api/user/index'
import {loginForm,loginResponseDate} from '@/api/user/type'
import type {UerState } from './types/type'
import { SET_TOKEN,GET_TOKEN} from '@/utils/token'

export const userTestStore = defineStore('userTestStore', {
  state: ():UerState=>{
    return {
      token: GET_TOKEN(),
    }
  },
  //computed 修饰一些值
  getters :{

  },
  //methods 可以做同步异步  提交state
  actions:{
    //处理用户登录的方法
    async setLogin(userInfo:loginForm){//异步
      let result:loginResponseDate = await reqLogin(userInfo)
      if(result.code == 200){
        this.token = (result.data.token as string)
        SET_TOKEN((result.data.token as string))
        return 'ok'
      }else{
        return Promise.reject( new Error(result.data.message) );
      }
    },
  }
})