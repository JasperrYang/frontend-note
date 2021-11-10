import { request } from '@/plugins/request'

export class Tag {
  // 获取文章标签列表
  static getTags = () => {
    return request.get('/api/tags')
  }
}
