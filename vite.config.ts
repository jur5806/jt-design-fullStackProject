/*
 * @Author: jt 2602818429@qq.com
 * @Date: 2023-11-30 16:21:45
 * @LastEditors: jt 2602818429@qq.com
 * @LastEditTime: 2023-12-19 16:18:19
 * @FilePath: \jt-design\vite.config.ts
 * @Description: 这是默认设置,请设置`customMade`, 打开koroFileHeader查看配置 进行设置: https://github.com/OBKoro1/koro1FileHeader/wiki/%E9%85%8D%E7%BD%AE
 */
import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import path from 'path'
import { createSvgIconsPlugin } from 'vite-plugin-svg-icons'
import { viteMockServe } from 'vite-plugin-mock'

// https://vitejs.dev/config/
export default defineConfig(({command}) =>{
  return {
    plugins: [vue(),
      createSvgIconsPlugin({
        //图标存放位置
        iconDirs: [path.resolve(process.cwd(),'src/assets/icons')],
        symbolId: 'icon-[dir]-[name]'
      }),
      viteMockServe({
        mockPath: 'mock',//解析根目录下的mock文件夹
        localEnabled: true,
      }) as any 
    ],
    resolve: {
      alias:{
        //配置相对路径使用@代替src
        '@':  path.resolve(__dirname, 'src') }
    },
    //scss 全局变量配置
    css: {
      preprocessorOptions: {
        scss: {
          javascriptEnabled: true,
          additionalData: `@import "./src/styles/variable.scss";`, // 括号内才使用数学计算
        },
      },
    },
  }
})



