import request from '@/utils/request'
import type { 
  ComponentTemplate, 
  IconResource, 
  GetTemplatesParams, 
  GetIconsParams 
} from './types/work'

// 获取组件模板列表
export function getTemplates(params?: GetTemplatesParams) {
  return request<ComponentTemplate[]>({
    url: '/api/work/templates',
    method: 'get',
    params
  })
}

// 获取组件模板详情
export function getTemplateDetail(id: number) {
  return request<ComponentTemplate>({
    url: `/api/work/templates/${id}`,
    method: 'get'
  })
}

// 下载组件模板
export function downloadTemplate(id: number) {
  return request({
    url: `/api/work/templates/${id}/download`,
    method: 'get',
    responseType: 'blob'
  })
}

// 点赞组件模板
export function likeTemplate(id: number) {
  return request({
    url: `/api/work/templates/${id}/like`,
    method: 'post'
  })
}

// 获取图标资源列表
export function getIcons(params?: GetIconsParams) {
  return request<IconResource[]>({
    url: '/api/work/icons',
    method: 'get',
    params
  })
}

// 下载图标
export function downloadIcon(id: number, options?: { format?: 'svg' | 'png'; size?: number; color?: string }) {
  return request({
    url: `/api/work/icons/${id}/download`,
    method: 'get',
    params: options,
    responseType: 'blob'
  })
} 