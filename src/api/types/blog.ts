export interface BlogPost {
  id: number
  title: string
  content: string
  summary: string
  category: string
  cover?: string
  tags: string[]
  author: {
    id: number
    name: string
    avatar: string
  }
  publishTime: string
  updateTime?: string
  viewCount: number
  likeCount: number
  commentCount: number
  status: 'draft' | 'published'
}

export interface CreateBlogParams {
  title: string
  content: string
  summary: string
  category: string
  cover?: string
  tags: string[]
  status: 'draft' | 'published'
}

export interface UpdateBlogParams extends Partial<CreateBlogParams> {
  id: number
}

export interface BlogListParams {
  category?: string
  tag?: string
  keyword?: string
  page?: number
  pageSize?: number
  status?: 'draft' | 'published'
}

export interface BlogListResponse {
  list: BlogPost[]
  total: number
  page: number
  pageSize: number
} 