/*
 * @Author: jt 2602818429@qq.com
 * @Date: 2023-11-30 16:21:45
 * @LastEditors: jt 2602818429@qq.com
 * @LastEditTime: 2023-12-19 16:18:19
 * @FilePath: \jt-design\vite.config.ts
 * @Description: 这是默认设置,请设置`customMade`, 打开koroFileHeader查看配置 进行设置: https://github.com/OBKoro1/koro1FileHeader/wiki/%E9%85%8D%E7%BD%AE
 */
import { defineConfig, loadEnv } from 'vite'
import vue from '@vitejs/plugin-vue'
import { resolve } from 'path'
import { viteMockServe } from 'vite-plugin-mock'

export default defineConfig(({ command, mode }) => {
  const env = loadEnv(mode, process.cwd())
  const useMock = env.VITE_USE_MOCK === 'true'

  return {
    plugins: [
      vue(),
      viteMockServe({
        mockPath: 'mock',
        localEnabled: command === 'serve' && useMock,
        prodEnabled: command !== 'serve' && useMock,
        injectCode: `
          import { setupProdMockServer } from './mock/mockProdServer';
          setupProdMockServer();
        `,
        logger: true,
        supportTs: true
      })
    ],
    resolve: {
      alias: {
        '@': resolve(__dirname, 'src')
      }
    },
    css: {
      preprocessorOptions: {
        scss: {
          additionalData: `@use "@/styles/variables.scss" as *;`
        }
      }
    },
    server: {
      port: 8888,
      open: true,
      proxy: !useMock ? {
        '/api': {
          target: env.VITE_API_URL,
          changeOrigin: true
        }
      } : undefined
    }
  }
})



