import { request } from '@/plugins/request'

export class User {
  // 用户登录
  static login = (data) => {
    return request.post('/api/users/login', data)
  };

  static register = (data) => {
    return request.post('/api/users', data)
  };

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
