import axios from 'axios'
import { MessageBox, Message, Loading, Icon } from 'element-ui'
import storage from 'store'
import store from '@/store'
import { getToken } from '@/utils/auth'

// create an axios instance
const service = axios.create({
  baseURL: process.env.VUE_APP_BASE_API, // url = base url + request url
  // withCredentials: true, // send cookies when cross-domain requests
  timeout: 30000 // request timeout
})
let loading

// 全局loading
function startLoading() {    //使用Element loading-start 方法
  loading = Loading.service({
    lock: true,
    text: '拼命加载中',
    spinne: 'el-icon-loading',
    background: 'rgba(0, 0, 0, 0.7)'
  })
}

function endLoading() {    //使用Element loading-close 方法
  loading.close()
}

const isSuccess = res => res.code === 200
const TOKENERROR = [401, 402, 403]

// request interceptor
service.interceptors.request.use(
  config => {

    const tokenValue = window.sessionStorage.getItem('Access-Token')
    if (tokenValue != undefined && tokenValue != '') config.headers['access_token'] = tokenValue
    return config
  },
  error => {
    // do something with request error
    console.log(error) // for debug
    return Promise.reject(error)
  }
)
// response interceptor
service.interceptors.response.use(
  /**
   * If you want to get http information such as headers or status
   * Please return  response => response
   */

  /**
   * Determine the request status by custom code
   * Here is just an example
   * You can also judge the status by HTTP Status Code
   */
  response => {
    // setTimeout(function(){
    //   endLoading()
    // },300)

    // if (!isSuccess(response.data)) {
    //   if (TOKENERROR.includes(response.data.code)) {
    //     store.dispatch('auth/Logout').then(() => {
    //       auth.getLoginUrl().then(res => {
    //         window.location.href = res
    //       })
    //     })
    //   }
    //   const _err = {
    //     msg: response.data.message,
    //     errCode: response.data.code
    //   }
    //   return Promise.reject(_err)
    // } else {
      return response.data
    // }
    //const res = response.data

    // if the custom code is not 20000, it is judged as an error.
    // if (res.code !== 20000) {
    //   Message({
    //     message: res.message || 'Error',
    //     type: 'error',
    //     duration: 5 * 1000
    //   })

    //   // 50008: Illegal token; 50012: Other clients logged in; 50014: Token expired;
    //   if (res.code === 50008 || res.code === 50012 || res.code === 50014) {
    //     // to re-login
    //     MessageBox.confirm('You have been logged out, you can cancel to stay on this page, or log in again', 'Confirm logout', {
    //       confirmButtonText: 'Re-Login',
    //       cancelButtonText: 'Cancel',
    //       type: 'warning'
    //     }).then(() => {
    //       store.dispatch('user/resetToken').then(() => {
    //         location.reload()
    //       })
    //     })
    //   }
    //   return Promise.reject(new Error(res.message || 'Error'))
    // } else {
    //   return res
    // }
  },
  error => {
    return Promise.reject(error)
  }
)

export default service
