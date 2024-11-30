export interface Photo {
  id: number
  url: string
  title: string
  description: string
  category: string
  date: string
  likes: number
  author: string
}

export interface Article {
  id: number
  title: string
  description: string
  cover: string
  category: string
  author: {
    name: string
    avatar: string
  }
  publishTime: string
  views: number
  likes: number
  comments: number
  url: string
}

export interface GetPhotosParams {
  category?: string
  limit?: number
}

export interface GetArticlesParams {
  category?: string
  keyword?: string
  limit?: number
} 