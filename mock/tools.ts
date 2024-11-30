import { MockMethod } from 'vite-plugin-mock'
import type { Bookmark, BookmarkCategory, FileItem } from '@/api/types/tools'

// 模拟收藏夹数据
const bookmarks: Bookmark[] = [
  {
    id: 1,
    title: 'GitHub',
    url: 'https://github.com',
    icon: 'https://github.com/favicon.ico',
    description: '全球最大的代码托管平台',
    category: 'dev',
    tags: ['开发', '代码', '开源'],
    createTime: '2024-01-20 10:00:00',
    visitCount: 100
  },
  {
    id: 2,
    title: 'Vue.js',
    url: 'https://vuejs.org',
    icon: 'https://vuejs.org/logo.png',
    description: '渐进式 JavaScript 框架',
    category: 'dev',
    tags: ['前端', 'JavaScript', '框架'],
    createTime: '2024-01-19 15:00:00',
    visitCount: 80
  },
  {
    id: 3,
    title: '掘金',
    url: 'https://juejin.cn',
    icon: 'https://juejin.cn/favicon.ico',
    description: '开发者社区',
    category: 'community',
    tags: ['技术', '社区', '博客'],
    createTime: '2024-01-18 09:00:00',
    visitCount: 60
  }
]

// 收藏分类
const categories: BookmarkCategory[] = [
  { label: '开发工具', value: 'dev' },
  { label: '技术社区', value: 'community' },
  { label: '学习资源', value: 'learn' },
  { label: '工具网站', value: 'tools' },
  { label: '娱乐休闲', value: 'entertainment' }
]

// 模拟文件数据
const files: FileItem[] = [
  {
    id: 1,
    name: '我的文档',
    type: 'folder',
    path: '/我的文档',
    parentId: null,
    createTime: '2024-01-20 10:00:00',
    downloadCount: 0,
    isPublic: true,
    tags: []
  },
  {
    id: 2,
    name: '工作文件',
    type: 'folder',
    path: '/工作文件',
    parentId: null,
    createTime: '2024-01-20 11:00:00',
    downloadCount: 0,
    isPublic: false,
    tags: []
  },
  {
    id: 3,
    name: '项目说明.docx',
    type: 'file',
    size: 1024 * 1024,
    extension: 'docx',
    path: '/工作文件/项目说明.docx',
    parentId: 2,
    createTime: '2024-01-20 12:00:00',
    downloadCount: 5,
    isPublic: false,
    tags: ['文档', '项目']
  }
]

// 模拟网站数据
const websites = [
  {
    id: 1,
    title: 'GitHub',
    url: 'https://github.com',
    icon: 'https://github.com/favicon.ico',
    description: '全球最大的代码托管平台',
    category: 'dev',
    tags: ['开发', '代码', '开源'],
    createTime: '2024-01-20 10:00:00',
    visitCount: 1234,
    likeCount: 88,
    isRecommended: true
  },
  {
    id: 2,
    title: 'Figma',
    url: 'https://figma.com',
    icon: 'https://figma.com/favicon.ico',
    description: '专业的在线设计工具',
    category: 'design',
    tags: ['设计', 'UI', '协作'],
    createTime: '2024-01-19 15:00:00',
    visitCount: 856,
    likeCount: 66,
    isRecommended: true
  },
  {
    id: 3,
    title: 'ChatGPT',
    url: 'https://chat.openai.com',
    icon: 'https://chat.openai.com/favicon.ico',
    description: '强大的AI对话工具',
    category: 'productivity',
    tags: ['AI', '效率', '工具'],
    createTime: '2024-01-18 09:00:00',
    visitCount: 2345,
    likeCount: 156,
    isRecommended: true
  }
]

// 网站分类
const websiteCategories = [
  { label: '开发工具', value: 'dev' },
  { label: '设计资源', value: 'design' },
  { label: '效率工具', value: 'productivity' },
  { label: '学习资源', value: 'learn' },
  { label: '娱乐休闲', value: 'entertainment' }
]

