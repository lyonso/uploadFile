/**
 * 状态管理modules => user
 * author: Wang <wangh@ciqtek.com>
 * company: ubiot.cn
 * date: 2019-10-21
 */

import storage from 'store'
import { auth } from '@/api'

const state = {
  userInfo: {},
  tokenName: '',
  token: ''
}

const mutations = {
  SET_USERID: (state, userInfo) => {
    state.userInfo = userInfo
  },
  SET_TOKEN: (state, token) => {
    state.token = token
  },
  SET_TOKEN_NAME: (state, name) => {
    state.tokenName = name
  }
}

const actions = {
  SET_TOKEN({ commit }, userInfo) {
    return new Promise((resolve, reject) => {
      sessionStorage.setItem('Access-Token',userInfo.code)
      commit('SET_TOKEN', userInfo.code)
      auth.cacheAccessToken({ access_token: userInfo.code }).then(response => {
        resolve()
      }).catch(error => {
        reject(error)
      })
    })
  },
  Logout({ commit, state }) {
    return new Promise((resolve) => {
      sessionStorage.clear();
      window.location.href = 'http://10.8.45.15:9000/portal/index'
    })
  }

}

export default {
  namespaced: true,
  state,
  mutations,
  actions
}
