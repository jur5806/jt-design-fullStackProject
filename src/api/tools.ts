import request from '@/utils/request'
import type { 
  Bookmark, 
  CreateBookmarkParams, 
  UpdateBookmarkParams, 
  GetBookmarksParams,
  BookmarkCategory,
  FileItem,
  CreateFolderParams,
  UploadFileParams,
  GetFilesParams,
  Website,
  WebsiteCategory,
  CreateWebsiteParams,
  GetWebsitesParams
} from './types/tools'

// 获取收藏夹列表
export function getBookmarks(params?: GetBookmarksParams) {
  return request<Bookmark[]>({
    url: '/api/tools/bookmarks',
    method: 'get',
    params
  })
}

// 获取收藏分类
export function getBookmarkCategories() {
  return request<BookmarkCategory[]>({
    url: '/api/tools/bookmark-categories',
    method: 'get'
  })
}

// 创建收藏
export function createBookmark(data: CreateBookmarkParams) {
  return request<Bookmark>({
    url: '/api/tools/bookmarks',
    method: 'post',
    data
  })
}

// 更新收藏
export function updateBookmark(data: UpdateBookmarkParams) {
  return request<Bookmark>({
    url: `/api/tools/bookmarks/${data.id}`,
    method: 'put',
    data
  })
}

// 删除收藏
export function deleteBookmark(id: number) {
  return request({
    url: `/api/tools/bookmarks/${id}`,
    method: 'delete'
  })
}

// 访问收藏
export function visitBookmark(id: number) {
  return request({
    url: `/api/tools/bookmarks/${id}/visit`,
    method: 'post'
  })
}

// 获取文件列表
export function getFiles(params?: GetFilesParams) {
  return request<FileItem[]>({
    url: '/api/tools/files',
    method: 'get',
    params
  })
}

// 创建文件夹
export function createFolder(data: CreateFolderParams) {
  return request<FileItem>({
    url: '/api/tools/files/folder',
    method: 'post',
    data
  })
}

// 上传文件
export function uploadFile(data: FormData) {
  return request<FileItem>({
    url: '/api/tools/files/upload',
    method: 'post',
    headers: {
      'Content-Type': 'multipart/form-data'
    },
    data
  })
}

// 删除文件/文件夹
export function deleteFile(id: number) {
  return request({
    url: `/api/tools/files/${id}`,
    method: 'delete'
  })
}

// 下载文件
export function downloadFile(id: number) {
  return request({
    url: `/api/tools/files/${id}/download`,
    method: 'get',
    responseType: 'blob'
  })
}

// 修改文件/文件夹信息
export function updateFile(id: number, data: Partial<FileItem>) {
  return request<FileItem>({
    url: `/api/tools/files/${id}`,
    method: 'put',
    data
  })
}

// 获取网站列表
export function getWebsites(params?: GetWebsitesParams) {
  return request<Website[]>({
    url: '/api/tools/websites',
    method: 'get',
    params
  })
}

// 获取网站分类
export function getWebsiteCategories() {
  return request<WebsiteCategory[]>({
    url: '/api/tools/website-categories',
    method: 'get'
  })
}

// 添加网站
export function createWebsite(data: CreateWebsiteParams) {
  return request<Website>({
    url: '/api/tools/websites',
    method: 'post',
    data
  })
}

// 点赞网站
export function likeWebsite(id: number) {
  return request({
    url: `/api/tools/websites/${id}/like`,
    method: 'post'
  })
}

// 访问网站
export function visitWebsite(id: number) {
  return request({
    url: `/api/tools/websites/${id}/visit`,
    method: 'post'
  })
} 