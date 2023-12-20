/*
 * @Author: jt 2602818429@qq.com
 * @Date: 2023-12-20 09:51:31
 * @LastEditors: jt 2602818429@qq.com
 * @LastEditTime: 2023-12-20 11:08:19
 * @FilePath: \jt-design\src\utils\request.ts
 * @Description: 这是默认设置,请设置`customMade`, 打开koroFileHeader查看配置 进行设置: https://github.com/OBKoro1/koro1FileHeader/wiki/%E9%85%8D%E7%BD%AE
 */
//进行axios二次封装
import axios from 'axios';
import { ElMessage } from 'element-plus';
//第一步 利用axios对象的create方法，去创建axios实例（其他配置：基本路径、超时的时间）
let request = axios.create({
  baseURL: '',
  timeout: 5000,//超时时间
})
//第二部：request 实例添加请求拦截器
request.interceptors.request.use((config)=>{
  console.log(config)
  return config;
})

//响应拦截器
request.interceptors.response.use((response)=>{
  return response.data;
},
(error)=>{
  let message = ''
  let status = error.response.status;
  switch(status) {
    case 401:
      message = 'token过期'
      break;
    case 403:
      message = '无权访问'
      break;
    case 404:
      message = '请求地址错误'
      break
    case 500:
      message = "服务器错误"
      break;
    default:
      message = "网络错误"
      break;
  }
  //提示错误信息
  ElMessage({
    type: 'error',
    message
  })
  return Promise.reject(error)
}

);

export default request;