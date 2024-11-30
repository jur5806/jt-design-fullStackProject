import request from '@/utils/request'
import type { BlogPost, CreateBlogParams, UpdateBlogParams, BlogListParams, BlogListResponse } from './types/blog'

// 获取博客列表
export function getBlogList(params: BlogListParams) {
  return request<BlogListResponse>({
    url: '/api/blog/list',
    method: 'get',
    params
  })
}

// 获取博客详情
export function getBlogDetail(id: number) {
  return request<BlogPost>({
    url: `/api/blog/${id}`,
    method: 'get'
  })
}

// 创建博客
export function createBlog(data: CreateBlogParams) {
  return request<BlogPost>({
    url: '/api/blog',
    method: 'post',
    data
  })
}

// 更新博客
export function updateBlog(data: UpdateBlogParams) {
  return request<BlogPost>({
    url: `/api/blog/${data.id}`,
    method: 'put',
    data
  })
}

// 删除博客
export function deleteBlog(id: number) {
  return request({
    url: `/api/blog/${id}`,
    method: 'delete'
  })
}

// 点赞博客
export function likeBlog(id: number) {
  return request({
    url: `/api/blog/${id}/like`,
    method: 'post'
  })
}

// 获取博客分类列表
export function getBlogCategories() {
  return request<{ label: string; value: string }[]>({
    url: '/api/blog/categories',
    method: 'get'
  })
}

// 获取博客标签列表
export function getBlogTags() {
  return request<string[]>({
    url: '/api/blog/tags',
    method: 'get'
  })
} 