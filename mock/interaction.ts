import { MockMethod } from 'vite-plugin-mock'
import type { ChatMessage, Message } from '@/api/types/interaction'

// 模拟聊天消息数据
const chatMessages: ChatMessage[] = [
  {
    id: 1,
    content: '大家好，我是新来的~',
    type: 'text',
    sender: {
      id: 1,
      name: '用户A',
      avatar: 'https://picsum.photos/50/50?random=1'
    },
    createTime: '2024-01-20 14:30:00',
    room: 'general'
  },
  {
    id: 2,
    content: '欢迎欢迎！',
    type: 'text',
    sender: {
      id: 2,
      name: '用户B',
      avatar: 'https://picsum.photos/50/50?random=2'
    },
    createTime: '2024-01-20 14:31:00',
    room: 'general'
  },
  {
    id: 3,
    content: 'https://picsum.photos/300/200?random=1',
    type: 'image',
    sender: {
      id: 3,
      name: '用户C',
      avatar: 'https://picsum.photos/50/50?random=3'
    },
    createTime: '2024-01-20 14:32:00',
    room: 'general'
  },
  {
    id: 4,
    content: '有人讨论Vue3吗？',
    type: 'text',
    sender: {
      id: 4,
      name: '用户D',
      avatar: 'https://picsum.photos/50/50?random=4'
    },
    createTime: '2024-01-20 14:33:00',
    room: 'tech'
  },
  {
    id: 5,
    content: '我最近在学习Vue3和TypeScript',
    type: 'text',
    sender: {
      id: 5,
      name: '用户E',
      avatar: 'https://picsum.photos/50/50?random=5'
    },
    createTime: '2024-01-20 14:34:00',
    room: 'tech',
    replyTo: {
      id: 4,
      content: '有人讨论Vue3吗？',
      sender: {
        name: '用户D'
      }
    }
  }
]

// 模拟留言板数据
const messages: Message[] = [
  {
    id: 1,
    content: '这个网站做得真不错！',
    author: {
      id: 1,
      name: '用户A',
      avatar: 'https://picsum.photos/50/50?random=1'
    },
    createTime: '2024-01-20 10:00:00',
    likes: 5,
    replies: [
      {
        id: 2,
        content: '感谢支持！',
        author: {
          id: 2,
          name: '管理员',
          avatar: 'https://picsum.photos/50/50?random=2'
        },
        createTime: '2024-01-20 10:30:00',
        likes: 2,
        replies: []
      }
    ]
  },
  {
    id: 3,
    content: '分享一些我的照片~',
    author: {
      id: 3,
      name: '用户B',
      avatar: 'https://picsum.photos/50/50?random=3'
    },
    createTime: '2024-01-20 11:00:00',
    likes: 8,
    replies: [],
    images: [
      'https://picsum.photos/300/200?random=1',
      'https://picsum.photos/300/200?random=2'
    ]
  },
  {
    id: 4,
    content: '希望能加入这个社区！',
    author: {
      id: 4,
      name: '用户C',
      avatar: 'https://picsum.photos/50/50?random=4'
    },
    createTime: '2024-01-20 12:00:00',
    likes: 3,
    replies: [
      {
        id: 5,
        content: '欢迎加入！',
        author: {
          id: 1,
          name: '用户A',
          avatar: 'https://picsum.photos/50/50?random=1'
        },
        createTime: '2024-01-20 12:30:00',
        likes: 1,
        replies: []
      }
    ]
  }
]

