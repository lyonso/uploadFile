/**
 * 状态管理modules => ma
 * author: Wang <wangh@ciqtek.com>
 * company: ubiot.cn
 * date: 2019-10-21
 */

import { linuxApi } from '@/api'

const state = {
  list: [],
  sampleList: [],
  time: '',
  detail: [],
  detailId: ''
}

const mutations = {
  SET_LIST: (state, list) => {
    state.list = list
  },
  SET_SAMPLE_LIST: (state, list) => {
    state.sampleList = list
  },
  SET_TIME: (state, time) => {
    state.time = time
  },
  SET_DETAIL: (state, detail) => {
    state.detail = detail
  },
  SET_DETAIL_ID: (state, id) => {
    state.detailId = id
  }
}

const actions = {
  /**
   * 获取重要设备
   * @param commit
   */
  fetchImportant({ commit }) {
    return new Promise(async (resolve, reject) => {
      try {
        const { data } = await linuxApi.EquiptInformation({equiptids:'A010013,A080401,A010011'})
        commit('SET_LIST', data)
        resolve()
      } catch (e) {
        reject(e)
      }
    })
  },
  /**
   * 获取在检样品
   * @param commit
   * @param time
   */
  fetchSample({ commit }, time) {
    return new Promise(async (resolve, reject) => {
      try {
        commit('SET_TIME', time)
        const { data } = await linuxApi.SampleFlow({ SDATE: time, EDATE: time })
        commit('SET_SAMPLE_LIST', data)
        resolve()
      } catch (e) {
        reject(e)
      }
    })
  },
  /**
   * 获取样品详情
   * @param commit
   * @param obj
   */
  fetchDetail({ commit }, obj) {
    return new Promise(async (resolve, reject) => {
      try {
        const { data } = await linuxApi.OrderTaskResluts({ ORDERNO: obj.id })
        commit('SET_DETAIL_ID', obj.key)
        commit('SET_DETAIL', data)
        resolve()
      } catch (e) {
        reject(e)
      }
    })
  }
}
export default {
  namespaced: true,
  state,
  mutations,
  actions
}
