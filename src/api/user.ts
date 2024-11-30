import request from '@/utils/request'
import type { LoginParams, UserInfo, UpdateUserParams } from './types/user'

export function login(data: LoginParams) {
  return request({
    url: '/api/user/login',
    method: 'post',
    data
  })
}

export function getUserInfo() {
  return request({
    url: '/api/user/info',
    method: 'get'
  })
}

export function updateUserInfo(data: UpdateUserParams) {
  return request({
    url: '/api/user/update',
    method: 'put',
    data
  })
}

export function updatePassword(data: { oldPassword: string; newPassword: string }) {
  return request({
    url: '/api/user/password',
    method: 'put',
    data
  })
}

export function uploadAvatar(data: FormData) {
  return request({
    url: '/api/user/avatar',
    method: 'post',
    headers: {
      'Content-Type': 'multipart/form-data'
    },
    data
  })
} 