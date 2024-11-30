import { MockMethod } from 'vite-plugin-mock'
import type { BlogPost } from '@/api/types/blog'

// 模拟博客数据
const blogPosts: BlogPost[] = [
  {
    id: 1,
    title: '2024年前端技术趋势展望',
    content: '# 2024年前端技术趋势展望\n\n## 1. Web Components\n...',
    summary: '探讨新的一年前端技术发展方向，包括框架演进、工具链优化等热点话题...',
    category: 'tech',
    tags: ['前端', 'Web Components', '技术趋势'],
    author: {
      id: 1,
      name: 'John Doe',
      avatar: 'https://picsum.photos/50/50?random=1'
    },
    publishTime: '2024-01-20 10:00:00',
    viewCount: 1234,
    likeCount: 88,
    commentCount: 23,
    status: 'published'
  },
  {
    id: 2,
    title: 'Vue3 + TypeScript 实战经验分享',
    content: '# Vue3 + TypeScript 实战经验分享\n\n## 1. 项目搭建\n...',
    summary: '本文将分享在使用 Vue3 和 TypeScript 开发过程中的一些经验和技巧...',
    category: 'tech',
    tags: ['Vue3', 'TypeScript', '实战'],
    author: {
      id: 1,
      name: 'John Doe',
      avatar: 'https://picsum.photos/50/50?random=1'
    },
    publishTime: '2024-01-19 14:30:00',
    viewCount: 856,
    likeCount: 66,
    commentCount: 15,
    status: 'published'
  }
]

// 博客分类
const categories = [
  { label: '技术', value: 'tech' },
  { label: '设计', value: 'design' },
  { label: '产品', value: 'product' },
  { label: '思考', value: 'thinking' },
  { label: '生活', value: 'life' }
]

// 博客标签
const tags = ['前端', 'Vue3', 'TypeScript', 'Web Components', '技术趋势', '实战']

export default [
  // 获取博客列表
  {
    url: '/api/blog/list',
    method: 'get',
    response: ({ query }) => {
      let result = [...blogPosts]
      const { category, tag, keyword, page = 1, pageSize = 10 } = query
      
      // 分类筛选
      if (category) {
        result = result.filter(post => post.category === category)
      }
      
      // 标签筛选
      if (tag) {
        result = result.filter(post => post.tags.includes(tag))
      }
      
      // 关键词搜索
      if (keyword) {
        const kw = keyword.toLowerCase()
        result = result.filter(post => 
          post.title.toLowerCase().includes(kw) ||
          post.summary.toLowerCase().includes(kw)
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
          page: Number(page),
          pageSize: Number(pageSize)
        }
      }
    }
  },
  
  // 获取博客详情
  {
    url: '/api/blog/:id',
    method: 'get',
    response: ({ params }) => {
      const post = blogPosts.find(p => p.id === Number(params.id))
      
      if (!post) {
        return {
          code: 404,
          message: '博客不存在'
        }
      }
      
      return {
        code: 200,
        message: '获取成功',
        data: post
      }
    }
  },
  
  // 创建博客
  {
    url: '/api/blog',
    method: 'post',
    response: ({ body }) => {
      const newPost: BlogPost = {
        id: blogPosts.length + 1,
        ...body,
        author: {
          id: 1,
          name: 'John Doe',
          avatar: 'https://picsum.photos/50/50?random=1'
        },
        publishTime: new Date().toISOString(),
        viewCount: 0,
        likeCount: 0,
        commentCount: 0
      }
      
      blogPosts.unshift(newPost)
      
      return {
        code: 200,
        message: '创建成功',
        data: newPost
      }
    }
  },
  
  // 更新博客
  {
    url: '/api/blog/:id',
    method: 'put',
    response: ({ params, body }) => {
      const index = blogPosts.findIndex(p => p.id === Number(params.id))
      
      if (index === -1) {
        return {
          code: 404,
          message: '博客不存在'
        }
      }
      
      blogPosts[index] = {
        ...blogPosts[index],
        ...body,
        updateTime: new Date().toISOString()
      }
      
      return {
        code: 200,
        message: '更新成功',
        data: blogPosts[index]
      }
    }
  },
  
  // 删除博客
  {
    url: '/api/blog/:id',
    method: 'delete',
    response: ({ params }) => {
      const index = blogPosts.findIndex(p => p.id === Number(params.id))
      
      if (index === -1) {
        return {
          code: 404,
          message: '博客不存在'
        }
      }
      
      blogPosts.splice(index, 1)
      
      return {
        code: 200,
        message: '删除成功'
      }
    }
  },
  
  // 点赞博客
  {
    url: '/api/blog/:id/like',
    method: 'post',
    response: ({ params }) => {
      const post = blogPosts.find(p => p.id === Number(params.id))
      
      if (!post) {
        return {
          code: 404,
          message: '博客不存在'
        }
      }
      
      post.likeCount++
      
      return {
        code: 200,
        message: '点赞成功',
        data: post
      }
    }
  },
  
  // 获取分类列表
  {
    url: '/api/blog/categories',
    method: 'get',
    response: () => {
      return {
        code: 200,
        message: '获取成功',
        data: categories
      }
    }
  },
  
  // 获取标签列表
  {
    url: '/api/blog/tags',
    method: 'get',
    response: () => {
      return {
        code: 200,
        message: '获取成功',
        data: tags
      }
    }
  }
] as MockMethod[] 