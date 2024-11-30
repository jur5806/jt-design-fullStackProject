export interface LoginParams {
  username: string
  password: string
}

export interface UserInfo {
  id: number
  username: string
  email: string
  avatar: string
  nickname: string
  role: string
  createTime: string
  lastLoginTime: string
  status: number
}

export interface UpdateUserParams {
  nickname?: string
  email?: string
  avatar?: string
  oldPassword?: string
  newPassword?: string
} 