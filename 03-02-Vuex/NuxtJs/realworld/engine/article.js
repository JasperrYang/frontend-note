import { request } from '@/plugins/request'

export class Article {
  // 获取公共文章列表
  static getArticles = (params) => {
    return request.get('/api/articles', { params })
  };

  // 获取公共文章列表
  static getYourFeedArticles = (params) => {
    return request.get('/api/articles/feed', { params })
  };

  // 添加点赞
  static addFavorite = (slug) => {
    return request.post(`/api/articles/${slug}/favorite`)
  };

  // 取消点赞
  static deleteFavorite = (slug) => {
    return request.delete(`/api/articles/${slug}/favorite`)
  };

  // 获取文章详情
  static getArticle = (slug) => {
    return request.get(`/api/articles/${slug}`)
  };

  // 获取文章评论
  static getComments = (slug) => {
    return request.get(`/api/articles/${slug}/comments`)
  };
}
