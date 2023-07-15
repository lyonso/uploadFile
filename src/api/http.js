/**
 * HTTP请求封装
 * @author Wanghui <wangh@ciqtek.com>
 * @company ubiot.cn
 * @date 2019-11-09
 */

import axios from 'axios'
import qs from 'qs'
import _ from 'lodash'
import store from '@/store'
import storage from 'store'
import router from '@/router'

const isSuccess = res => res.code === 200
const COMMON_CODE = [404, 405]
const TOKENERROR = [401]

const service = axios.create({
  baseURL: process.env.VUE_APP_BASE_API,
  timeout: 30000, // 请求超时
  withCredentials: true // 跨域请求时发送 cookies
})

// 请求拦截器
service.interceptors.request.use(
  cfg => {
    cfg.params = { ...cfg.params }
    return cfg
  },
  error => {

    return Promise.reject(error)
  }
)

// 响应拦截器
service.interceptors.response.use(
  response => {
    const { config } = response
    const { responseType } = config
    if (responseType.toLowerCase() === 'blob') return response.data
    if (responseType === 'url') return response.data
    if (!isSuccess(response.data)) {
      if (TOKENERROR.includes(response.data.code)) {
        console.log('进来了')
        store.dispatch('auth/Logout')
      }
      const _err = {
        msg: response.data.message,
        errCode: response.data.code
      }
      return Promise.reject(_err)
    } else {
      return response.data
    }

  },
  error => {
    if (COMMON_CODE.includes(error.response.status)) {
      return Promise.reject({
        msg: '找不到服务器',
        errCode: error.response.status
      })
    }
    return Promise.reject(error)
  }
)

const http = ({ url, method, data, json = false, responseType = '',needToken=true }) => {
  const headers = {}
  _.merge(headers, { 'Content-Type': json ? 'application/json' : 'application/x-www-form-urlencoded' })
  if (needToken){
    const tokenValue = window.sessionStorage.getItem('Access-Token')
    if (tokenValue != undefined && tokenValue != '') headers['access_token'] = tokenValue
  }
  const axiosConfig = {
    method,
    url,
    headers,
    responseType
  }
  if (method.toLowerCase() === 'get') {
    axiosConfig.params = data
  } else if (data instanceof FormData) {
    axiosConfig.data = data
  } else {
    axiosConfig.data = json ? data : qs.stringify(data)
  }
  return new Promise((resolve, reject) => {
    service
      .request(axiosConfig)
      .then(res => resolve(res))
      .catch(async err => {
        reject(err)
      })
  })
}

export default http