export default [
  // 获取聊天消息
  {
    url: '/api/interaction/chat/messages',
    method: 'get',
    response: ({ query }) => {
      let result = [...chatMessages]
      
      // 房间筛选
      if (query.room) {
        result = result.filter(msg => msg.room === query.room)
      }
      
      return {
        code: 200,
        message: '获取成功',
        data: result
      }
    }
  },

  // 发送聊天消息
  {
    url: '/api/interaction/chat/send',
    method: 'post',
    response: ({ body }) => {
      const newMessage: ChatMessage = {
        id: chatMessages.length + 1,
        content: body.content,
        type: body.type || 'text',
        sender: {
          id: 1, // 假设当前用户ID为1
          name: '当前用户',
          avatar: 'https://picsum.photos/50/50?random=0'
        },
        createTime: new Date().toISOString().replace('T', ' ').split('.')[0],
        room: body.room,
        replyTo: body.replyTo ? {
          id: body.replyTo,
          content: chatMessages.find(m => m.id === body.replyTo)?.content || '',
          sender: {
            name: chatMessages.find(m => m.id === body.replyTo)?.sender.name || ''
          }
        } : undefined
      }
      
      chatMessages.push(newMessage)
      
      return {
        code: 200,
        message: '发送成功',
        data: newMessage
      }
    }
  },

  // 获取留言列表
  {
    url: '/api/interaction/messages',
    method: 'get',
    response: ({ query }) => {
      const page = Number(query.page) || 1
      const pageSize = Number(query.pageSize) || 10
      let result = [...messages]
      
      // 关键词搜索
      if (query.keyword) {
        const keyword = query.keyword.toLowerCase()
        result = result.filter(msg => 
          msg.content.toLowerCase().includes(keyword)
        )
      }
      
      // 分页
      const start = (page - 1) * pageSize
      const end = start + pageSize
      const list = result.slice(start, end)
      
      return {
        code: 200,
        message: '获取成功',
        data: {
          list,
          total: result.length,
          page,
          pageSize
        }
      }
    }
  },

  // 发布留言
  {
    url: '/api/interaction/messages',
    method: 'post',
    response: ({ body }) => {
      const newMessage: Message = {
        id: messages.length + 1,
        content: body.content,
        author: {
          id: 1, // 假设当前用户ID为1
          name: '当前用户',
          avatar: 'https://picsum.photos/50/50?random=0'
        },
        createTime: new Date().toISOString().replace('T', ' ').split('.')[0],
        likes: 0,
        replies: [],
        images: body.images
      }
      
      messages.unshift(newMessage)
      
      return {
        code: 200,
        message: '发布成功',
        data: newMessage
      }
    }
  },

  // 回复留言
  {
    url: '/api/interaction/messages/:id/reply',
    method: 'post',
    response: ({ url, body }) => {
      const id = parseInt(url.split('/').slice(-2)[0])
      const message = messages.find(m => m.id === id)
      
      if (!message) {
        return {
          code: 404,
          message: '留言不存在'
        }
      }
      
      const newReply: Message = {
        id: Math.max(...messages.map(m => m.id)) + 1,
        content: body.content,
        author: {
          id: 1, // 假设当前用户ID为1
          name: '当前用户',
          avatar: 'https://picsum.photos/50/50?random=0'
        },
        createTime: new Date().toISOString().replace('T', ' ').split('.')[0],
        likes: 0,
        replies: []
      }
      
      message.replies.push(newReply)
      
      return {
        code: 200,
        message: '回复成功',
        data: newReply
      }
    }
  },

  // 点赞留言
  {
    url: '/api/interaction/messages/:id/like',
    method: 'post',
    response: ({ url }) => {
      const id = parseInt(url.split('/').slice(-2)[0])
      const message = messages.find(m => m.id === id)
      
      if (!message) {
        return {
          code: 404,
          message: '留言不存在'
        }
      }
      
      message.likes++
      message.isLiked = true
      
      return {
        code: 200,
        message: '点赞成功',
        data: message
      }
    }
  },

  // 删除留言
  {
    url: '/api/interaction/messages/:id',
    method: 'delete',
    response: ({ url }) => {
      const id = parseInt(url.split('/').pop() || '0')
      const index = messages.findIndex(m => m.id === id)
      
      if (index === -1) {
        return {
          code: 404,
          message: '留言不存在'
        }
      }
      
      messages.splice(index, 1)
      
      return {
        code: 200,
        message: '删除成功'
      }
    }
  }
] as MockMethod[] 