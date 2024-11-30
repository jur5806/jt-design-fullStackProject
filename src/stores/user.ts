import { defineStore } from 'pinia'
import { login, getUserInfo } from '@/api/user'
import type { LoginParams, UserInfo } from '@/api/types/user'

interface UserState {
  userInfo: UserInfo | null
  token: string | null
  permissions: string[]
}

const defaultUserInfo: UserInfo = {
  id: 0,
  username: '',
  email: '',
  avatar: '',
  nickname: '',
  role: '',
  createTime: '',
  lastLoginTime: '',
  status: 0
}

export const useUserStore = defineStore('user', {
  state: (): UserState => ({
    userInfo: defaultUserInfo,
    token: localStorage.getItem('token'),
    permissions: []
  }),
  
  actions: {
    async login(loginParams: LoginParams) {
      try {
        const { data } = await login(loginParams)
        this.token = data.token
        localStorage.setItem('token', data.token)
        if (data.user) {
          this.userInfo = data.user
        }
        return data
      } catch (error) {
        this.token = null
        this.userInfo = defaultUserInfo
        localStorage.removeItem('token')
        return Promise.reject(error)
      }
    },

    async getUserInfo() {
      try {
        const { data } = await getUserInfo()
        this.userInfo = data
        return data
      } catch (error) {
        this.userInfo = defaultUserInfo
        return Promise.reject(error)
      }
    },

    async logout() {
      this.token = null
      this.userInfo = defaultUserInfo
      this.permissions = []
      localStorage.removeItem('token')
    }
  }
}) 