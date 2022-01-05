import { request } from '@/plugins/request'

export class User {
  // 用户登录
  static login = (params) => {
    return request.post('/api/users/login', params)
  };

  static register = (params) => {
    return request.post('/api/users', params)
  };

  static update = (params) => {
    return request.put('/api/user', params)
  }

  static getProfiles = (username) => {
    return request.get(`/api/profiles/${username}`)
  }

  static follow = (username) => {
    return request.post(`api/profiles/${username}/follow`)
  }

  static unfollow = (username) => {
    return request.delete(`api/profiles/${username}/follow`)
  }
}
