// 聊天室相关类型
export interface ChatMessage {
  id: number
  content: string
  type: 'text' | 'image' | 'file'
  sender: {
    id: number
    name: string
    avatar: string
  }
  createTime: string
  room?: string
  replyTo?: {
    id: number
    content: string
    sender: {
      name: string
    }
  }
}

// 留言板相关类型
export interface Message {
  id: number
  content: string
  author: {
    id: number
    name: string
    avatar: string
  }
  createTime: string
  likes: number
  replies: Message[]
  images?: string[]
  isLiked?: boolean
}

export interface CreateMessageParams {
  content: string
  images?: string[]
  replyTo?: number
}

export interface GetMessagesParams {
  page?: number
  pageSize?: number
  keyword?: string
}

export interface MessageListResponse {
  list: Message[]
  total: number
  page: number
  pageSize: number
} 