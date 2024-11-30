import request from '@/utils/request'

// 获取照片列表
export function getPhotos(params?: { category?: string }) {
  return request({
    url: '/api/showcase/photos',
    method: 'get',
    params
  })
}

// 获取文章列表
export function getArticles(params?: { category?: string; keyword?: string }) {
  return request({
    url: '/api/showcase/articles',
    method: 'get',
    params
  })
}

// 上传照片
export function uploadPhoto(data: FormData) {
  return request({
    url: '/api/showcase/upload',
    method: 'post',
    headers: {
      'Content-Type': 'multipart/form-data'
    },
    data
  })
}

// 点赞
export function like(data: { id: number; type: 'photo' | 'article' }) {
  return request({
    url: '/api/showcase/like',
    method: 'post',
    data
  })
} 