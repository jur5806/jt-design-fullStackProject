import { MockMethod } from 'vite-plugin-mock'
import type { Photo, Article } from '@/api/types/showcase'

// 模拟照片数据
const photos: Photo[] = [
  {
    id: 1,
    url: 'https://picsum.photos/400/300?random=1',
    title: '阳光下的微笑',
    description: '记录一个美好的下午时光',
    category: 'people',
    date: '2024-01-20',
    likes: 42,
    author: '摄影师A'
  },
  {
    id: 2,
    url: 'https://picsum.photos/300/400?random=2',
    title: '城市夜景',
    description: '繁华都市的璀璨夜色',
    category: 'landscape',
    date: '2024-01-19',
    likes: 38,
    author: '摄影师B'
  },
  {
    id: 3,
    url: 'https://picsum.photos/400/400?random=3',
    title: '美食探索',
    description: '寻找城市里的美味',
    category: 'food',
    date: '2024-01-18',
    likes: 56,
    author: '美食家C'
  },
  {
    id: 4,
    url: 'https://picsum.photos/350/350?random=4',
    title: '宠物日常',
    description: '可爱的小猫咪',
    category: 'pets',
    date: '2024-01-17',
    likes: 89,
    author: '铲屎官D'
  },
  {
    id: 5,
    url: 'https://picsum.photos/450/300?random=5',
    title: '旅行记忆',
    description: '在路上遇见最美的风景',
    category: 'travel',
    date: '2024-01-16',
    likes: 67,
    author: '旅行者E'
  }
]

// 模拟文章数据
const articles: Article[] = [
  {
    id: 1,
    title: '2024年前端技术趋势展望',
    description: '探讨新的一年前端技术发展方向，包括框架演进、工具链优化等热点话题...',
    cover: 'https://picsum.photos/400/300?random=6',
    category: 'tech',
    author: {
      name: 'John Doe',
      avatar: 'https://picsum.photos/50/50?random=1'
    },
    publishTime: '2024-01-20',
    views: 1234,
    likes: 88,
    comments: 23,
    url: 'https://example.com/article/1'
  },
  {
    id: 2,
    title: '设计系统的构建之道',
    description: '分享如何构建一个可扩展的设计系统，确保产品视觉和交互的一致性...',
    cover: 'https://picsum.photos/400/300?random=7',
    category: 'design',
    author: {
      name: 'Jane Smith',
      avatar: 'https://picsum.photos/50/50?random=2'
    },
    publishTime: '2024-01-19',
    views: 856,
    likes: 66,
    comments: 15,
    url: 'https://example.com/article/2'
  }
]

export default [
  // 获取照片列表
  {
    url: '/api/showcase/photos',
    method: 'get',
    response: ({ query }) => {
      let result = [...photos]
      
      // 分类筛选
      if (query.category && query.category !== 'all') {
        result = result.filter(photo => photo.category === query.category)
      }
      
      return {
        code: 200,
        message: '获取成功',
        data: result
      }
    }
  },

  // 获取文章列表
  {
    url: '/api/showcase/articles',
    method: 'get',
    response: ({ query }) => {
      let result = [...articles]
      
      // 分类筛选
      if (query.category && query.category !== 'all') {
        result = result.filter(article => article.category === query.category)
      }
      
      // 关键词搜索
      if (query.keyword) {
        const keyword = query.keyword.toLowerCase()
        result = result.filter(article => 
          article.title.toLowerCase().includes(keyword) ||
          article.description.toLowerCase().includes(keyword)
        )
      }
      
      return {
        code: 200,
        message: '获取成功',
        data: result
      }
    }
  },

  // 上传照片
  {
    url: '/api/showcase/upload',
    method: 'post',
    response: () => {
      return {
        code: 200,
        message: '上传成功',
        data: {
          url: `https://picsum.photos/400/300?random=${Math.random()}`
        }
      }
    }
  },

  // 点赞
  {
    url: '/api/showcase/like',
    method: 'post',
    response: ({ body }) => {
      const { id, type } = body
      const list = type === 'photo' ? photos : articles
      const item = list.find(i => i.id === id)
      
      if (item) {
        item.likes++
        return {
          code: 200,
          message: '点赞成功',
          data: item
        }
      }
      
      return {
        code: 400,
        message: '未找到对应内容'
      }
    }
  },

  // 分享文章
  {
    url: '/api/showcase/share',
    method: 'post',
    response: ({ body }) => {
      const newArticle: Article = {
        id: articles.length + 1,
        ...body,
        views: 0,
        likes: 0,
        comments: 0,
        publishTime: new Date().toISOString().split('T')[0],
        author: {
          name: 'Current User',
          avatar: 'https://picsum.photos/50/50?random=0'
        }
      }
      
      articles.unshift(newArticle)
      
      return {
        code: 200,
        message: '分享成功',
        data: newArticle
      }
    }
  }
] as MockMethod[] 