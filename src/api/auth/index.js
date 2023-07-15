import http from '@/api/http'

export default {
  // 登录
  login(data) {
    return http({ url: '/login', method: 'POST', data, json: false })
  },

  // 获取access_token
  accessToken(data) {
    return http({ url: '/sso/accessToken', method: 'get',data, json: false,needToken:false })
  },
  // 获取access_token
  cacheAccessToken(data) {
    return http({ url: '/sso/cacheAccessToken', method: 'get',data, json: false,needToken:false })
  },

  // 获取统一登录地址
  getLoginUrl() {
    return http({ url: '/sso/login', method: 'get' ,json: false ,responseType:'url',needToken:false})
  },
}
