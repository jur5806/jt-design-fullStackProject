/*
 * @Author: jt 2602818429@qq.com
 * @Date: 2023-12-21 11:52:01
 * @LastEditors: jt 2602818429@qq.com
 * @LastEditTime: 2023-12-21 11:53:11
 * @FilePath: \jt-design\src\utils\token.ts
 * @Description: 这是默认设置,请设置`customMade`, 打开koroFileHeader查看配置 进行设置: https://github.com/OBKoro1/koro1FileHeader/wiki/%E9%85%8D%E7%BD%AE
 */
//封装本地存储数据与读取数据方法
export const SET_TOKEN = (token: string) =>{
  localStorage.setItem('token', token);
}

//读取token
export const GET_TOKEN = () =>{
  return localStorage.getItem('token');
}