export default [
  // 获取收藏列表
  {
    url: '/api/tools/bookmarks',
    method: 'get',
    response: ({ query }) => {
      let result = [...bookmarks]
      
      // 分类筛选
      if (query.category) {
        result = result.filter(item => item.category === query.category)
      }
      
      // 标签筛选
      if (query.tag) {
        result = result.filter(item => item.tags.includes(query.tag))
      }
      
      // 关键词搜索
      if (query.keyword) {
        const keyword = query.keyword.toLowerCase()
        result = result.filter(item => 
          item.title.toLowerCase().includes(keyword) ||
          item.description?.toLowerCase().includes(keyword)
        )
      }
      
      return {
        code: 200,
        message: '获取成功',
        data: result
      }
    }
  },
  
  // 获取分类列表
  {
    url: '/api/tools/bookmark-categories',
    method: 'get',
    response: () => {
      return {
        code: 200,
        message: '获取成功',
        data: categories
      }
    }
  },
  
  // 创建收藏
  {
    url: '/api/tools/bookmarks',
    method: 'post',
    response: ({ body }) => {
      const newBookmark: Bookmark = {
        id: bookmarks.length + 1,
        ...body,
        icon: `https://www.google.com/s2/favicons?domain=${body.url}`,
        createTime: new Date().toISOString(),
        visitCount: 0
      }
      
      bookmarks.unshift(newBookmark)
      
      return {
        code: 200,
        message: '创建成功',
        data: newBookmark
      }
    }
  },
  
  // 更新收藏
  {
    url: '/api/tools/bookmarks/:id',
    method: 'put',
    response: ({ params, body }) => {
      const index = bookmarks.findIndex(item => item.id === Number(params.id))
      
      if (index === -1) {
        return {
          code: 404,
          message: '收藏不存在'
        }
      }
      
      bookmarks[index] = {
        ...bookmarks[index],
        ...body,
        updateTime: new Date().toISOString()
      }
      
      return {
        code: 200,
        message: '更新成功',
        data: bookmarks[index]
      }
    }
  },
  
  // 删除收藏
  {
    url: '/api/tools/bookmarks/:id',
    method: 'delete',
    response: ({ params }) => {
      const index = bookmarks.findIndex(item => item.id === Number(params.id))
      
      if (index === -1) {
        return {
          code: 404,
          message: '收藏不存在'
        }
      }
      
      bookmarks.splice(index, 1)
      
      return {
        code: 200,
        message: '删除成功'
      }
    }
  },
  
  // 访问收藏
  {
    url: '/api/tools/bookmarks/:id/visit',
    method: 'post',
    response: ({ params }) => {
      const bookmark = bookmarks.find(item => item.id === Number(params.id))
      
      if (!bookmark) {
        return {
          code: 404,
          message: '收藏不存在'
        }
      }
      
      bookmark.visitCount++
      
      return {
        code: 200,
        message: '访问成功',
        data: bookmark
      }
    }
  },
  
  // 获取文件列表
  {
    url: '/api/tools/files',
    method: 'get',
    response: ({ query }) => {
      try {
        let result = [...files]
        
        // 父级ID筛选
        if (query.parentId !== undefined) {
          result = result.filter(file => file.parentId === (query.parentId ? Number(query.parentId) : null))
        }
        
        // 类型筛选
        if (query.type) {
          result = result.filter(file => file.type === query.type)
        }
        
        // 关键词搜索
        if (query.keyword) {
          const keyword = query.keyword.toLowerCase()
          result = result.filter(file => 
            file.name.toLowerCase().includes(keyword)
          )
        }
        
        return {
          code: 200,
          message: '获取成功',
          data: result
        }
      } catch (error) {
        return {
          code: 500,
          message: '服务器错误',
          data: []
        }
      }
    }
  },
  
  // 创建文件夹
  {
    url: '/api/tools/files/folder',
    method: 'post',
    response: ({ body }) => {
      const newFolder: FileItem = {
        id: files.length + 1,
        name: body.name,
        type: 'folder',
        path: body.parentId ? `${files.find(f => f.id === body.parentId)?.path}/${body.name}` : `/${body.name}`,
        parentId: body.parentId || null,
        createTime: new Date().toISOString(),
        downloadCount: 0,
        isPublic: body.isPublic || false,
        tags: []
      }
      
      files.push(newFolder)
      
      return {
        code: 200,
        message: '创建成功',
        data: newFolder
      }
    }
  },
  
  // 上传文件
  {
    url: '/api/tools/files/upload',
    method: 'post',
    response: ({ body }) => {
      try {
        const fileName = body.get('name') || '未命名文件'
        const parentId = body.get('parentId')
        const isPublic = body.get('isPublic')
        const tags = body.get('tags')

        const newFile: FileItem = {
          id: files.length + 1,
          name: fileName,
          type: 'file',
          size: 1024 * 1024, // 模拟文件大小
          extension: fileName.split('.').pop() || '',
          path: parentId ? 
            `${files.find(f => f.id === Number(parentId))?.path || ''}/${fileName}` : 
            `/${fileName}`,
          parentId: parentId ? Number(parentId) : null,
          createTime: new Date().toISOString(),
          downloadCount: 0,
          isPublic: isPublic === 'true',
          tags: tags ? JSON.parse(tags) : []
        }
        
        files.push(newFile)
        
        return {
          code: 200,
          message: '上传成功',
          data: newFile
        }
      } catch (error) {
        return {
          code: 500,
          message: '上传失败',
          data: null
        }
      }
    }
  },
  
  // 删除文件/文件夹
  {
    url: '/api/tools/files/:id',
    method: 'delete',
    response: ({ url }) => {
      // 从 URL 中提取 ID
      const id = parseInt(url.split('/').pop() || '0')
      const index = files.findIndex(file => file.id === id)
      
      if (index === -1) {
        return {
          code: 404,
          message: '文件不存在'
        }
      }
      
      files.splice(index, 1)
      
      return {
        code: 200,
        message: '删除成功'
      }
    }
  },
  
  // 下载文件
  {
    url: '/api/tools/files/:id/download',
    method: 'get',
    response: ({ url }) => {
      // 从 URL 中提取 ID
      const id = parseInt(url.split('/').slice(-2)[0] || '0')
      const file = files.find(file => file.id === id)
      
      if (!file) {
        return {
          code: 404,
          message: '文件不存在'
        }
      }
      
      file.downloadCount++
      
      return {
        code: 200,
        message: '下载成功',
        data: {
          url: `https://example.com/files/${file.id}`
        }
      }
    }
  },
  
  // 修改文件/文件夹信息
  {
    url: '/api/tools/files/:id',
    method: 'put',
    response: ({ url, body }) => {
      // 从 URL 中提取 ID
      const id = parseInt(url.split('/').pop() || '0')
      const index = files.findIndex(file => file.id === id)
      
      if (index === -1) {
        return {
          code: 404,
          message: '文件不存在'
        }
      }
      
      files[index] = {
        ...files[index],
        ...body,
        updateTime: new Date().toISOString()
      }
      
      return {
        code: 200,
        message: '更新成功',
        data: files[index]
      }
    }
  },
  
  // 获取网站列表
  {
    url: '/api/tools/websites',
    method: 'get',
    response: ({ query }) => {
      let result = [...websites]
      
      // 分类筛选
      if (query.category) {
        result = result.filter(site => site.category === query.category)
      }
      
      // 标签筛选
      if (query.tag) {
        result = result.filter(site => site.tags.includes(query.tag))
      }
      
      // 关键词搜索
      if (query.keyword) {
        const keyword = query.keyword.toLowerCase()
        result = result.filter(site => 
          site.title.toLowerCase().includes(keyword) ||
          site.description.toLowerCase().includes(keyword)
        )
      }
      
      // 推荐筛选
      if (query.recommended) {
        result = result.filter(site => site.isRecommended)
      }
      
      return {
        code: 200,
        message: '获取成功',
        data: result
      }
    }
  },

  // 获取网站分类
  {
    url: '/api/tools/website-categories',
    method: 'get',
    response: () => {
      return {
        code: 200,
        message: '获取成功',
        data: websiteCategories
      }
    }
  },

  // 创建网站
  {
    url: '/api/tools/websites',
    method: 'post',
    response: ({ body }) => {
      const newWebsite = {
        id: websites.length + 1,
        ...body,
        icon: `https://www.google.com/s2/favicons?domain=${body.url}`,
        createTime: new Date().toISOString(),
        visitCount: 0,
        likeCount: 0,
        isRecommended: false
      }
      
      websites.unshift(newWebsite)
      
      return {
        code: 200,
        message: '创建成功',
        data: newWebsite
      }
    }
  },

  // 点赞网站
  {
    url: '/api/tools/websites/:id/like',
    method: 'post',
    response: ({ url }) => {
      const id = parseInt(url.split('/').slice(-2)[0])
      const website = websites.find(site => site.id === id)
      
      if (!website) {
        return {
          code: 404,
          message: '网站不存在'
        }
      }
      
      website.likeCount++
      
      return {
        code: 200,
        message: '点赞成功',
        data: website
      }
    }
  },

  // 访问网站
  {
    url: '/api/tools/websites/:id/visit',
    method: 'post',
    response: ({ url }) => {
      const id = parseInt(url.split('/').slice(-2)[0])
      const website = websites.find(site => site.id === id)
      
      if (!website) {
        return {
          code: 404,
          message: '网站不存在'
        }
      }
      
      website.visitCount++
      
      return {
        code: 200,
        message: '访问成功',
        data: website
      }
    }
  }
] as MockMethod[] 