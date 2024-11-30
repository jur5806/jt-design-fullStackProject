/*
 * @Author: jt 2602818429@qq.com
 * @Date: 2023-12-19 16:20:55
 * @LastEditors: jt 2602818429@qq.com
 * @LastEditTime: 2023-12-20 09:43:47
 * @FilePath: \jt-design\mock\user.ts
 * @Description: 这是默认设置,请设置`customMade`, 打开koroFileHeader查看配置 进行设置: https://github.com/OBKoro1/koro1FileHeader/wiki/%E9%85%8D%E7%BD%AE
 */
import { MockMethod } from 'vite-plugin-mock'

// 模拟用户数据
const users = [
  {
    id: 1,
    username: 'admin',
    password: '123456',
    email: 'admin@example.com',
    avatar: 'https://avatars.githubusercontent.com/u/1?v=4',
    nickname: '管理员',
    role: 'admin',
    createTime: '2024-01-01 00:00:00',
    lastLoginTime: '2024-01-20 12:00:00',
    status: 1
  }
]

export default [
  // 登录接口
  {
    url: '/api/user/login',
    method: 'post',
    response: ({ body }) => {
      const { username, password } = body
      const user = users.find(u => u.username === username)

      if (!user) {
        return {
          code: 401,
          message: '用户不存在'
        }
      }

      if (user.password !== password) {
        return {
          code: 401,
          message: '密码错误'
        }
      }

      return {
        code: 200,
        message: '登录成功',
        data: {
          token: `mock-token-${username}`,
          user: {
            ...user,
            password: undefined
          }
        }
      }
    }
  },

  // 获取用户信息
  {
    url: '/api/user/info',
    method: 'get',
    response: ({ headers }) => {
      const token = headers.authorization?.replace('Bearer ', '')
      if (!token) {
        return {
          code: 401,
          message: '未登录'
        }
      }

      const username = token.replace('mock-token-', '')
      const user = users.find(u => u.username === username)

      if (!user) {
        return {
          code: 401,
          message: '用户不存在'
        }
      }

      return {
        code: 200,
        message: '获取成功',
        data: {
          ...user,
          password: undefined
        }
      }
    }
  },

  // 更新用户信息
  {
    url: '/api/user/update',
    method: 'put',
    response: ({ headers, body }) => {
      const token = headers.authorization?.replace('Bearer ', '')
      if (!token) {
        return {
          code: 401,
          message: '未登录'
        }
      }

      const username = token.replace('mock-token-', '')
      const userIndex = users.findIndex(u => u.username === username)

      if (userIndex === -1) {
        return {
          code: 401,
          message: '用户不存在'
        }
      }

      users[userIndex] = {
        ...users[userIndex],
        ...body,
        lastLoginTime: new Date().toISOString()
      }

      return {
        code: 200,
        message: '更新成功',
        data: {
          ...users[userIndex],
          password: undefined
        }
      }
    }
  },

  // 修改密码
  {
    url: '/api/user/password',
    method: 'put',
    response: ({ headers, body }) => {
      const token = headers.authorization?.replace('Bearer ', '')
      if (!token) {
        return {
          code: 401,
          message: '未登录'
        }
      }

      const username = token.replace('mock-token-', '')
      const userIndex = users.findIndex(u => u.username === username)

      if (userIndex === -1) {
        return {
          code: 401,
          message: '用户不存在'
        }
      }

      const { oldPassword, newPassword } = body
      if (users[userIndex].password !== oldPassword) {
        return {
          code: 400,
          message: '原密码错误'
        }
      }

      users[userIndex].password = newPassword

      return {
        code: 200,
        message: '修改成功'
      }
    }
  },

  // 上传头像
  {
    url: '/api/user/avatar',
    method: 'post',
    response: ({ headers }) => {
      const token = headers.authorization?.replace('Bearer ', '')
      if (!token) {
        return {
          code: 401,
          message: '未登录'
        }
      }

      const username = token.replace('mock-token-', '')
      const userIndex = users.findIndex(u => u.username === username)

      if (userIndex === -1) {
        return {
          code: 401,
          message: '用户不存在'
        }
      }

      // 模拟新的头像URL
      const newAvatar = `https://avatars.githubusercontent.com/u/${Math.floor(Math.random() * 100)}?v=4`
      users[userIndex].avatar = newAvatar

      return {
        code: 200,
        message: '上传成功',
        data: {
          url: newAvatar
        }
      }
    }
  }
] as MockMethod[]