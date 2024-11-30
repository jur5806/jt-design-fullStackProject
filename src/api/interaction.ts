import request from '@/utils/request'
import type { 
  ChatMessage, 
  Message, 
  CreateMessageParams, 
  GetMessagesParams, 
  MessageListResponse 
} from './types/interaction'

// 获取聊天消息
export function getChatMessages(room?: string) {
  return request<ChatMessage[]>({
    url: '/api/interaction/chat/messages',
    method: 'get',
    params: { room }
  })
}

// 发送聊天消息
export function sendChatMessage(data: { content: string; type?: string; room?: string; replyTo?: number }) {
  return request<ChatMessage>({
    url: '/api/interaction/chat/send',
    method: 'post',
    data
  })
}

// 获取留言列表
export function getMessages(params: GetMessagesParams) {
  return request<MessageListResponse>({
    url: '/api/interaction/messages',
    method: 'get',
    params
  })
}

// 发布留言
export function createMessage(data: CreateMessageParams) {
  return request<Message>({
    url: '/api/interaction/messages',
    method: 'post',
    data
  })
}

// 回复留言
export function replyMessage(id: number, data: CreateMessageParams) {
  return request<Message>({
    url: `/api/interaction/messages/${id}/reply`,
    method: 'post',
    data
  })
}

// 点赞留言
export function likeMessage(id: number) {
  return request({
    url: `/api/interaction/messages/${id}/like`,
    method: 'post'
  })
}

// 删除留言
export function deleteMessage(id: number) {
  return request({
    url: `/api/interaction/messages/${id}`,
    method: 'delete'
  })
} 