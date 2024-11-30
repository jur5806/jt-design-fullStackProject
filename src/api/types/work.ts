// 组件模板相关类型
export interface ComponentTemplate {
  id: number
  name: string
  description: string
  category: string
  tags: string[]
  preview: string // 预览图
  code: string // 代码内容
  framework: 'vue' | 'react' | 'angular' // 框架类型
  dependencies: string[] // 依赖项
  createTime: string
  updateTime?: string
  author: {
    id: number
    name: string
    avatar: string
  }
  downloads: number
  likes: number
}

// 图标资源相关类型
export interface IconResource {
  id: number
  name: string
  category: string
  tags: string[]
  svg: string // SVG内容
  color?: string
  size?: number
  createTime: string
  downloads: number
}

export interface GetTemplatesParams {
  category?: string
  framework?: string
  tag?: string
  keyword?: string
}

export interface GetIconsParams {
  category?: string
  tag?: string
  keyword?: string
} 