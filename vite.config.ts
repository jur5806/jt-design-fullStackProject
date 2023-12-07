/*
 * @Author: jt 2602818429@qq.com
 * @Date: 2023-11-30 16:21:45
 * @LastEditors: jt 2602818429@qq.com
 * @LastEditTime: 2023-11-30 19:38:48
 * @FilePath: \jt-design\vite.config.ts
 * @Description: 这是默认设置,请设置`customMade`, 打开koroFileHeader查看配置 进行设置: https://github.com/OBKoro1/koro1FileHeader/wiki/%E9%85%8D%E7%BD%AE
 */
import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import path from 'path'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [vue()],
  resolve: {
    alias:{
      '@':  path.resolve(__dirname, 'src') }
  },
  css: {
    preprocessorOptions: {
      less: {
        math: "always", // 括号内才使用数学计算
        javascriptEnabled: true,
        globalVars: {
          // 全局变量
          mainColor: "red",
        },
      },
    },
  },
})



