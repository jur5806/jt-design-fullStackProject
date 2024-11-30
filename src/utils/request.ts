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
const request = axios.create({
  timeout: 5000,//超时时间
})
//第二部：request 实例添加请求拦截器
request.interceptors.request.use((config)=>{
  console.log(config)
  // 从 localStorage 获取 token
  const token = localStorage.getItem('token')
  if (token) {
    config.headers['Authorization'] = `Bearer ${token}`
  }
  return config;
},
(error)=>{
  return Promise.reject(error)
}

);

//响应拦截器
request.interceptors.response.use((response)=>{
  const res = response.data
  if (res.code !== 200) {
    ElMessage.error(res.message || '请求错误')
    return Promise.reject(new Error(res.message || '请求错误'))
  }
  return res;
},
(error)=>{
  console.error('请求错误:', error)  // 添加错误日志
  ElMessage.error(error.response?.data?.message || error.message || '请求错误')
  return Promise.reject(error)
}

);

export default request;