/**
 * 路由导航守卫
 * author: Wang <wangh@ciqtek.com>
 * company: ubiot.cn
 * date: 2019-10-31
 */

import router from './router'
import { TITLE } from '@/config'
import store from './store'

router.beforeEach((to, from, next) => {
  document.title = `${to.meta.title} - ${TITLE}`
  // next()
  if (!window.sessionStorage['Access-Token']) {
    let url = window.location.href
    if (url.indexOf('accessToken=') != -1) {
      url = url.substring(url.indexOf('accessToken='), url.length)
      url = url.substr(12, url.length)
      store.dispatch('auth/SET_TOKEN', { code: url })
        .then(() => {
          next()
      })
    } else {
      store.dispatch('auth/Logout')
    }
  } else {
    next()
  }
})

router.afterEach(() => {

})

