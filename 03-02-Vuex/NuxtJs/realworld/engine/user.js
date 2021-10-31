import { request } from '@/plugins/request'

// 用户登录
export const login = (data) => {
  return request.post('/api/users/login', data)
}

export const register = (data) => {
  return request.post('/api/users', data)
}
