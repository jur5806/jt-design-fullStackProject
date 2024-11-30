// 收藏夹相关类型
export interface Bookmark {
  id: number
  title: string
  url: string
  icon?: string
  description?: string
  category: string
  tags: string[]
  createTime: string
  updateTime?: string
  visitCount: number
}

export interface BookmarkCategory {
  label: string
  value: string
}

export interface CreateBookmarkParams {
  title: string
  url: string
  description?: string
  category: string
  tags: string[]
}

export interface UpdateBookmarkParams extends Partial<CreateBookmarkParams> {
  id: number
}

export interface GetBookmarksParams {
  category?: string
  tag?: string
  keyword?: string
}

// 文件相关类型
export interface FileItem {
  id: number
  name: string
  type: string // 文件类型：folder/file
  size?: number
  extension?: string
  path: string
  parentId: number | null
  createTime: string
  updateTime?: string
  downloadCount: number
  isPublic: boolean
  tags: string[]
}

export interface CreateFolderParams {
  name: string
  parentId?: number
  isPublic?: boolean
}

export interface UploadFileParams {
  file: File
  parentId?: number
  isPublic?: boolean
  tags?: string[]
}

export interface GetFilesParams {
  parentId?: number
  type?: string
  keyword?: string
}

// 网站导航相关类型
export interface Website {
  id: number
  title: string
  url: string
  icon: string
  description: string
  category: string
  tags: string[]
  createTime: string
  updateTime?: string
  visitCount: number
  likeCount: number
  isRecommended: boolean
}

export interface WebsiteCategory {
  label: string
  value: string
}

export interface CreateWebsiteParams {
  title: string
  url: string
  description: string
  category: string
  tags: string[]
}

export interface GetWebsitesParams {
  category?: string
  tag?: string
  keyword?: string
  recommended?: boolean
} 